import { Box, Button, Snackbar, Alert } from "@mui/material";
import styles from "../../styles/Home.module.css";
import React, { useState } from "react";
import { useCSVReader } from "react-papaparse";
import { isEqual } from "lodash";

export default function AddBulkInventory(props) {
  const { CSVReader } = useCSVReader();
  const [tableHead, setTableHead] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = React.useState(false);

  const submitData = async (event) => {
    event.preventDefault();
    const payload = rows.map((row) => {
      const [productId, productName, qty, price] = row;
      return { productId: +productId, qty: +qty, price: +price };
    });
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    if (props.id) {
      headers["Client-Id"] = props.id;
    }
    const servResp = await fetch(`/api/inventory`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (servResp.status === 200) {
      props.successCallback();
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onUploadCSV = (results) => {
    const { data, errors, meta } = results;
    const [tableHead, ...rows] = data;
    if (!isEqual(tableHead, ["productId", "productName", "qty", "price"])) {
      setOpen(true);
      return;
    }
    setTableHead(tableHead);
    setRows(rows);
  };

  return (
    <Box sx={{ width: "280px", padding: "10px" }}>
      <CSVReader onUploadAccepted={onUploadCSV}>
        {({ getRootProps, acceptedFile, ProgressBar }) => (
          <>
            <div className={styles.csvReader}>
              <button
                type="button"
                {...getRootProps()}
                className={styles.browseFile}
              >
                Browse Files
              </button>
              <div className={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
            </div>
            <ProgressBar className={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      <Box sx={{ height: 300, overflow: "auto", my: 2 }}>
        {tableHead.length > 0 && (
          <table>
            <tr>
              {tableHead.map((columnName, i) => (
                <th key={i}>{columnName}</th>
              ))}
            </tr>
            {rows.length > 0 &&
              rows.map((row, k) => (
                <tr key={k}>
                  {row.map((item, j) => (
                    <td key={j}>{item}</td>
                  ))}
                </tr>
              ))}
          </table>
        )}
      </Box>
      <Button
        variant="outlined"
        disabled={rows.length === 0}
        onClick={submitData}
      >
        Submit
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          variant="filled"
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          CSV Format not compatible!
        </Alert>
      </Snackbar>
    </Box>
  );
}
