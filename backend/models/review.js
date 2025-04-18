const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String, 
    default: ''   
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
