const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order"); 

const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log("🔑 Token primit:", token);
  
    if (!token) {
      console.log("🚫 Token lipsă!");
      return res.status(401).json({ message: "Token lipsă" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
      console.log("✅ Token valid, utilizator:", decoded);
      req.user = decoded;
      next();
    } catch (err) {
      console.log("❌ Token invalid:", err.message);
      return res.status(401).json({ message: "Token invalid" });
    }
  };
  
router.post("/", authenticate, async (req, res) => {
  try {
    const { cardName, cardNumber, expDate, cvv, cartItems } = req.body;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items: cartItems.map(item => ({
        event: item.eventId,
        ticketType: item.ticketType,
        quantity: item.quantity,
        price: item.price
      })),
      total
    });

    res.status(200).json({ message: "Plată procesată și comandă salvată.", order });
  } catch (err) {
    console.error("Eroare la salvarea comenzii:", err);
    res.status(500).json({ message: "Eroare server la procesarea plății" });
  }
});

    router.get("/", authenticate, async (req, res) => {
        try {
          const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate("items.event"); 
      
          res.status(200).json(orders);
        } catch (err) {
          console.error("Eroare la obținerea comenzilor:", err);
          res.status(500).json({ message: "Eroare la încărcarea comenzilor" });
        }
      });
      
  

module.exports = router;
