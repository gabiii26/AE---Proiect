import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  clearCart,
  setQuantity,
  setCartItems,
} from "../store/slices/cartSlice";
import { toast } from "sonner";
import { createOrder } from "../api/order.routes";
import { getCart, updateCart } from "../api/cart.routes";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch cart la mount dacă userul există
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const response = await getCart();
        if (response?.success) {
          dispatch(setCartItems(response.data.items));
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    })();
  }, [user, dispatch]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Checkout
  const handleCheckout = async () => {
    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const response = await createOrder({
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (response?.success) {
        toast.success("Order placed successfully!");
        dispatch(clearCart());
        await updateCart([]); // golește cart-ul și pe server
        navigate("/order-summary", { state: { orderId: response.data.id } });
      } else {
        toast.error(response?.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("An error occurred while placing your order");
    }
  };

  // Modificare cantitate
  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );

    dispatch(setCartItems(updatedCart)); // actualizare locală
    try {
      await updateCart(updatedCart); // sincronizare cu serverul
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  // Ștergere item
  const handleRemove = async (productId) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    dispatch(setCartItems(updatedCart)); // actualizare locală
    try {
      await updateCart(updatedCart); // sincronizare cu serverul
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  if (cart.length === 0) {
    return <div className="p-10 text-center text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.productId} className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">${item.price} × {item.quantity}</p>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="w-12 text-center border rounded"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, parseInt(e.target.value))
                    }
                  />
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.productId)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
        <button
          onClick={handleCheckout}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
