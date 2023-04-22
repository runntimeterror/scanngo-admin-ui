import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import ClientQRCode from "./clientQRcode";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export default function Client() {
  const [open, setOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState({});
  const [clients, setCient] = useState([]);

  const handleClose = (value) => {
    setOpen(false);
  };
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
    setSelectedClient(client);
    setOpen(true);
  };

  const getRowId = (client) => {
    return client.clientId;
  };
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
      <Dialog onClose={handleClose} open={open}>
        <Box sx={{padding: `0 32px 15px`}}>
          <DialogTitle>QR Code for {selectedClient.name}</DialogTitle>
          <ClientQRCode clientId={selectedClient.clientId} />
        </Box>
      </Dialog>
    </div>
  );
}
