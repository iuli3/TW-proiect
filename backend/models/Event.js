const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  location: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  views: { type: Number, default: 0 },
  ticketTypes: [
    {
      type: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  refundPolicy: { type: String },
  ageRestriction: { type: Number },
  dressCode: { type: String },
  category: {
    type: String,
    required: true,
    enum: ["Muzică", "Teatru", "Sport", "Stand-up", "Business", "Festival"]
  }


});

module.exports = mongoose.model("Event", eventSchema);
