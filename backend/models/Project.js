const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tytuł jest wymagany'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Opis jest wymagany']
    },
    image: {
        type: String,
        required: true // Będziemy tu trzymać np. "/uploads/171517000-arduino.jpg"
    },
    components: [{
        type: String // Prosta lista części jako tablica stringów
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);