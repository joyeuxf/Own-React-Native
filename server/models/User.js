const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 64
    },
    lastName: {
        type: String,
        required: true,
        max: 64
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        defaultValue: false
    },
    isPaid: {
        type: Boolean,
        defaultValue: false
    },
    subscription: {
        type: Number,
        defaultValue: false
    },
    firstConnection: {
        type: Boolean,
        defaultValue: true
    }
})

module.exports = mongoose.model('User', userSchema);