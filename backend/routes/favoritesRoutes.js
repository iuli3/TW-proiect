const express = require("express");
const router = express.Router();
const Favorite = require("../models/favorite");
const Event = require("../models/Event");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate("event");
    const events = favorites.map(fav => fav.event);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Eroare la preluarea favoritelor" });
  }
});

router.post("/", authenticate, async (req, res) => {
  const { eventId } = req.body;

  try {
    const alreadyFavorite = await Favorite.findOne({ user: req.user.id, event: eventId });
    if (alreadyFavorite) {
      return res.status(400).json({ message: "Evenimentul este deja în favorite" });
    }

    const favorite = new Favorite({ user: req.user.id, event: eventId });
    await favorite.save();
    res.status(201).json({ message: "Eveniment adăugat la favorite" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la adăugare" });
  }
});

router.delete("/:eventId", authenticate, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user.id, event: req.params.eventId });
    res.status(200).json({ message: "Eveniment eliminat din favorite" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la ștergere" });
  }
});

module.exports = router;
