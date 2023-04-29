import React from "react";
import {
  Stack,
  TextField,
} from "@mui/material";


export default function UserCreate() {
  return (
    <Stack spacing={4}>
      <TextField
        id="userName"
        name="clientName"
        label="Name"
        variant="standard"
        required
      />
      <TextField
        id="email"
        name="email"
        label="Email"
        variant="standard"
        required
      />
      <TextField
        id="password"
        name="password"
        label="Password"
        type="password"
        variant="standard"
        required
      />
    </Stack>
  );
}
