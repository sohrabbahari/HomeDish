import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';

// Add other reducers here if needed (e.g., userSlice, foodSlice)
export const store = configureStore({
  reducer: {
    cart: cartSlice,
    // Add more slices like this:
    // user: userSlice,
    // food: foodSlice,
  },
  // Middleware configuration for additional functionality like logging or error tracking
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
  // Enable Redux DevTools Extension in development mode
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
