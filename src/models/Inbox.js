const mongoose = require('mongoose');

const Inbox = mongoose.Schema({
    title: { type: String },
    body: { type: String },
    from: { type: String },
    class: { type: String },
    major: { type: String },
    date: { type: String },
    time: { type: String }
})

module.exports = mongoose.model('Inbox', Inbox);
