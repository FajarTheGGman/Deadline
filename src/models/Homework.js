const mongoose = require('mongoose');

const Completed = mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true },
    major: { type: String, required: true },
    date: { type: String, required: true },
})

const Homework = mongoose.Schema({
    title: { type: String },
    lessons: { type: String },
    teacher: { type: String },
    class: { type: String },
    major: { type: String },
    completed: [Completed],
    desc: { type: String },
    deadline: { type: String },
})

module.exports = mongoose.model('Homework', Homework);
