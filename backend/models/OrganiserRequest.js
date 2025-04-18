const mongoose = require("mongoose");

const organizerRequestSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  phone: { type: String, required: true },
  details: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("OrganizerRequest", organizerRequestSchema);
