require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const eventRoutes = require("./routes/EventRoutes");
app.use("/api/events", eventRoutes);

const cityRoutes = require("./routes/CityRoutes");
app.use("/api/cities", cityRoutes);

const organizerRequestsRoutes = require("./routes/OrgReqroutes");
app.use("/api/organizer-requests", organizerRequestsRoutes);

const favoriteRoutes = require("./routes/favoritesRoutes");
app.use("/api/favorites", favoriteRoutes);
const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

const reviewRoutes=require('./routes/reviewroutes')
app.use('/api/reviews', reviewRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const dashboardroutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardroutes);

app.use("/api/admin", require("./routes/adminroutes"));

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));