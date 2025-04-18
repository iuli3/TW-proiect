const City = require("../models/City");

exports.getCities = async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 }); 
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: "Eroare la preluarea orașelor", error: error.message });
  }
};
