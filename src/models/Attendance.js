const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacher: { type: String, required: true },
    lessons: { type: Array, required: true },
    major: { type: String, required: true },
    level: { type: String, required: true },
    clock: { type: String, required: true },
    class: { type: String, required: true },
    late: { type: Boolean, default: false },
    date: { type: String, required: true },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
