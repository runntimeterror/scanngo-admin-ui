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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClientQRCode from "./clientQRcode";
import { useTheme, styled } from "@mui/material/styles";
import ClientCreate from "./client-create";
import ClientUsers from "./client-users";

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
  const [manageUserFormDialog, setManageUserFormDialog] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState({});
  const [clients, setCient] = useState([]);

  const handleNewClientFormClose = () => {
    setNewClientFormDialog(false);
  };

  const saveClient = async (event) => {
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
    const token = localStorage.getItem("token");
    const resp = await fetch(`/api/client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload, token }),
    });
    fetchData();
    setNewClientFormDialog(false);
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
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => generateQRCode(params.row)}>
          QR Code
        </Button>
      ),
    },
    {
      field: "users",
      headerName: "",
      width: 160,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => manageStoreUser(params.row)}>
          Manage Users
        </Button>
      ),
    },
    {
      field: "del",
      headerName: "",
      width: 80,
      renderCell: (params) => (
        <IconButton
          onClick={() => deleteClient(params.row)}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const deleteClient = async (client) => {
    const token = localStorage.getItem("token");
    const resp = await fetch(`/api/client/${client.clientId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const serviceRespJson = await resp.json();
    fetchData();
  };

  const handleManageUserDialogClose = () => {
    setManageUserFormDialog(false);
  };

  const manageStoreUser = (client) => {
    setSelectedClient(client);
    setManageUserFormDialog(true);
  };

  const generateQRCode = (client) => {
    setSelectedClient(client);
    setOpenQRDialog(true);
  };

  const getRowId = (client) => {
    return client.clientId;
  };
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
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Container>
      <Button variant="outlined" onClick={() => setNewClientFormDialog(true)}>
        Add New Client
      </Button>
      <StyledRoot>
        <DataGrid
          hideFooter
          rows={clients}
          columns={columns}
          getRowId={getRowId}
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

        <Dialog
          onClose={handleManageUserDialogClose}
          open={manageUserFormDialog}
        >
          <Box sx={{ padding: `32px 15px` }}>
            <ClientUsers {...selectedClient} />
          </Box>
        </Dialog>
      </StyledRoot>
    </Container>
  );
}
