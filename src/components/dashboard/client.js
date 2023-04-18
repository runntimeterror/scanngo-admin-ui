import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const columns = [
  { field: "name", headerName: "Name", width: 100 },
  { field: "address", headerName: "Address", width: 230 },
  { field: "primaryContact", headerName: "Primary Contact", width: 130 },
  {
    field: "link",
    headerName: "",
    width: 150,
    renderCell: (params) => (
      <Button variant="outlined" onClick={() => generateQRCode(params.row)}>
        View QR Code
      </Button>
    ),
  },
];

const generateQRCode = (client) => {
  console.log(client);
};

const getRowId = (client) => {
  return client.clientId;
};

export default function Client() {
  const [clients, setCient] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(`/api/client`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const serviceRespJson = await resp.json();
      setCient(serviceRespJson);
    };
    fetchData();
  }, []);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={clients} columns={columns} getRowId={getRowId} />
    </div>
  );
}
