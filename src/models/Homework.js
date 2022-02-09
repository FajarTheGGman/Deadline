const mongoose = require('mongoose');

const Completed = mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true },
    major: { type: String, required: true },
    date: { type: String, required: true },
})

const Homework = mongoose.Schema({
    title: { type: String, required: true },
    teacher: { type: String, required: true },
    class: { type: String, required: true },
    major: { type: String, required: true },
    completed: [Completed],
    desc: { type: String },
    deadline: { type: String, required: true },
})

module.exports = mongoose.model('Homework', Homework);
