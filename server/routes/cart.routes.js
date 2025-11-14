// server/routes/cart.routes.js
const express = require("express");
const { Cart } = require("../database/models");
const { verifyToken } = require("../utils/token");

const router = express.Router();

// GET cart-ul curentului user
router.get("/", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    let cart = await Cart.findOne({ where: { user_id } });
    if (!cart) {
      cart = await Cart.create({ user_id, items: [] });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update cart
router.put("/", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    const { items } = req.body;

    let cart = await Cart.findOne({ where: { user_id } });
    if (!cart) {
      cart = await Cart.create({ user_id, items });
    } else {
      cart.items = items;
      await cart.save();
    }

    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE cart
router.delete("/", verifyToken, async (req, res) => {
  try {
    const user_id = req.userId;
    let cart = await Cart.findOne({ where: { user_id } });
    if (!cart) {
      cart = await Cart.create({ user_id, items: [] });
    } else {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
