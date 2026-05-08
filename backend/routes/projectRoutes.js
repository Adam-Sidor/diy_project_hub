const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const {
    addComment,
    getProjectComments
} = require('../controllers/commentController');

// Konfiguracja multera
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- ŚCIEŻKI PROJEKTÓW ---
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', protect, upload.single('image'), createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

// --- ŚCIEŻKI KOMENTARZY ---
router.get('/:id/comments', getProjectComments);
router.post('/:id/comments', protect, addComment);

module.exports = router;