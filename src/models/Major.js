const mongoose = require('mongoose')

const Major = mongoose.Schema({
    major: { type: String },
    desc: { type: String }
})

module.exports = mongoose.model('Major', Major)
