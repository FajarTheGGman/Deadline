const mongoose = require('mongoose')

const Major = mongoose.Schema({
    name: { type: String },
    desc: { type: String }
})

module.exports = mongoose.model('Major', Major)
