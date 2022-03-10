// Copyright 2022 by Fajar Firdaus

// Nessecary dependencies
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose')
const file = require('express-fileupload')
const colors = require('colors')
const bcrypt = require('bcrypt')

// [ Route ]
const routeAuth = require('./routes/auth')
const routeClass = require('./routes/class')
const routeRole = require('./routes/role')
const routeHomework = require('./routes/homework')
const routeLessons = require('./routes/lessons')
const routeEvents = require('./routes/events')
const routeInbox = require('./routes/inbox')
const routeLocation = require('./routes/location')
const routeAttendance = require('./routes/attendance')
const routeNotification = require('./routes/notifications')

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

mongoose.connect('mongodb://127.0.0.1:27017/absensi', { useUnifiedTopology: true }).then(() => {
    defaultUsers()
}).catch(err => {
    console.log(colors.red('[!] Error connecting to database'))
})

const defaultUsers = () => {
    const model = require('./models/Users')
    model.findOne({ level: 'developer' }, (err, data) => {
        bcrypt.hash('#justadeveloper', 10, (error, pw) => {
            if(data == null){
                model.insertMany({
                    name: "DeadLine Dev",
                    class: '',
                    major: '',
                    gender: 'male',
                    level: 'developer',
                    username: '@deadline',
                    password: pw,
                    since: new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear(),
                })
            }
        })
    })
}

const app = express();

app.use(express.static('public'));
app.use(file())
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/auth', routeAuth);
app.use('/class', routeClass);
app.use('/role', routeRole);
app.use('/homework', routeHomework);
app.use('/lessons', routeLessons);
app.use('/events', routeEvents);
app.use('/inbox', routeInbox);
app.use('/location', routeLocation);
app.use('/attendance', routeAttendance);
app.use('/notification', routeNotification);

app.get('/', (req, res) => {
  res.json({
      message: '{ Backend: Deadline Project }'
  });
});

app.use('/auth', routeAuth)

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
