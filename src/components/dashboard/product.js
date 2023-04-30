import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { Button, Stack, Snackbar, Dialog, Box } from "@mui/material";
import AddProduct from "./add-product";
import { DataGrid } from "@mui/x-data-grid";

const Product = (props) => {
  const { accessLevel } = props;
  const [rowData, setRowData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [firstRender, setFirstRender] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [newProductDialog, setNewProductFormDialog] = React.useState(false);

  const columnDefs = [
    { field: "brandName", headerName: "Brand", filter: true, width: 170 },
    { field: "modelName", headerName: "Model", filter: true, width: 180 },
    { field: "modelNumber", headerName: "Model Number", filter: true, width: 130 },
    { field: "price", headerName: "Price", valueParser: (params) => Number(params.newValue) },
    { field: "barcode", headerName: "Barcode", filter: true, type: "numericColumn" },
    { field: "programCategory", headerName: "Category", filter: true },
    { field: "productType", headerName: "Type", filter: true },
  ]

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
    const rows = selectedRows;
    if (rows.length === 0) return;
    const data = [];
    for (const row of rows) {
      const product = rowData.find((prod) => prod.productId === row);
      data.push({
        productId: row,
        productName: `${product.brandName} ${product.modelName}`,
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

  const removeSelected = () => {
    const rows = selectedRows;
    for (let row of rows) {
      const requestOptions = {
        method: "DELETE",
        headers: headers,
      };
      try {
        fetch(host + "/product/" + row, requestOptions)
          .then((response) => response.json())
          .catch((error) => console.error(error));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getRowId = (product) => {
    return product.productId;
  };

  const handleAddProductDialogClose = () => {
    setNewProductFormDialog(false);
  };

  const handleAddComplete = () => {
    loadData();
    setNewProductFormDialog(false);
  };

  const onRowSelect = (rowIds) => {
    setSelectedRows(rowIds);
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
          onClick={() => {removeSelected()}}
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
        {rowData.length > 0 && (
          <DataGrid
            rows={rowData}
            columns={columnDefs}
            getRowId={getRowId}
            pagination
            checkboxSelection
            onRowSelectionModelChange={onRowSelect}
          />
        )}
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
