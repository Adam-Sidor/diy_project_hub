const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Pomocnicza funkcja do generowania tokena
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'super_tajny_klucz_123', {
        expiresIn: '30d'
    });
};

// @desc    Rejestracja użytkownika
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Sprawdzenie czy użytkownik istnieje
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'Użytkownik już istnieje' });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Logowanie użytkownika
// @route   POST /api/users/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Szukamy użytkownika i jawnie pobieramy hasło (bo ma select: false)
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Błędny email lub hasło' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Pobierz profil użytkownika
// @route   GET /api/users/profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Aktualizuj profil użytkownika
// @route   PUT /api/users/profile
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email
                // Tokena nie regenerujemy, chyba że zmienimy id
            });
        } else {
            res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
