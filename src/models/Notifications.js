const mongoose = require('mongoose')

const Notif = mongoose.Schema({
    from: {
        type: String,
    },
    title: {
        type: String,
    },
    message: {
        type: String,
    },
    type: {
        type: String,
    },
    class: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    }
})

module.exports = mongoose.model('Notification', Notif)
