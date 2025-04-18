const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("🔐 Token primit:", token);

  if (!token) {
    return res.status(401).json({ message: "Token lipsă din cerere" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    console.log("🧾 Token decodat:", decoded);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error("❌ Token invalid:", error.message);
    res.status(400).json({ message: "Token invalid sau expirat" });
  }
};

module.exports = authenticate;
