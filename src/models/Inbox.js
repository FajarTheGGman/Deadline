const mongoose = require('mongoose');

const Inbox = mongoose.Schema({
    title: { type: String },
    body: { type: String },
    from: { type: String },
    class: { type: String },
    major: { type: String },
    date: { type: String },
    picture: { type: String, default: '' },
    gender: { type: String, default: 'male' },
    time: { type: String },
    verified: { type: Boolean, default: false },
})

module.exports = mongoose.model('Inbox', Inbox);
