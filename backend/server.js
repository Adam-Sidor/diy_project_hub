const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Załadowanie zmiennych środowiskowych
dotenv.config();

// Połączenie z MongoDB
connectDB();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Udostępnienie folderu 'uploads' publicznie
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- IMPORT ROUTERÓW ---
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');

// --- ŚCIEŻKI (ROUTES) ---
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Obsługa błędów 404
app.use((req, res) => {
    res.status(404).json({ message: 'Nie znaleziono ścieżki' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na porcie ${PORT}`);
});