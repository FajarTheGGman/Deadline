const mongoose = require('mongoose');

const Inbox = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Inbox', Inbox);
