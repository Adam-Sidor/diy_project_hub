const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');

// Konfiguracja multera dla projektów
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// @desc    Pobierz wszystkie projekty
// @route   GET /api/projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('author', 'username');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Dodaj nowy projekt (Chronione)
// @route   POST /api/projects
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const { title, description, components } = req.body;

        const newProject = new Project({
            title,
            description,
            image: req.file ? `/uploads/${req.file.filename}` : '',
            components: components ? components.split(',') : [],
            author: req.user._id // Pobierane z middleware protect
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;