// client/src/api/cart.routes.js
import axiosAuth from "../axios/axiosAuth";

// Preia cart-ul curent al user-ului
export const getCart = async () => {
  try {
    const res = await axiosAuth.get("/cart");
    return res.data;
  } catch (err) {
    console.error("Error fetching cart:", err);
    return { success: false, data: [] };
  }
};

// POST - adaugă un produs nou în cart
export const addToCartServer = async (product) => {
  try {
    const res = await axiosAuth.post("/cart", { product });
    return res.data;
  } catch (err) {
    console.error("Error adding product to cart:", err);
    return { success: false, data: [] };
  }
};

// PUT - actualizează cart-ul (cantități / ștergeri)
export const updateCartServer = async (items) => {
  try {
    const res = await axiosAuth.put("/cart", { items });
    return res.data;
  } catch (err) {
    console.error("Error updating cart:", err);
    return { success: false, data: [] };
  }
};
