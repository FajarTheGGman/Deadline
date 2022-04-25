// Copyright 2022 By Fajar Firdaus

const express = require('express');
const jwt = require('jsonwebtoken');
const route = express.Router();
const modelUsers = require('../models/Users');
const modelAttendance = require('../models/Attendance');

route.post('/getall', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong authorization' });
        }
        modelUsers.find({ username: token.username }, (err, result) => {
            if(err){
                res.json({ error: '[!] Users no found' }).staus(301);
            }
            if(result.length > 0){
                if(token.level == 'admin'){
                    modelAttendance.find({ date: { $regex: req.body.date } }, (err, result) => {
                        if(err){
                            res.json({ error: '[!] Error get all attendance' }).status(301);
                        }

                        if(result.length > 0){
                            res.json({ success: '[+] Get all attendance success', data: result });
                        }else{
                            res.json({ error: '[!] Error get all attendance' });
                        }
                    });
                }else if(token.level == 'students'){
                    modelAttendance.find({ class: token.class, major: token.major, lessons: req.body.lessons }).sort({ time: 'asc' }).exec((err, result) => {
                        if(err){
                            res.json({ error: '[!] Error get all attendance' }).status(301);
                        }else{
                            res.json({ data: result });
                        }
                    });
                }else if(token.level == 'developer'){
                    modelAttendance.find({ class: { $regex: req.body.class }, major: { $regex: req.body.major }, username: { $regex: req.body.username }, date: { $regex: req.body.date } }, (err, result) => {
                        if(err){
                            res.json({ error: '[!] Error get all attendance' }).status(301);
                        }else{
                            res.json({ success: '[+] Get all attendance success', data: result });
                        }
                    });
                }else if(token.level == 'teacher'){
                    if(req.query.all == 'true'){
                        modelAttendance.find({ teacher: token.username }, (err, result) => {
                            if(err){
                                res.json({ error: '[!] Error get all attendance' }).status(301);
                            }else{
                                res.json({ success: '[+] Get all attendance success', data: result });
                            }
                        });
                    }else if(req.query.all == 'false'){
                        modelAttendance.find({ date: { $regex: req.body.date }, major: { $regex: req.body.major }, class: { $regex: req.body.class }, name: { $regex: req.body.username }, teacher: token.username }, (err, result) => {
                            if(err){
                                console.log(err)
                                res.json({ error: '[!] Error get all attendance' }).status(301);
                            }

                            if(result.length > 0){
                                res.json({ success: '[+] Get all attendance success', data: result });
                            }else{
                                res.json({ error: '[!] Error get all attendance' });
                            }
                        });
                    }
                }
            }else{
                res.json({ error: '[!] Error get all attendance' });
            }
        });
    })
})

route.post('/add/manual', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong authorization' });
        }else{
            modelUsers.find({ username: token.username }, (err, result) => {
                if(err || result.length == 0){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelAttendance.find({ date: req.body.date, name: req.body.name, class: req.body.class, major: req.body.major, lessons: req.body.lessons }, (err, result) => {
                        if(result.length != 0){
                            res.json({ error: '[!] Error add attendance' }).status(301);
                        }else{
                            let data = {
                                date: req.body.date,
                                name: req.body.name,
                                class: req.body.class,
                                major: req.body.major,
                                lessons: req.body.lessons,
                                teacher: token.username,
                                username: req.body.username,
                                time: req.body.time,
                            }
                            modelAttendance.insertMany(data, (err, result) => {
                                if(err){
                                    res.json({ error: '[!] Error add attendance' }).status(301);
                                }else{
                                    res.json({ success: '[+] Add attendance success' });
                                }
                            });
                        }
                    });
                }
            });
        }
    })
})


route.post('/delete', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong authorization' });
        }else{
            modelUsers.find({ username: token.username }, (err, result) => {
                if(err){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelAttendance.find({ _id: req.body.id }, (err, data) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(501)
                        }else{
                            modelAttendance.deleteOne({ _id: req.body.id }, (err, result) => {
                                if(err){
                                    res.json({ error: '[!] Error delete attendance' }).status(501)
                                }else{
                                    res.json({ success: '[+] Delete attendance success' });
                                }
                            });
                        }
                    })
                }
            })
        }
    })
})

route.post('/getall', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong authorization' });
        }
        modelUsers.find({ username: token.username }, (err, result) => {
            if(err){
                res.json({ error: '[!] Users no found' }).staus(301);
            }
            if(result.length > 0){
                    modelAttendance.find({}, (err, result) => {
                        if(err){
                            res.json({ error: '[!] Error get all attendance' }).status(301);
                        }

                        if(result.length > 0){
                            res.json({ success: '[+] Get all attendance success', data: result });
                        }else{
                            res.json({ error: '[!] Error get all attendance' });
                        }
                    });
            }else{
                res.json({ error: '[!] Error get all attendance' });
            }
        });
    })
})


route.post('/add', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong authorization' }).status(301);
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] Users not found' }).status(301);
                }else{
                    if(req.query.qr == 'true'){
                        modelAttendance.find({ name: token.name, date: req.body.date, class: req.body.class }, (err, check) => {
                                modelAttendance.insertMany({
                                    name: token.name,
                                    username: token.username,
                                    picture: token.picture,
                                    gender: token.gender,
                                    lessons: req.body.lessons,
                                    teacher: req.body.teacher,
                                    time: req.body.time,
                                    class: token.class,
                                    major: token.major,
                                    absent: req.body.absent,
                                    absent_notes: req.body.absent_notes,
                                    date: req.body.date,
                                    late: req.body.late,
                                }, (err, done) => {
                                    if(err){
                                        res.json({ error: '[!] Error add attendance' }).status(301);
                                    }else{
                                        res.json({ success: '[+] Add attendance success' });
                                    }
                                });
                        })
                    }else{
                        modelAttendance.find({ name: token.name, lessons: req.body.lessons, date: req.body.date }, (err, check) => {
                            if(check.length == 0){
                                modelAttendance.insertMany({
                                    name: token.name,
                                    username: token.username,
                                    lessons: req.body.lessons,
                                    teacher: req.body.teacher,
                                    time: req.body.time,
                                    gender: token.gender,
                                    absent: req.body.absent,
                                    absent_notes: req.body.absent_notes,
                                    class: token.class,
                                    major: token.major,
                                    date: req.body.date,
                                    late: req.body.late,
                                }, (err, done) => {
                                    if(err){
                                        res.json({ error: '[!] Error add attendance' }).status(301);
                                    }else{
                                        res.json({ success: '[+] Add attendance success' });
                                    }
                                });
                            }else{
                                res.json({ already: '[!] You already get attendance' }).status(301);
                            }
                                
                        })
                    }
                }
            })
        }
    })
})

module.exports = route;

