const mongoose = require('mongoose');

const Location = mongoose.Schema({
    location: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    desc: { type: String },
})

module.exports = mongoose.model('Location', Location);
