const Comment = require('../models/Comment');
const Project = require('../models/Project');

// @desc    Dodaj komentarz do projektu
// @route   POST /api/projects/:id/comments
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Nie znaleziono projektu' });
        }

        const newComment = new Comment({
            project: req.params.id,
            user: req.user._id,
            authorName: req.user.username,
            content
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Pobierz komentarze dla danego projektu
// @route   GET /api/projects/:id/comments
exports.getProjectComments = async (req, res) => {
    try {
        const comments = await Comment.find({ project: req.params.id }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
