const express = require('express');
const jwt = require('jsonwebtoken');
const route = express.Router();
const modelUsers = require('../models/users');
const modelAttendance = require('../models/attendance');

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
                }else if(token.level == 'students'){
                    modelAttendance.find({ class: req.body.class, major: req.body.major }, (err, result) => {
                        if(err){
                            res.json({ error: '[!] Error get all attendance' }).status(301);
                        }

                        if(result.length > 0){
                            res.json({ success: '[+] Get all attendance success', data: result });
                        }else{
                            res.json({ error: '[!] Error get all attendance' });
                        }
                    });
                }
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
                    modelAttendance.find({ name: token.name }, (err, check) => {
                        if(check.length == 0){
                            modelAttendance.insertMany({
                                name: token.name,
                                lessons: req.body.lessons,
                                time: req.body.time,
                                class: token.class,
                                major: token.major,
                                date: req.body.date,
                                late: req.body.late,
                            })
                        }else{
                            res.json({ error: "[!] You already get attendance" }).status(301)
                        }
                    })
                }
            })
        }
    })
})

module.exports = route;

