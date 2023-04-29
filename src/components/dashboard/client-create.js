import React from "react";
import {
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { STATES } from "../../utils/states";

const renderStateOptions = () => {
  return Object.keys(STATES).map((state) => {
    return <MenuItem value={state}>{STATES[state]}</MenuItem>;
  });
};

export default function ClientCreate() {
  return (
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
          name="city"
          label="City"
          variant="standard"
        />
        <FormControl sx={{ minWidth: 120, flexGrow: 1 }}>
          <InputLabel id="addressState">State</InputLabel>
          <Select labelId="addressState" id="state" label="State" name="state">
            {renderStateOptions()}
          </Select>
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField id="addressZip" name="zip" label="Zip" variant="standard" />
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
        label="Primary Contact"
        variant="standard"
      />
    </Stack>
  );
}
