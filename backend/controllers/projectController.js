const Project = require('../models/Project');

// @desc    Pobierz wszystkie projekty
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('author', 'username');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Pobierz szczegóły projektu
// @route   GET /api/projects/:id
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('author', 'username');
        if (!project) return res.status(404).json({ message: 'Projekt nie istnieje' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Dodaj nowy projekt
// @route   POST /api/projects
exports.createProject = async (req, res) => {
    try {
        const { title, description, components } = req.body;
        const newProject = new Project({
            title,
            description,
            image: req.file ? `/uploads/${req.file.filename}` : '',
            components: components ? components.split(',') : [],
            author: req.user._id
        });
        const saved = await newProject.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Aktualizuj projekt
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Nie znaleziono projektu' });

        // Sprawdzenie czy użytkownik jest właścicielem
        if (project.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Brak uprawnień do edycji tego projektu' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Usuń projekt
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Nie znaleziono projektu' });

        if (project.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Brak uprawnień do usunięcia tego projektu' });
        }

        await project.deleteOne();
        res.json({ message: 'Projekt usunięty' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};