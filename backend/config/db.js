// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Używamy adresu 127.0.0.1 zamiast localhost dla stabilności w Node 18+
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diy_hub_db');
        console.log(`✅ MongoDB Połączone: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Błąd połączenia z MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;