import axiosAuth from "../axios/axiosAuth";

// Crează comandă
export const createOrder = async (orderData) => {
  try {
    const response = await axiosAuth.post('orders', {
      items: orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price, 
      }))
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    return error.response?.data;
  }
};

// Obține comenzile curentului utilizator
export const fetchUserOrders = async () => {
  try {
    const response = await axiosAuth.get('orders/my-orders');
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return error.response?.data;
  }
};

// Obține toate comenzile 
export const fetchAllOrders = async () => {
  try {
    const response = await axiosAuth.get('orders');
    return response.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return error.response?.data;
  }
};

// Obține comandă după ID
export const getOrderById = async (id) => {
  try {
    const response = await axiosAuth.get(`orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return error.response?.data;
  }
};
