import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ClientQRCode from "./clientQRcode";
import { useTheme, styled } from "@mui/material/styles";
import ClientCreate from "./client-create";

const StyledRoot = styled("div")(() => {
  const theme = useTheme();
  return {
    [theme.breakpoints.up("md")]: { height: 400, width: "100%" },
    [theme.breakpoints.down("md")]: { height: 400, width: "85vw" },
  };
});
export default function Client() {
  const [openQRDialog, setOpenQRDialog] = React.useState(false);
  const [newClientFormDialog, setNewClientFormDialog] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState({});
  const [clients, setCient] = useState([]);

  const handleNewClientFormClose = () => {
    setNewClientFormDialog(false);
  };

  const saveClient = (event) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const {
      clientName,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      primaryContact,
    } = formElements;
    const payload = {
      name: clientName.value,
      address: `${addressLine1.value}
${addressLine2.value ? addressLine2.value : ``} 
${city.value} 
${state.value} ${zip.value}`,
      primaryContact: primaryContact.value,
    };
  };

  const handleQRClose = (value) => {
    setOpenQRDialog(false);
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
    setOpenQRDialog(true);
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
    <Container>
      <Button variant="outlined" onClick={() => setNewClientFormDialog(true)}>
        Add New Client
      </Button>
      <StyledRoot>
        <DataGrid
          rows={clients}
          columns={columns}
          getRowId={getRowId}
          paginationModel={{ page: 0, pageSize: 5 }}
        />
        <Dialog onClose={handleQRClose} open={openQRDialog}>
          <Box sx={{ padding: `0 32px 15px` }}>
            <DialogTitle>QR Code for {selectedClient.name}</DialogTitle>
            <DialogContent>
              <ClientQRCode clientId={selectedClient.clientId} />{" "}
            </DialogContent>
          </Box>
        </Dialog>
        <Dialog open={newClientFormDialog} onClose={handleNewClientFormClose}>
          <form onSubmit={saveClient}>
            <DialogTitle>Onboard New Client</DialogTitle>
            <DialogContent>
              <ClientCreate />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNewClientFormClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </Dialog>
      </StyledRoot>
    </Container>
  );
}
