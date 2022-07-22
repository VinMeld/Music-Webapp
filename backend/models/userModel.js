const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Song text is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Song text is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Song text is required'],
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema);