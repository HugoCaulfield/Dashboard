const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    active: { type: Boolean, required: true },
    activeHash: { type: String, required: true },
    googleId: { type: String, required: false },
    googleToken: { type: String, required: false },
    facebookId: { type: String, required: false },
    twitterId: { type: String, required: false },
    subscribe: { type: [String], required: false },
    Widgets: [{
        title: String, required: false,
        preference: String, required: false,
        refreshRate: Number, required: false,
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
