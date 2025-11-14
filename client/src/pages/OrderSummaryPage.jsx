// client/src/pages/OrderSummaryPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/order.routes";
import LoadingSpinner from "../components/LoadingSpinner";

export default function OrderSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Order ID ar trebui să fie transmis prin state când navighezi aici
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate("/"); // fallback dacă nu există orderId
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(orderId);
        if (response?.success) {
          setOrder(response.data);
        } else {
          setError(response?.message || "Failed to load order");
        }
      } catch (err) {
        setError(err.message || "Error fetching order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) return <LoadingSpinner />;

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  if (!order) return null;

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

      <p className="mb-4">Order ID: <strong>{order.id}</strong></p>
      <p className="mb-4">Status: <strong>{order.status}</strong></p>
      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-4">
              <img src={item.Product.image} alt={item.Product.name} className="w-16 h-16 rounded" />
              <div>
                <p className="font-semibold">{item.Product.name}</p>
                <p className="text-gray-500">
                  ${item.price} × {item.quantity}
                </p>
              </div>
            </div>
            <p className="text-gray-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <p className="text-xl font-bold">Total: ${order.total.toFixed(2)}</p>
      </div>
    </div>
  );
}
