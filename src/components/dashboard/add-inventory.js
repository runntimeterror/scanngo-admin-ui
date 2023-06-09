import React, { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  Autocomplete,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function AddInventory(props) {
  const [products, setProducts] = React.useState([]);
  const [product, selectProduct] = React.useState({});
  const handleProductSelection = (event, product) => {
    selectProduct(product);
  };
  const token = localStorage.getItem("token");
  const fetchProducts = async () => {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    const resp = await fetch(`/api/product`, {
      method: `GET`,
      headers,
    });
    const productResp = await resp.json();
    setProducts(
      productResp.map((pr) => {
        return {
          name: `${pr.brandName} ${pr.modelName}`,
          id: pr.productId,
        };
      })
    );
  };
  const handleAddInventory = async (event) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const payload = [{
      productId: product.id,
      qty: +formElements.qty.value,
      price: +formElements.price.value,
    }];
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
    if(servResp.status === 200) {
        props.successCallback()
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <form onSubmit={handleAddInventory}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add Inventory
      </Typography>
      <Stack spacing={4} sx={{ width: 280 }}>
        <Autocomplete
          disablePortal
          id="autocomplete-store"
          options={products.map((product) => {
            return { label: product.name, id: product.id };
          })}
          onChange={handleProductSelection}
          renderInput={(params) => <TextField {...params} label="Product" />}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            id="qty"
            name="qty"
            label="Quantity"
            variant="outlined"
            required
            type="number"
          />
          <TextField
            id="price"
            name="price"
            label="Price"
            variant="outlined"
            required
            type="number"
          />
        </Stack>
      </Stack>
      <DialogActions sx={{ mt: 2 }}>
        <Button type="submit">Save</Button>
      </DialogActions>
    </form>
  );
}
