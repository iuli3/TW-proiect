const express = require("express");
const router = express.Router();
const OrganizerRequest = require("../models/OrganiserRequest");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");  
const Event = require("../models/Event");
const Order = require("../models/Order");
router.get("/stats", authMiddleware, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrganizers = await User.countDocuments({ role: "organizer" });
    const totalEvents = await Event.countDocuments();

    const orders = await Order.find().populate("items.event");

    let totalTickets = 0;
    let totalRevenue = 0;

    const eventSalesMap = {}; 

    orders.forEach(order => {
      order.items.forEach(item => {
        totalTickets += item.quantity;
        totalRevenue += item.quantity * item.price;

        const event = item.event;
        const eventId = event._id.toString();

        if (!eventSalesMap[eventId]) {
          eventSalesMap[eventId] = {
            title: event.title,
            ticketsSold: 0,
          };
        }

        eventSalesMap[eventId].ticketsSold += item.quantity;
      });
    });

    const topEvents = Object.values(eventSalesMap)
      .sort((a, b) => b.ticketsSold - a.ticketsSold)
      .slice(0, 5); 

    res.json({
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalTickets,
      totalRevenue,
      topEvents,
    });
  } catch (err) {
    console.error("❌ Eroare la obținerea statisticilor admin:", err);
    res.status(500).json({ message: "Eroare la obținerea statisticilor" });
  }
});


router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Eroare la obținerea utilizatorilor" });
  }
});

router.put("/users/:id/role", authMiddleware, isAdmin, async (req, res) => {
  const { role } = req.body;

  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Eroare la actualizarea rolului" });
  }
});

router.delete("/users/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilizator șters" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la ștergerea utilizatorului" });
  }
});

router.get("/organizer-requests", authMiddleware, isAdmin, async (req, res) => {
  try {
    const requests = await OrganizerRequest.find().populate("user", "username email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Eroare la obținerea cererilor" });
  }
});

router.put("/organizer-requests/:id/approve", authMiddleware, isAdmin, async (req, res) => {
  try {
    const request = await OrganizerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Cerere inexistentă" });

    const user = await User.findById(request.user);
    user.role = "organizer";
    await user.save();

    await request.deleteOne();
    res.json({ message: "Cererea a fost aprobată și rolul a fost actualizat" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la aprobare" });
  }
});

router.put("/organizer-requests/:id/reject", authMiddleware, isAdmin, async (req, res) => {
  try {
    const request = await OrganizerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Cerere inexistentă" });

    await request.deleteOne();
    res.json({ message: "Cererea a fost respinsă și ștearsă" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la respingere" });
  }
});

module.exports = router;
