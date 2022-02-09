const mongoose = require('mongoose');

const Schedule = mongoose.Schema({
    lessons: { type: String, required: true },
    teacher: { type: String, required: true },
    class: { type: String },
    major: { type: String },
    date: { type: String },
    day: { type: String },
    hours: { type: String },
    minutes: { type: String },
    seconds: { type: String },
});

module.exports = mongoose.model('Schedule', Schedule);
