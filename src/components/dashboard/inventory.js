import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { isEmpty } from "lodash";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import {
  Button,
  Stack,
  Autocomplete,
  TextField,
  Dialog,
  Box,
} from "@mui/material";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import AddInventory from "./add-inventory";

const Inventory = (props) => {
  const { accessLevel } = props;
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [newInventoryFormDialog, setNewInventoryFormDialog] =
    React.useState(false);
  const [clients, setClients] = React.useState([]);
  const [client, selectClient] = React.useState({});
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
  const handleAddInventoryDialogClose = () => {
    setNewInventoryFormDialog(false);
  };

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { field: "brandName", filter: true },
    { field: "modelName", filter: true },
    { field: "modelNumber", filter: true },
    {
      field: "price",
      valueParser: (params) => Number(params.newValue),
      editable: true,
    },
    {
      field: "qty",
      filter: true,
      type: "numericColumn",
      editable: true,
      valueParser: (params) => Number(params.newValue),
    },
    { field: "barcode", filter: true, type: "numericColumn", editable: true },
    { field: "programCategory", filter: true },
    { field: "productType", filter: true },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    editable: false,
  }));

  const token = localStorage.getItem("token");

  const handleClientIDSelection = (event, client) => {
    selectClient(client);
    fetchInventory(client.id);
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchInventory = async (clientId) => {
    if (clientId) {
      headers["Client-Id"] = clientId;
    }
    const servResp = await fetch(`/api/inventory`, {
      method: "GET",
      headers,
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

  const handleAddComplete = () => {
    setNewInventoryFormDialog(false);
    const { accessLevel } = props;
    if (accessLevel == 1) {
      fetchClient();
    } else {
      fetchInventory();
    }
  }

  const onRemoveSelected = useCallback(() => {
    const rows = gridRef.current.api.getSelectedRows();
    for (let row of rows) {
      const jsonStr = JSON.stringify(row);
      console.debug("onRemoveSelected: (" + jsonStr + ")");
      const requestOptions = {
        method: "DELETE",
        headers: headers,
      };
      try {
        fetch("/api/inventory/" + row.inventoryProductId, requestOptions)
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
    fetch("/api/inventory/" + data.inventoryProductId, requestOptions)
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
        <Button
          variant="outlined"
          disabled={accessLevel == 1 && isEmpty(client)}
          onClick={() => setNewInventoryFormDialog(true)}
        >
          Add Inventory
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
              <TextField {...params} variant="outlined" label="Store" />
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
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="single" // Options - allows click selection of rows
          onRowValueChanged={onRowValueChanged} // Optional - registering for Grid Event
        />
      </div>
      <Dialog
        onClose={handleAddInventoryDialogClose}
        open={newInventoryFormDialog}
      >
        <Box sx={{ padding: `32px 15px` }}>
          <AddInventory successCallback={handleAddComplete} {...client} />
        </Box>
      </Dialog>
    </div>
  );
};

export default Inventory;
