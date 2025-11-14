import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchProducts, deleteProduct } from "../api/product.routes";
import LoadingSpinner from "../components/LoadingSpinner";
import { addToCart } from "../store/slices/cartSlice";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.role === "admin";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();
        if (data && Array.isArray(data)) {
          setProducts(data);
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleEditClick = (productId) => navigate(`/products/edit/${productId}`);

  const handleDeleteClick = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingId(productId);
      const response = await deleteProduct(productId);

      if (response?.success) {
        setProducts(products.filter((p) => p.id !== productId));
        toast.success("Product deleted successfully");
      } else {
        toast.error(response?.message || "Failed to delete product");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting the product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateClick = () => navigate("/products/create");

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
      </div>
    );

  if (!products || products.length === 0)
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">No products available</p>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Create Product
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div className="bg-white min-h-screen overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Products
          </h2>
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Create Product
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative border rounded-md p-2 hover:shadow-lg transition">
              <img
                alt={product.name}
                src={product.image || "https://via.placeholder.com/300"}
                className="w-full h-56 object-cover rounded-md"
              />

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-gray-700 font-semibold">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>

              {!isAdmin && (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 w-full bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500 text-sm"
                >
                  Add to Cart
                </button>
              )}

              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={() => handleEditClick(product.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(product.id)}
                    disabled={deletingId === product.id}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
