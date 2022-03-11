const mongoose = require('mongoose');

const Completed = mongoose.Schema({
    name: { type: String },
    title_result: { type: String },
    desc_result: { type: String },
    class: { type: String },
    major: { type: String },
    date: { type: String },
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
