const mongoose = require('mongoose');

const Class = mongoose.Schema({
    class: { type: String },
    desc: { type: String },
})

module.exports = mongoose.model('Class', Class);
