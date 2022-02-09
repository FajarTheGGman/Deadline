const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const modelUsers = require('../models/Users');
const modelSchedule = require('../models/Schedule');

route.post('/getall', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                if(err){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelSchedule.find({}, (err, done) => {
                        if(err){
                            res.json({ error: '[!] Schedule not found' }).status(301)
                        }else{
                            res.json({ schedule: done }).status(200)
                        }
                    })
                }
            })
        }
    })
})

route.post('/getall/students', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(err){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelSchedule.find({ class: token.class, major: token.major }, (err, done) => {
                        if(err){
                            res.json({ error: '[!] Schedule not found' }).status(301)
                        }else{
                            res.json({ schedule: done }).status(200)
                        }
                    })
                }
            })
        }
    })
})

route.post('/update', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(err){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelSchedule.updateMany({ lessons: req.body.lessons }, {
                        teacher: req.body.teacher,
                        class: req.body.class,
                        major: req.body.major,
                        date: req.body.date,
                    }, (err, done) => {
                        if(err){
                            res.json({ error: '[!] Schedule not found' }).status(301)
                        }else{
                            res.json({ success: 'Schedule Updated!' }).status(200)
                        }
                    })
                }
            })
        }
    })
})

module.exports = route
