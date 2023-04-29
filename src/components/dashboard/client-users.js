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
import { useTheme, styled } from "@mui/material/styles";
import UserCreate from "./user-create";

const StyledRoot = styled("div")(() => {
  const theme = useTheme();
  return {
    [theme.breakpoints.up("md")]: { height: 400, width: "100%" },
    [theme.breakpoints.down("md")]: { height: 400, width: "85vw" },
  };
});

const getRowId = (user) => {
  return user.userId;
};

const columns = [
  { field: "userName", headerName: "Name", width: 100 },
  { field: "email", headerName: "Email", width: 180 },
  {
    field: "del",
    headerName: "",
    width: 80,
    renderCell: (params) => (
      <IconButton onClick={() => deleteClient(params.row)} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    ),
  },
];

export default function ClientUsers(props) {
  const [users, setUsers] = useState([]);
  const [newUserFormDialog, setNewUserFormDialog] = React.useState(false);

  const handleNewUserFormClose = () => {
    setNewUserFormDialog(false);
  };

  const saveUser = () => {

  }

  return (
    <Container>
      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => setNewUserFormDialog(true)}
      >
        Add New User
      </Button>

      <StyledRoot>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={getRowId}
          paginationModel={{ page: 0, pageSize: 5 }}
        />
        <Dialog open={newUserFormDialog} onClose={handleNewUserFormClose}>
          <form onSubmit={saveUser}>
            <DialogTitle>Create New User for {props.name}</DialogTitle>
            <DialogContent>
              <UserCreate />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNewUserFormClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </Dialog>
      </StyledRoot>
    </Container>
  );
}
