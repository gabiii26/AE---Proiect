// client/src/pages/MyOrdersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../api/order.routes";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const response = await fetchUserOrders();
        if (response?.success) {
          setOrders(response.data);
        } else {
          setError(response?.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  if (!orders.length)
    return <div className="p-10 text-center text-gray-500">You have no orders yet.</div>;

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-md p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/order-summary`, { state: { orderId: order.id } })}
          >
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-gray-500">{order.items.length} items</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${order.total.toFixed(2)}</p>
              <p className="text-gray-500">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
