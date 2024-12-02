// src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Async thunk to place an order
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', orderData);
      if (response.status === 201) {
        return response.data;
      } else {
        return rejectWithValue('Failed to place order. Please try again.');
      }
    } catch (error) {
      return rejectWithValue('Error placing order: ' + error.message);
    }
  }
);

// Async thunk to fetch order history
export const fetchOrderHistory = createAsyncThunk(
  'orders/fetchOrderHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue('Failed to fetch order history. Please try again.');
      }
    } catch (error) {
      return rejectWithValue('Error fetching order history: ' + error.message);
    }
  }
);

const initialState = {
  orders: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch Order History
      .addCase(fetchOrderHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
