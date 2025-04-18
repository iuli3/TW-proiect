const express = require('express');
const Review = require('../models/review');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/', authMiddleware, async (req, res) => {
  const { organizerId, rating, comment } = req.body;

  if (!organizerId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "OrganizerId și un rating între 1 și 5 sunt necesare." });
  }

  try {
    const review = new Review({
      organizerId,
      userId: req.user.id,
      rating,
      comment: comment || ""
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error("Eroare la salvarea recenziei:", err);
    res.status(500).json({ message: "Eroare la salvarea recenziei." });
  }
});

router.get('/organizer/:organizerId', async (req, res) => {
  try {
    const reviews = await Review.find({ organizerId: req.params.organizerId })
      .populate('userId', 'username');
    res.json(reviews);
  } catch (err) {
    console.error("Eroare la fetch recenzii:", err);
    res.status(500).json({ message: "Eroare la încărcarea recenziilor." });
  }
});

router.get('/stats/organizer/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ organizerId: req.params.id });
    const total = reviews.length;
    const ratingsCount = [0, 0, 0, 0, 0];

    reviews.forEach(r => ratingsCount[r.rating - 1]++);

    const percentages = ratingsCount.map((count, i) => ({
      rating: i + 1,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0
    }));

    const avg = total ? (reviews.reduce((a, r) => a + r.rating, 0) / total).toFixed(1) : 0;

    res.json({ totalReviews: total, percentages, averageRating: avg });
  } catch (err) {
    console.error("Eroare la stats:", err);
    res.status(500).json({ message: "Eroare la obținerea statisticilor." });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review-ul nu a fost găsit." });
    }

    if (review.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Nu ai permisiunea să ștergi acest review." });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review șters cu succes." });
  } catch (err) {
    console.error("Eroare la ștergerea review-ului:", err);
    res.status(500).json({ message: "Eroare la ștergerea review-ului." });
  }
});

module.exports = router;
