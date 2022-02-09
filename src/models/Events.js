const mongoose = require('mongoose');

const Major = mongoose.Schema({
    name: { type: String, required: true },
})

const Class = mongoose.Schema({
    name: { type: String, required: true },
})

const Event = mongoose.Schema({
    class: [Class],
    major: [Major],
    date: {
        type: String,
        required: true
    },
    events: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Event', Event);
