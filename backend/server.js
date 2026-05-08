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

// Udostępnienie folderu 'uploads' publicznie pod adresem /uploads
// Dzięki temu React będzie mógł wyświetlić zdjęcie przez <img src="http://localhost:5000/uploads/nazwa.jpg" />
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- KONFIGURACJA MULTER (PLIKI) ---
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pliki trafią tutaj
    },
    filename: (req, file, cb) => {
        // Generowanie unikalnej nazwy: timestamp-oryginalnanazwa
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- IMPORT ROUTERÓW ---
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');

// --- ŚCIEŻKI (ROUTES) ---

// Specjalny endpoint do uploadu zdjęcia
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Nie przesłano pliku' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Obsługa błędów 404
app.use((req, res) => {
    res.status(404).json({ message: 'Nie znaleziono ścieżki' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na porcie ${PORT}`);
    console.log(`📁 Zdjęcia dostępne w: http://localhost:${PORT}/uploads/`);
});