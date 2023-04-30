import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { Button, Stack, Snackbar, Dialog, Box } from "@mui/material";
import AddProduct from "./add-product";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

const Product = (props) => {
  const { accessLevel } = props;
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [firstRender, setFirstRender] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [newProductDialog, setNewProductFormDialog] = React.useState(false);
  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "productId",
      filter: true,
      type: "numericColumn",
      valueParser: (params) => Number(params.newValue),
    },
    { field: "price", valueParser: (params) => Number(params.newValue) },
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
    editable: accessLevel == 1,
  }));

  const token = localStorage.getItem("token");
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const config = {
    method: "GET",
    headers: headers,
  };

  const host = "/api"; //API_DOMAIN

  const loadData = () => {
    fetch(host + "/product", config)
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  };
  useEffect(() => {
    if (!firstRender) {
      loadData();
      setFirstRender(true);
    }
  }, [firstRender]);

  const downloadCsv = () => {
    const rows = gridRef.current.api.getSelectedRows();
    if (rows.length === 0) return;
    const data = [];
    for (const row of rows) {
      data.push({
        productId: row.productId,
        productName: `${row.brandName} ${row.modelName}`,
        qty: 0,
        price: 0,
      });
    }

    const csvString = [
      ["productId", "productName", "qty", "price"],
      ...data.map((item) => [
        item.productId,
        item.productName,
        item.qty,
        item.price,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.setAttribute("href", url);
    a.setAttribute("download", "sample_csv.csv");
    a.click();
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

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
        fetch(host + "/product/" + row.productId, requestOptions)
          .then((response) => response.json())
          .then((data) =>
            console.log("DELETE response: " + JSON.stringify(data))
          )
          .catch((error) => console.error(error));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const onRowValueChanged = useCallback((event) => {
    var data = event.data;
    if (data.productId) {
      const jsonStr = JSON.stringify([data]);
      const requestOptions = {
        method: "PUT",
        headers: headers,
        body: jsonStr,
      };
      fetch(host + "/product", requestOptions)
        .then((response) => response.json())
        .then((data) => console.log("PUT response: " + JSON.stringify(data)));
    } else {
      delete data.productId;
      const jsonStr = JSON.stringify([data]);
      const requestOptions = {
        method: "POST",
        headers: headers,
        body: jsonStr,
      };
      fetch(host + "/product", requestOptions)
        .then((response) => response.json())
        .then((data) => console.log("POST response: " + JSON.stringify(data)))
        .then((data) => gridRef.current.api.applyTransaction({ update: data }))
        .catch((error) => console.error(error));
    }
  }, []);

  const handleAddProductDialogClose = () => {
    setNewProductFormDialog(false);
  };

  const handleAddComplete = () => {
    loadData();
    setNewProductFormDialog(false);
  };

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          onClick={() => {
            setNewProductFormDialog(true);
          }}
          variant="outlined"
          disabled={accessLevel != 1}
        >
          Add Product
        </Button>
        <Button
          variant="outlined"
          disabled={accessLevel != 1}
          onClick={onRemoveSelected}
        >
          Remove selected
        </Button>
        <Button variant="outlined" onClick={downloadCsv}>
          Download CSV
        </Button>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Edit this CSV (Price, Quantity) and re-upload as Inventory"
        />
      </Stack>
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
      <Dialog onClose={handleAddProductDialogClose} open={newProductDialog}>
        <Box sx={{ padding: `32px 15px` }}>
          <AddProduct successCallback={handleAddComplete} />
        </Box>
      </Dialog>
    </div>
  );
};

export default Product;
