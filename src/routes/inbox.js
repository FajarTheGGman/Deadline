// Copyright 2022 By Fajar Firdaus

const express = require('express');
const jwt = require('jsonwebtoken');
const route = express.Router();
const modelUsers = require('../models/Users');
const modelInbox = require('../models/Inbox');

route.post('/getall', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: "[!] Wrong Authorization" }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: "[!] User not found" }).status(301)
                }else{
                    if(token.level == 'admin'){
                        modelInbox.find({}, (err, done) => {
                            if(err){
                                res.json({ error: "[!] Error" }).status(301)
                            }else{
                                res.json({ inbox: done }).status(200)
                            }
                        })
                    }else if(token.level == 'students'){
                        modelInbox.find({ class: token.class }, (err, done) => {
                            if(err){
                                res.json({ error: "[!] Error" }).status(301)
                            }else{
                                res.json({ inbox: done }).status(200)
                            }
                        })
                    }else if(token.level == 'developer'){
                        modelInbox.find({}).sort([['time', -1], ['date', -1]]).exec((err, done) => {
                            if(err){
                                res.json({ error: "[!] Error" }).status(301)
                            }else{
                                res.json({ inbox: done }).status(200)
                            }
                        })
                    }else if(token.level == 'teacher'){
                        modelInbox.find({}).sort([['time', -1], ['date', -1]]).exec((err, done) => {
                            if(err){
                                res.json({ error: "[!] Error" }).status(301)
                            }else{
                                res.json({ inbox: done }).status(200)
                            }
                        })
                    }
                }
            })
        }
    })
})

route.post('/get', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: "[!] Wrong Authorization" }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: "[!] User not found" }).status(301)
                }else{
                    if(token.level == 'admin'){
                        modelInbox.find({}, (err, done) => {
                            if(err){
                                res.json({ error: "[!] Error" }).status(301)
                            }else{
                                res.json({ inbox: done }).status(200)
                            }
                        })
                    }else if(token.level == 'students'){
                        modelInbox.find({ _id: req.body.id, class: token.class }, (err, done) => {
                            if(err){
                                res.json({ error: "[!] Error" }).status(301)
                            }else{
                                res.json({ inbox: done }).status(200)
                            }
                        })
                    }
                }
            })
        }
    })
})

route.post('/search', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: "[!] Wrong Authorization" }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: "[!] User not found" }).status(301)
                }else{
                    modelInbox.find({ title: { $regex: req.body.title } }, (err, done) => {
                        if(err){
                            res.json({ error: "[!] Error" }).status(301)
                        }else{
                            res.json({ inbox: done }).status(200)
                        }
                    })
                }
            })
        }
    })
})

route.post('/add', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: "[!] Wrong Authorization" }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: "[!] User not found" }).status(301)
                }else{
                    modelInbox.find({ title: req.body.title }, (err, done) => {
                        if(done.length == 0){
                            modelInbox.insertMany({ 
                                title: req.body.title,
                                body: req.body.body,
                                from: token.username,
                                class: req.body.class,
                                major: req.body.major,
                                date: req.body.date,
                                time: req.body.time,
                                gender: req.body.gender,
                                picture: req.body.picture,
                                verified: req.body.verified
                            }, (err, inbox) => {
                                if(err){
                                    res.json({ error: "[!] Failed to add inbox" }).status(301)
                                }else{
                                    res.json({ success: "[!] Successfully added inbox" }).status(200)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

route.post('/update', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    modelInbox.find({ title: req.body.title }, (err, done) => {
                        if(done.length == 0){
                            res.json({ error: '[!] Inbox not found' }).status(301)
                        }else{
                            modelInbox.updateOne({ title: req.body.title }, {
                                title: req.body.title,
                                from: token.username,
                                class: token.class,
                                major: token.major,
                                date: req.body.date,
                            }, (err, inbox) => {
                                if(err){
                                    res.json({ error: '[!] Failed to update inbox' }).status(301)
                                }else{
                                    res.json({ success: '[!] Successfully updated inbox' }).status(200)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

route.post('/delete', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    modelInbox.find({ title: req.body.title, from: token.username }, (err, done) => {
                        if(done.length == 0){
                            res.json({ error: '[!] Inbox not found' }).status(301)
                        }else{
                            modelInbox.deleteOne({ title: req.body.title, username: token.username }, (err, inbox) => {
                                if(err){
                                    res.json({ error: '[!] Failed to delete inbox' }).status(301)
                                }else{
                                    res.json({ success: '[!] Successfully deleted inbox' }).status(200)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

module.exports = route
