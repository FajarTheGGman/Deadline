const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const modelUsers = require('../models/Users');
const modelClass = require('../models/Class');
const modelMajor = require('../models/Major');

route.post('/getall', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(err){
                    res.json({ error: '[!] Something wrong in server' }).status(501)
                }else{
                    modelClass.find({}, (err, classes) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(501)
                        }else{
                            res.json({ classes }).status(200)
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
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                if(err || users.length == 0){
                    res.json({ error: '[!] Something wrong in server' }).status(501)
                }else{
                    modelClass.find({ class: req.body.class }, (err, classes) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(501)
                        }else{
                            if(classes.length == 0){
                                modelClass.insertMany({ 
                                    class: req.body.class,
                                    major: req.body.major,
                                }, (err, classes) => {
                                    if(err){
                                        res.json({ error: '[!] Something wrong in server' }).status(501)
                                    }else{
                                        res.json({ success: '[+] Success add class' }).status(200)
                                    }
                                })
                            }else{
                                res.json({ error: '[!] Class already exist' }).status(501)
                            }
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
            modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                if(err || users.length == 0){
                    res.json({ error: '[!] Something wrong in server' }).status(501)
                }else{
                    modelClass.find({ class: req.body.class }, (err, classes) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(501)
                        }else{
                            if(classes.length == 0){
                                res.json({ error: '[!] Class does not exist' }).status(501)
                            }else{
                                modelClass.updateOne({ class: req.body.class }, {
                                    class: req.body.new_class,
                                    major: req.body.new_major,
                                }, (err, classes) => {
                                    if(err){
                                        res.json({ error: '[!] Something wrong in server' }).status(501)
                                    }else{
                                        res.json({ success: '[+] Success update class' }).status(200)
                                    }
                                })
                            }
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
            modelUsers.find({ username: req.body.username, level: 'admin' }, (err, users) => {
                if(err || users.length == 0){
                    res.json({ error: '[!] Something wrong in server' }).status(501)
                }else{
                    modelClass.deleteOne({ class: req.body.class, major: req.body.major }, (err, classes) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(501)
                        }else{
                            res.json({ success: '[+] Success delete class' }).status(200)
                        }
                    })
                }
            })
        }
    })
})

// Major Section

route.post('/major/getall', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(err || users.length == 0){
                    res.json({ error: '[!] Users not found' }).status(501)
                }else{
                    modelMajor.find({}, (err, majors) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(501)
                        }else{
                            res.json({ majors: majors }).status(200)
                        }
                    })
                }
            })
        }
    })
})

module.exports = route;
