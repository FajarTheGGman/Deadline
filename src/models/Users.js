const mongoose = require('mongoose')

const Users = mongoose.Schema({
    name: { type: String },
    class: { type: String },
    major: { type: String },
    gender: { type: String },
    username: { type: String },
    password: { type: String },
    status: { type: String, default: 'studying' },
    since: { type: String },
    level: { type: String }
})

module.exports = mongoose.model('users', Users)
