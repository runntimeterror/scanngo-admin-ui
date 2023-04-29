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
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ClientQRCode from "./clientQRcode";
import { useTheme, styled } from "@mui/material/styles";
import { STATES } from "../../utils/states";

const renderStateOptions = () => {
  return Object.keys(STATES).map((state) => {
    return <MenuItem value={state}>{STATES[state]}</MenuItem>;
  });
};

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
          <DialogTitle>Onboard New Client</DialogTitle>
          <DialogContent>
            <Stack spacing={4}>
              <TextField
                id="store-name"
                name="clientName"
                label="Store Name"
                variant="standard"
              />
              <TextField
                id="addressLine1"
                name="storeAddress1"
                label="Address (Street Name, Number)"
                variant="standard"
              />
              <TextField
                id="addressLine2"
                name="storeAddress2"
                label="Address Line 2 (Optional)"
                variant="standard"
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  id="addressCity"
                  name="storeCity"
                  label="City"
                  variant="standard"
                />
                <FormControl sx={{ minWidth: 120, flexGrow: 1 }}>
                  <InputLabel id="addressState">State</InputLabel>
                  <Select
                    labelId="addressState"
                    id="state"
                    label="State"
                    name="state"
                  >
                    {renderStateOptions()}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  id="addressZip"
                  name="zip"
                  label="Zip"
                  variant="standard"
                />
                <FormControl sx={{ minWidth: 120, flexGrow: 1 }} disabled>
                  <InputLabel id="addressCountry">Country</InputLabel>
                  <Select
                    labelId="addressCountry"
                    id="addressCountry"
                    value="United States"
                    label="Country"
                  >
                    <MenuItem selected value="United States">
                      <em>United States</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <TextField
                id="primary-contact"
                name="primaryContact"
                label="Contact"
                variant="standard"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewClientFormClose}>Cancel</Button>
            <Button onClick={handleNewClientFormClose}>Save</Button>
          </DialogActions>
        </Dialog>
      </StyledRoot>
    </Container>
  );
}
