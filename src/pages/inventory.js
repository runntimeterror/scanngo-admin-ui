import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const App = () => {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
    const [columnDefs, setColumnDefs] = useState([
        { field: 'productId', filter: true, type: 'numericColumn', valueParser: params => Number(params.newValue) },
        { field: 'inventoryProductId', filter: true, type: 'numericColumn', valueParser: params => Number(params.newValue) },
        { field: 'name', filter: true },
        { field: 'imageUrl', filter: true },
        { field: 'price', valueParser: params => Number(params.newValue) },
        { field: 'qty', filter: true, type: 'numericColumn', valueParser: params => Number(params.newValue) },
        { field: 'barcode', filter: true, type: 'numericColumn' },
        { field: 'programCategory', filter: true },
        { field: 'productType', filter: true },
        { field: 'brandName', filter: true },
        { field: 'modelName', filter: true },
        { field: 'modelNumber', filter: true },
    ]);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(() => ({
        sortable: true,
        editable: true
    }));

    // Example of consuming Grid Event
    const cellClickedListener = useCallback(event => {
        console.debug('cellClicked', event);
    }, []);

    const headers = new Headers({
        "Client-Id": "d4952489-d57c-11ed-ab65-062dad11b3d9",
        "Session-Id": "d4952489-d57c-11ed-ab65-062dad11b3d9"
    });

    const config = {
        method: 'GET',
        headers: headers,
        //mode: 'cors'
    };

    //const host = 'http://scanngo-new-vpc-alb-516249725.us-west-2.elb.amazonaws.com'
    //const host = 'http://scanngo-api-alb-1470236169.us-west-2.elb.amazonaws.com'
    const host = 'http://localhost:8081'

    // Example load data from server
    useEffect(() => {
        fetch(host + '/inventory', config)
            .then(result => result.json())
            .then(rowData => setRowData(rowData))
    }, []);

    // Example using Grid's API
    const buttonListener = useCallback(e => {
        gridRef.current.api.deselectAll();
    }, []);

    const insertButtonListener = useCallback(e => {
        // const newRow = {}
        // rowData.push(newRow)
        //setRowData(rowData)
        // gridRef.current.api.setRowData(this.gridOptions.rowData)
        gridRef.current.api.applyTransaction({ add: [{}] });
    }, []);

    const onRemoveSelected = useCallback(() => {
        const rows = gridRef.current.api.getSelectedRows();
        for (let row of rows) {
            const jsonStr = JSON.stringify(row)
            console.debug(
                'onRemoveSelected: (' + jsonStr + ')'
            );
            const requestOptions = {
                method: 'DELETE',
                headers: headers,
                body: jsonStr
            };
            try {
                fetch(host + '/inventory/' + row.inventoryProductId, requestOptions)
                    .then(response => response.json())
                    .then(data => console.log('DELETE response: ' + JSON.stringify(data)))
                    .then(data => gridRef.current.api.applyTransaction({ remove: row }))
                    .catch(error => console.error(error));
            }
            catch (e) {
                console.error(e)
            }
        }
    }, []);

    const onCellValueChanged = useCallback((event) => {
        console.debug(
            'onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue
        );
    }, []);

    const onRowValueChanged = useCallback((event) => {
        var data = event.data;
        const jsonStr = JSON.stringify(data)
        console.debug(
            'onRowValueChanged: (' + jsonStr + ')'
        );
        const requestOptions = {
            method: 'PUT',
            headers: headers,
            //headers: { 'Content-Type': 'application/json' },
            body: jsonStr
        };
        fetch(host + '/inventory/' + data.inventoryProductId, requestOptions)
            .then(response => response.json())
            .then(data => console.log('PUT response: ' + JSON.stringify(data)))
        //.then(data => this.setState({ postId: data.id }));
    }, []);

    return (
        <div>

            {/* Example using Grid's API */}
            <button onClick={buttonListener}>Deselect All</button>
            <button onClick={insertButtonListener}>New Row</button>
            <button onClick={onRemoveSelected}>Remove Selected</button>

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            {/* <div className="ag-theme-alpine" style={{ width: 500, height: 500 }}> */}
            <div className="ag-theme-alpine" style={{ width: '100%', height: 800 }}>

                <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API

                    rowData={rowData} // Row Data for Rows

                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
                    editType={'fullRow'} // Optional - enables full row editings

                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                    rowSelection='multiple' // Options - allows click selection of rows

                    //onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                    onCellValueChanged={onCellValueChanged} // Optional - registering for Grid Event
                    onRowValueChanged={onRowValueChanged} // Optional - registering for Grid Event
                />
            </div>
        </div>
    );
};

export default App;