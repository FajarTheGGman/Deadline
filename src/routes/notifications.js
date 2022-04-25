// Copyright 2022 By Fajar Firdaus

const express = require('express');
const route = express.Router();
const modelNotif = require('../models/Notifications');
const modelUsers = require('../models/Users');
const jwt = require('jsonwebtoken')

route.post('/getall', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301);
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(token.level == 'admin'){
                    if(users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelNotif.find({ username: token.username }, (err, notifs) => {
                            res.json({ notif: notifs }).status(200);
                        });
                    }
                }else if(token.level == 'students'){
                    if(users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelNotif.find({ username: token.username, class: token.class }, (err, notifs) => {
                                res.json({ notif: notifs }).status(200);
                        });
                    }
                }else if(token.level == 'developer'){
                    if(users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelNotif.find({ username: token.username }, (err, notifs) => {
                            res.json({ notif: notifs }).status(200);
                        });
                    }
                }else if(token.level == 'teacher'){
                    if(users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelNotif.find({ username: token.username }, (err, notifs) => {
                            res.json({ notif: notifs }).status(200);
                        });
                    }
                }
            })
        }
    })
})

route.post('/add', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
           modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelNotif.insertMany({
                        from: token.username,
                        title: req.body.title,
                        message: req.body.message,
                        class: req.body.class,
                        type: req.body.type,
                        time: req.body.time
                    }, (err, done) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(501)
                        }else{
                            res.json({ success: '[+] Successfully adding notification' }).status(200)
                        }
                    })
                }
            })
        }
    })
})

module.exports = route
