const mongoose = require('mongoose')

const Notif = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    }
})

module.exports = mongoose.model('Notification', Notif)
