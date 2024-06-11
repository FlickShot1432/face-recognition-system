const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    descriptor: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);