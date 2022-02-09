const mongoose = require('mongoose');

const Major = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})

const Class = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})

const Lessons = mongoose.Schema({
    lessons: { type: String, required: true },
    teacher: { type: String, required: true },
    major: [Major],
    class: { type: String },
    day: { type: String },
    hours: { type: String },
    date: { type: String },
})

module.exports = mongoose.model('Lessons', Lessons);
