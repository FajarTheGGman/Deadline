// Copyright 2022 by Fajar Firdaus

// Nessecary dependencies
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose')
const file = require('express-fileupload')

// [ Route ]
const routeAuth = require('./routes/auth')
const routeClass = require('./routes/class')
const routeRole = require('./routes/role')
const routeHomework = require('./routes/homework')
const routeLessons = require('./routes/lessons')
const routeEvents = require('./routes/events')
const routeInbox = require('./routes/inbox')
const routeLocation = require('./routes/location')

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

mongoose.connect(process.env.DB, { useUnifiedTopology: true })

const app = express();

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
