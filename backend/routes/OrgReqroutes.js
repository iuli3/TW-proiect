const express = require("express");
const router = express.Router();
const OrganizerRequest = require("../models/OrganiserRequest"); 
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("✅ req.user:", req.user);
    console.log("📥 req.body:", req.body);

    const { companyName, phone, details } = req.body;

    if (!companyName || !phone || !details) {
      return res.status(400).json({ message: "Toate câmpurile sunt obligatorii" });
    }

    const existingRequest = await OrganizerRequest.findOne({ user: req.user.id });
    if (existingRequest) {
      return res.status(400).json({ message: "Ai trimis deja o cerere. Așteaptă aprobarea." });
    }

    const request = new OrganizerRequest({
      user: req.user.id,
      companyName,
      phone,
      details,
    });

    await request.save();
    res.status(201).json({ message: "Cererea a fost trimisă cu succes!" });

  } catch (error) {
    console.error("❌ Eroare în POST /api/organizer-requests:", error);
    res.status(500).json({ message: "Eroare la trimiterea cererii" });
  }
});

module.exports = router;
