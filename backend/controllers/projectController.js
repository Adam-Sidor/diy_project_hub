const Project = require('../models/Project');

// @desc    Pobierz wszystkie projekty
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { components: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const projects = await Project.find(query).populate('author', 'username').sort({ createdAt: -1 });
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
        const { title, description, components, mainImageIndex } = req.body;
        
        // Obsługa wielu plików
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const newProject = new Project({
            title,
            description,
            images: imagePaths,
            mainImageIndex: mainImageIndex || 0,
            components: Array.isArray(components) ? components : (components ? components.split(',') : []),
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

        // Aktualizacja pól tekstowych
        const { title, description, components, mainImageIndex, existingImages } = req.body;
        
        if (title) project.title = title;
        if (description) project.description = description;
        if (mainImageIndex !== undefined) project.mainImageIndex = Number(mainImageIndex);
        
        if (components) {
            project.components = Array.isArray(components) ? components : (components ? components.split(',') : []);
        }

        // Obsługa usuwania zdjęć (aktualizacja listy istniejących)
        if (existingImages) {
            try {
                project.images = JSON.parse(existingImages);
            } catch (e) {
                // Jeśli nie jest JSONem (np. pusta tablica), ignorujemy błąd
            }
        }

        // Dodawanie nowych zdjęć
        if (req.files && req.files.length > 0) {
            const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
            project.images = [...project.images, ...newImagePaths];
        }

        const saved = await project.save();
        res.json(saved);
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

// @desc    Pobierz projekty zalogowanego użytkownika
// @route   GET /api/projects/user/me
exports.getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ author: req.user._id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};