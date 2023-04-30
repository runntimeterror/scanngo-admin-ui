import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { Button, Stack, Autocomplete, TextField } from "@mui/material";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

const Inventory = (props) => {
  const { accessLevel } = props;
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  const [clients, setClients] = React.useState([]);
  const fetchClient = async () => {
    const resp = await fetch(`/api/client`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const serviceRespJson = await resp.json();
    setClients(serviceRespJson);
  };

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "productId",
      filter: true,
      type: "numericColumn",
      valueParser: (params) => Number(params.newValue),
    },
    {
      field: "inventoryProductId",
      filter: true,
      type: "numericColumn",
      valueParser: (params) => Number(params.newValue),
    },
    { field: "name", filter: true },
    { field: "imageUrl", filter: true },
    { field: "price", valueParser: (params) => Number(params.newValue) },
    {
      field: "qty",
      filter: true,
      type: "numericColumn",
      valueParser: (params) => Number(params.newValue),
    },
    { field: "barcode", filter: true, type: "numericColumn" },
    { field: "programCategory", filter: true },
    { field: "productType", filter: true },
    { field: "brandName", filter: true },
    { field: "modelName", filter: true },
    { field: "modelNumber", filter: true },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    editable: true,
  }));

  const token = localStorage.getItem("token");

  const host = "/api";

  const handleClientIDSelection = (event, client) => {
    fetchInventory(client.id);
  };

  const fetchInventory = async (clientId) => {
    const servResp = await fetch(`/api/inventory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Client-Id": clientId,
      },
    });
    const rowData = await servResp.json();
    setRowData(rowData);
  };

  useEffect(() => {
    const { accessLevel } = props;
    if (accessLevel == 1) {
      fetchClient();
    } else {
      fetchInventory();
    }
  }, []);

  const onRemoveSelected = useCallback(() => {
    const rows = gridRef.current.api.getSelectedRows();
    for (let row of rows) {
      const jsonStr = JSON.stringify(row);
      console.debug("onRemoveSelected: (" + jsonStr + ")");
      const requestOptions = {
        method: "DELETE",
        headers: headers,
        body: jsonStr,
      };
      try {
        fetch(host + "/inventory/" + row.inventoryProductId, requestOptions)
          .then((response) => response.json())
          .then((data) =>
            console.log("DELETE response: " + JSON.stringify(data))
          )
          .then((data) => gridRef.current.api.applyTransaction({ remove: row }))
          .catch((error) => console.error(error));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const onRowValueChanged = useCallback((event) => {
    var data = event.data;
    const jsonStr = JSON.stringify(data);
    console.debug("onRowValueChanged: (" + jsonStr + ")");
    const requestOptions = {
      method: "PUT",
      headers: headers,
      body: jsonStr,
    };
    fetch(host + "/inventory/" + data.inventoryProductId, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log("PUT response: " + JSON.stringify(data)));
    //.then(data => this.setState({ postId: data.id }));
  }, []);

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="outlined" onClick={onRemoveSelected}>
          Remove selected
        </Button>
        <Button variant="outlined">Bulk upload</Button>
        {accessLevel == 1 ? (
          <Autocomplete
            disablePortal
            id="autocomplete-store"
            sx={{ flexGrow: 1 }}
            options={clients.map((client) => {
              return { label: client.name, id: client.clientId };
            })}
            onChange={handleClientIDSelection}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ alignSelf: "flex-end" }}
                variant="outlined"
                label="Store"
              />
            )}
          />
        ) : null}
      </Stack>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      {/* <div className="ag-theme-alpine" style={{ width: 500, height: 500 }}> */}
      <div className="ag-theme-alpine" style={{ width: "100%", height: 800 }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          editType={"fullRow"} // Optional - enables full row editings
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onRowValueChanged={onRowValueChanged} // Optional - registering for Grid Event
        />
      </div>
    </div>
  );
};

export default Inventory;
