import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { productApi } from './features/api/productApi'; 

const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

export default store;