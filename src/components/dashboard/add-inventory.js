import React, { useState, useEffect } from "react";
import { Stack, TextField, Autocomplete } from "@mui/material";

export default function AddInventory(props) {
  const [products, setProducts] = React.useState([]);
  const handleProductSelection = (event, product) => {};
  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
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
          name: `${pr.brandName} ${pr.modelName} ${pr.modelNumber}`,
          id: pr.productId,
        };
      })
    );
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <Stack spacing={4}>
      <Autocomplete
        disablePortal
        id="autocomplete-store"
        options={products.map((product) => {
          return { label: product.name, id: product.clientId };
        })}
        onChange={handleProductSelection}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Product" />
        )}
      />
      <TextField
        id="qty"
        name="qty"
        label="Quantity"
        variant="standard"
        required
        type="number"
      />
      <TextField
        id="price"
        name="price"
        label="Price"
        variant="standard"
        required
        type="number"
      />
    </Stack>
  );
}
