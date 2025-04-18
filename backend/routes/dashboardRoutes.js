const express = require("express");
const Order = require("../models/Order");
const Event = require("../models/Event");
const Review = require("../models/review");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/organizer-stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Acces interzis" });
    }

    const events = await Event.find({ organizer: req.user.id });

    const stats = await Promise.all(events.map(async (event) => {
      const orders = await Order.find({ "items.event": event._id });

      let ticketsSold = 0;
      let totalRevenue = 0;

      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.event.toString() === event._id.toString()) {
            ticketsSold += item.quantity;
            totalRevenue += item.quantity * item.price;
          }
        });
      });

      return {
        eventId: event._id,
        title: event.title,
        ticketsSold,
        totalRevenue
      };
    }));

    const reviews = await Review.find({ organizerId: req.user.id });

    const ratingDistribution = [0, 0, 0, 0, 0];
    let totalRating = 0;

    reviews.forEach((review) => {
      const r = review.rating;
      ratingDistribution[r - 1]++;
      totalRating += r;
    });

    const averageRating = reviews.length ? (totalRating / reviews.length).toFixed(2) : "N/A";

    res.json({
      stats,
      reviews: {
        count: reviews.length,
        average: averageRating,
        distribution: ratingDistribution
      }
    });

  } catch (err) {
    console.error("❌ Eroare la dashboard:", err);
    res.status(500).json({ message: "Eroare server" });
  }
});

module.exports = router;
