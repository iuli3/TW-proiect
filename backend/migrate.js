const mongoose = require('mongoose');
const Review = require('./models/review');
const Event = require('./models/Event');

// Conectează-te la baza de date
mongoose.connect('mongodb://localhost:27017/proiect-tw', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const migrateReviews = async () => {
  try {
    const reviews = await Review.find(); 
    for (const review of reviews) {
      const event = await Event.findOne({ organizer: review.organizerId });
      if (event) {
        // Actualizează câmpul eventId
        review.eventId = event._id;
        await review.save();
        console.log(`Review actualizat: ${review._id}`);
      } else {
        console.log(`Evenimentul nu a fost găsit pentru review: ${review._id}`);
      }
    }
    console.log("Migrare completă!");
  } catch (err) {
    console.error("Eroare la migrare:", err);
  } finally {
    mongoose.connection.close(); // Închide conexiunea la baza de date
  }
};

migrateReviews();