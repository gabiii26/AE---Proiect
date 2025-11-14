// client/src/store/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosAuth from "../../axios/axiosAuth";

// --- Async Thunks ---
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await axiosAuth.get("/cart");
  return response.data.data.items || [];
});

export const updateCartServer = createAsyncThunk(
  "cart/updateCartServer",
  async (items) => {
    const response = await axiosAuth.put("/cart", { items });
    return response.data.data.items || [];
  }
);

export const clearServerCart = createAsyncThunk(
  "cart/clearServerCart",
  async () => {
    const response = await axiosAuth.put("/cart", { items: [] });
    return [];
  }
);

// --- POST item în cart pe server ---
export const addToCartServer = createAsyncThunk(
  "cart/addToCartServer",
  async (item, { getState }) => {
    const { cart } = getState();
    const existingItem = cart.items.find((i) => i.productId === item.productId);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.items.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updatedCart = [...cart.items, item];
    }

    await axiosAuth.post("/cart", { items: updatedCart });
    return updatedCart;
  }
);

const initialState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, price, image, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.productId === productId);
      if (existingItem) existingItem.quantity += quantity;
      else state.items.push({ productId, name, price, image, quantity });
    },
    removeFromCart: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        if (item.quantity > 1) item.quantity -= 1;
        else state.items = state.items.filter((i) => i.productId !== action.payload);
      }
    },
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
    },
    clearCart: (state) => { state.items = []; },
    setCartItems: (state, action) => { state.items = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(updateCartServer.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(clearServerCart.fulfilled, (state, action) => { state.items = []; })
      .addCase(addToCartServer.fulfilled, (state, action) => { state.items = action.payload; });
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart, setCartItems } =
  cartSlice.actions;

export default cartSlice.reducer;
