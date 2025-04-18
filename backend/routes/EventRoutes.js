const express = require("express");
const multer = require("multer");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const Review = require('../models/review');

const router = express.Router();



router.get("/random/:count", async (req, res) => {
  const count = parseInt(req.params.count);
  const randomEvents = await Event.aggregate([{ $sample: { size: count } }]);
  res.json(randomEvents);
});


router.get("/search/:text", async (req, res) => {
  const normalizeText = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  
      .replace(/[\s-]/g, "")             
      .toLowerCase();

  try {
    const query = normalizeText(req.params.text);
    const allEvents = await Event.find();

    const results = allEvents.filter((event) => {
      const title = normalizeText(event.title);
      const location = normalizeText(event.location);
      return title.includes(query) || location.includes(query);
    });

    res.json(results);
  } catch (err) {
    console.error("Eroare la căutare:", err);
    res.status(500).json({ message: "Eroare la căutarea evenimentelor" });
  }
});



router.get("/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find()
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments(); 

    res.json({
      events,
      totalEvents,
    });
  } catch (error) {
    console.error("Eroare la preluarea evenimentelor:", error);
    res.status(500).json({ message: "Eroare la preluarea evenimentelor" });
  }
});


router.get("/categoryOnly/:category", async (req, res) => {
  try {
    const events = await Event.find({ category: req.params.category });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Eroare la filtrarea după categorie" });
  }
});

router.get("/city/:city/category/:category", async (req, res) => {
  const { city, category } = req.params;
  try {
    const events = await Event.find({
      location: { $regex: new RegExp(city, "i") },
      category: category
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Eroare la filtrarea combinată" });
  }
});

router.get("/city/:city", async (req, res) => {
  try {
    const cityParam = decodeURIComponent(req.params.city);
    const events = await Event.find({
      location: { $regex: new RegExp(cityParam, "i") }
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Eroare la filtrarea după oraș" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const filter = req.query.organizer ? { organizer: req.query.organizer } : {};
    const events = await Event.find(filter);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Eroare la preluarea evenimentelor" });
  }
});


router.get("/my-events", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 User conectat:", req.user);

    const events = await Event.find({ organizer: req.user.id });

    res.json(events);
  } catch (error) {
    console.error("❌ Eroare la obținerea evenimentelor organizatorului:", error.message);
    res.status(500).json({ message: "Eroare la preluarea evenimentelor" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "username email _id");
    if (!event) return res.status(404).json({ message: "Evenimentul nu a fost găsit" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Eroare la preluarea evenimentului", error: error.message });
  }
});



router.post("/create", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Only organizers can add events" });
    }

    const {
      title,
      description,
      location,
      eventDate,
      eventTime,
      imageUrl,
      ticketTypes,
      category 
    } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Categoria este necesară!" });
    }

    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    let parsedTicketTypes;
    try {
      parsedTicketTypes = JSON.parse(ticketTypes);
    } catch (error) {
      return res.status(400).json({ message: "Invalid ticketTypes format" });
    }

    const newEvent = new Event({
      title,
      description,
      location,
      eventDate,
      eventTime,
      imageUrl: finalImageUrl,
      ticketTypes: parsedTicketTypes,
      category, 
      organizer: req.user.id
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });

  } catch (error) {
    console.error("Eroare la creare eveniment:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username");
    if (!user) return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Eroare server" });
  }
});


router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Evenimentul nu a fost găsit" });

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Nu ai permisiunea să editezi acest eveniment" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    console.error("❌ Eroare la editare:", error);
    res.status(500).json({ message: "Eroare la editarea evenimentului" });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Evenimentul nu a fost găsit" });

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Nu ai permisiunea să ștergi acest eveniment" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Eveniment șters cu succes" });
  } catch (error) {
    console.error("❌ Eroare la ștergere:", error);
    res.status(500).json({ message: "Eroare la ștergerea evenimentului" });
  }
});



module.exports = router;
