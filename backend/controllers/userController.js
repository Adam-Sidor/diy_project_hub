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
