import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import { Button } from "@mui/material";
import { API_DOMAIN } from "../../../utils";
import { getCookie } from "cookies-next";
import styles from '../../styles/Home.module.css'

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const Product = () => {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
    const [firstRender, setFirstRender] = useState(false);

    // Each Column Definition results in one Column.
    const [columnDefs, setColumnDefs] = useState([
        { field: 'productId', filter: true, type: 'numericColumn', valueParser: params => Number(params.newValue) },
        { field: 'name', filter: true },
        { field: 'imageUrl', filter: true },
        { field: 'price', valueParser: params => Number(params.newValue) },
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

    const token = localStorage.getItem("token");
    // const sessionId = getCookie("sessionId");
    // const clientId = getCookie("storeId") || sessionId;
    const headers = new Headers({
        "Content-Type": "application/json",
        // "Session-Id": sessionId,
        // "Client-Id": clientId,
        Authorization: `Bearer ${token}`,
      });

    const config = {
        method: 'GET',
        headers: headers,
        //mode: 'cors'
    };

    const host = '/api';//API_DOMAIN

    const loadData = () => {
        fetch(host + '/product', config)
            .then(result => result.json())
            .then(rowData => setRowData(rowData))
    }
    useEffect(() => {
        if (!firstRender) {
            loadData()
            setFirstRender(true)
        }
    }, [firstRender]);

    const refresh = useCallback(e => {
        loadData()
    }, []);

    // Example using Grid's API
    const buttonListener = useCallback(e => {
        gridRef.current.api.deselectAll();
    }, []);

    const insertButtonListener = useCallback(e => {
        const newRow = {}
        rowData.unshift(newRow)
        setRowData(rowData)
        gridRef.current.api.setRowData(rowData)
        //gridRef.current.api.applyTransaction({ add: [{}] });
    }, [rowData]);

    const onRemoveSelected = useCallback(() => {
        const rows = gridRef.current.api.getSelectedRows();
        for (let row of rows) {
            const jsonStr = JSON.stringify(row)
            console.debug(
                'onRemoveSelected: (' + jsonStr + ')'
            );
            const requestOptions = {
                method: 'DELETE',
                headers: headers
            };
            try {
                fetch(host + '/product/' + row.productId, requestOptions)
                    .then(response => response.json())
                    .then(data => console.log('DELETE response: ' + JSON.stringify(data)))
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
        if (data.productId) {
            const jsonStr = JSON.stringify([data])
            const requestOptions = {
                method: 'PUT',
                headers: headers,
                body: jsonStr
            };
            fetch(host + '/product', requestOptions)
                .then(response => response.json())
                .then(data => console.log('PUT response: ' + JSON.stringify(data)))
        } else {
            delete data.productId
            const jsonStr = JSON.stringify([data])
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: jsonStr
            };
            fetch(host + '/product', requestOptions)
                .then(response => response.json())
                .then(data => console.log('POST response: ' + JSON.stringify(data)))
                .then(data => gridRef.current.api.applyTransaction({ update: data }))
                .catch(error => console.error(error));
        }
    }, []);

    return (
        <div>

            {/* Example using Grid's API */}
            <Button variant="outlined" onClick={buttonListener} className={styles.buttonMargins}>
                Deselect all
            </Button>
            <Button variant="outlined" onClick={insertButtonListener} className={styles.buttonMargins}>
                New row
            </Button>
            <Button variant="outlined" onClick={onRemoveSelected} className={styles.buttonMargins}>
                Remove selected
            </Button>
            <Button variant="outlined" onClick={refresh} className={styles.buttonMargins}>
                Refresh
            </Button>

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

export default Product;