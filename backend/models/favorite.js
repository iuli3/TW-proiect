const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
