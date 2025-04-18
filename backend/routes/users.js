const express = require('express');
const router = express.Router();
const User = require('../models/User');



router.get("/all-organizers", async (req, res) => {
  try {
    const organizers = await User.find({ role: "organizer" }).select(
      "_id username firstName lastName profileImage"
    );
    res.json(organizers);
  } catch (err) {
    console.error("Eroare la fetch organizatori:", err);
    res.status(500).json({ message: "Eroare server la organizatori" });
  }
});



router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit." });
    }

    res.json(user);
  } catch (error) {
    console.error("Eroare la preluarea utilizatorului:", error);
    res.status(500).json({ message: "Eroare internă la preluarea utilizatorului." });
  }
});

module.exports = router;
