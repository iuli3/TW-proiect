const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email profileImage firstName lastName phone");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Eroare la încărcarea profilului" });
  }
});

router.put("/update", authenticate, async (req, res) => {
    const allowedFields = ["firstName", "lastName", "username", "email", "phone", "profileImage"];
    const updates = {};
  
    for (let field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
      res.json(updatedUser);
    } catch (err) {
      console.error("Eroare la update profil:", err);
      res.status(500).json({ message: "Eroare la actualizarea profilului" });
    }
  });
  

router.put("/change-password", authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Parola curentă este incorectă" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Parola a fost actualizată cu succes" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la schimbarea parolei" });
  }
});

router.put("/profile-image", authenticate, async (req, res) => {
  const { profileImage } = req.body; 

  try {
    const user = await User.findByIdAndUpdate(req.user.id, { profileImage }, { new: true });
    res.json({ message: "Imaginea de profil a fost actualizată", image: user.profileImage });
  } catch (err) {
    res.status(500).json({ message: "Eroare la actualizarea imaginii" });
  }
});

router.delete("/", authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Contul a fost șters" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la ștergerea contului" });
  }
});

module.exports = router;
