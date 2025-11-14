// server/routes/order.routes.js
const express = require('express');
const { Order, OrderItem, Product } = require('../database/models');
const { verifyToken } = require('../utils/token');

const router = express.Router();

// Creează comandă
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items } = req.body; 
    const user_id = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({ user_id, total, status: 'Pending' });

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    const createdOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully', 
      data: createdOrder 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to place order', 
      data: error.message 
    });
  }
});


// Obține toate comenzile curentului utilizator
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    const orders = await Order.findAll({
      where: { user_id },
      include: [{
        model: OrderItem,
        include: [Product]
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Obține o comandă după ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
