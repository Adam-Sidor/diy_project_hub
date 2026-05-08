const Project = require('../models/Project');

// @desc    Pobierz wszystkie projekty
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('author', 'username');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera przy pobieraniu projektów' });
    }
};

// @desc    Dodaj nowy projekt
// @route   POST /api/projects
exports.createProject = async (req, res) => {
    try {
        const { title, description, imageUrl, components } = req.body;

        // req.user pochodzi z middleware autoryzacji, który zrobimy później
        const newProject = new Project({
            title,
            description,
            imageUrl,
            components,
            author: req.user._id
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};