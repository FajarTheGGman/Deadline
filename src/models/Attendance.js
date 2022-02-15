const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String },
    picture: { type: String, default: '' },
    gender: { type: String },
    lessons: { type: String },
    major: { type: String },
    level: { type: String },
    time: { type: String },
    class: { type: String },
    late: { type: Boolean, default: false },
    date: { type: String },
    datetime: { type: String },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
