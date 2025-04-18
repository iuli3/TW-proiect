const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "organizer", "admin"],
    default: "user"
  },
  profileImage: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
