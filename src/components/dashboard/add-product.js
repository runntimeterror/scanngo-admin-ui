import React from "react";
import {
  Stack,
  TextField,
  OutlinedInput,
  DialogActions,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Container,
} from "@mui/material";
import Html5QrcodePlugin from "../scanner/Html5QrcodePlugin";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

export default function AddProduct(props) {
  const [scannerVisible, setScannerVisibility] = React.useState(false);
  const [barcode, setBarcode] = React.useState();
  const saveProduct = async (event) => {
    event.preventDefault();

    const formElements = event.target.elements;
    const {
      name,
      barcode,
      type,
      category,
      brand,
      price,
      modelName,
      modelNumber,
    } = formElements;

    const payload = [
      {
        name: name.value,
        barcode: barcode.value,
        productType: type.value,
        programCategory: category.value,
        brandName: brand.value,
        price: +price.value,
        modelName: modelName.value,
        modelNumber: modelNumber.value,
      },
    ];
    const token = localStorage.getItem("token");
    const resp = await fetch(`/api/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (resp.status === 200) {
      props.successCallback();
    }
  };
  const convertEanToUpc = (ean) => {
    // Remove leading zero if present
    if (ean.charAt(0) === "0") {
      ean = ean.substr(1);
    }
    return ean;
  };
  const onNewBarcodeScanResult = (decodedText) => {
    setBarcode(convertEanToUpc(decodedText));
    setScannerVisibility(false);
  };

  return (
    <form onSubmit={saveProduct}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add Product
      </Typography>
      {scannerVisible && (
        <Container sx={{ paddingTop: 5, paddingBottom: 5 }} maxWidth="sm">
          <Html5QrcodePlugin
            fps={10}
            aspectRatio={2.5}
            disableFlip={true}
            qrCodeSuccessCallback={onNewBarcodeScanResult}
          />
        </Container>
      )}
      <Stack spacing={4} sx={{ width: 280 }}>
        <TextField
          id="name"
          name="name"
          label="Name"
          variant="outlined"
          required
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Barcode</InputLabel>
          <OutlinedInput
            id="barcode"
            name="barcode"
            label="Barcode"
            value={barcode ? barcode : ""}
            onChange={(event) => {
              setBarcode(event.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setScannerVisibility(true);
                  }}
                  aria-label="toggle barcode reader"
                  edge="end"
                >
                  <QrCodeScannerIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Stack direction="row" spacing={2}>
          <TextField id="type" name="type" label="Type" variant="outlined" />
          <TextField
            id="category"
            name="category"
            label="Category"
            variant="outlined"
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField id="brand" name="brand" label="Brand" variant="outlined" />
          <TextField
            id="price"
            name="price"
            label="Price"
            variant="outlined"
            required
            type="number"
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            id="modelName"
            name="modelName"
            label="Model Name"
            variant="outlined"
          />
          <TextField
            id="modelNumber"
            name="modelNumber"
            label="Model Number"
            variant="outlined"
          />
        </Stack>
      </Stack>
      <DialogActions sx={{ mt: 2 }}>
        <Button type="submit">Save</Button>
      </DialogActions>
    </form>
  );
}
