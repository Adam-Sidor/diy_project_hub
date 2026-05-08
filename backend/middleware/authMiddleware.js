const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Pobieramy token z nagłówka "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Weryfikacja tokena
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_tajny_klucz_123');

            // Pobranie danych użytkownika z bazy (bez hasła) i dołączenie do req
            req.user = await User.findById(decoded.id).select('-password');

            return next();
        } catch (error) {
            console.error('Błąd autoryzacji:', error.message);
            return res.status(401).json({ message: 'Brak autoryzacji, błędny token' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Brak autoryzacji, brak tokenu' });
    }
};

module.exports = protect;
