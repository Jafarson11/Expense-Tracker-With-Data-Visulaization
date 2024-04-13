const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { type: String, unique: true }, // Assuming email is the unique identifier for users
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;

