import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async(_, { dispatch }) => {
    try {
    } catch {

    }
  }
)

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: {
    [HYDRATE]: (state, action) => {

    }
  }
})