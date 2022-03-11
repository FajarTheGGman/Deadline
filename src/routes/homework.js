const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const modelUsers = require('../models/Users');
const modelHomework = require('../models/Homework');

route.post('/getall', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0 || err){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    if(token.level == 'admin'){
                        modelHomework.find({}, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
                            }
                        })
                    }else if(token.level == 'students'){
                        modelHomework.find({ class: token.class }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
                            }
                        })
                    }else if(token.level == 'developer'){
                        modelHomework.find({}, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
                            }
                        })
                    }else if(token.level == 'teacher'){
                        modelHomework.find({ teacher: token.username }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
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
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0 || err){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    if(token.level == 'admin'){
                        modelHomework.find({}, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
                            }
                        })
                    }else if(token.level == 'students'){
                        modelHomework.find({ class: token.class }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
                            }
                        })
                    }else if(token.level == 'developer'){
                        modelHomework.find({}, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
                            }
                        })
                    }else if(token.level == 'teacher'){
                        modelHomework.find({ teacher: token.username, _id: req.body.id }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
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
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(token.level == 'teacher'){
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0 || err){
                        res.json({ error: '[!] User not found' }).status(301)
                    }else{
                        modelHomework.find({ title: { $regex: req.body.homework }, teacher: token.username }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
                            }
                        })
                    }
                })
            }else{
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0 || err){
                        res.json({ error: '[!] User not found' }).status(301)
                    }else{
                        modelHomework.find({ title: { $regex: req.body.homework } }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ homework: homework }).status(200)
                            }
                        })
                    }
                })
            }
        }
    })
})

route.post('/add', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(token.level == 'admin'){
                modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                    if(users.length == 0 || err){
                        res.json({ error: '[!] User not found' }).status(301)
                    }else{
                        modelHomework.insertMany({
                            title: req.body.title,
                            lessons: req.body.lessons,
                            teacher: token.username,
                            class: req.body.class,
                            major: req.body.major,
                            desc: req.body.desc,
                            deadline: req.body.deadline
                        }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ success: '[+] Homework added!' }).status(200)
                            }
                        })
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username, level: 'developer' }, (err, users) => {
                    if(users.length == 0 || err){
                        res.json({ error: '[!] User not found' }).status(301)
                    }else{
                        modelHomework.insertMany({
                            title: req.body.title,
                            lessons: req.body.lessons,
                            teacher: req.body.teacher,
                            class: req.body.class,
                            major: req.body.major,
                            desc: req.body.desc,
                            deadline: req.body.deadline
                        }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ success: '[+] Homework added!' }).status(200)
                            }
                        })
                    }
                })
            }else if(token.level == 'teacher'){
                modelUsers.find({ username: token.username, level: 'teacher' }, (err, users) => {
                    if(users.length == 0 || err){
                        res.json({ error: '[!] User not found' }).status(301)
                    }else{
                        modelHomework.insertMany({
                            title: req.body.title,
                            lessons: req.body.lessons,
                            teacher: req.body.teacher,
                            class: req.body.class,
                            major: req.body.major,
                            desc: req.body.desc,
                            deadline: req.body.deadline
                        }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ success: '[+] Homework added!' }).status(200)
                            }
                        })
                    }
                })
            }
        }
    })
})

route.post('/add/completed', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0 || err){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    modelHomework.find({ title: req.body.title, teacher: req.body.teacher }, (err, homework) => {
                        if(homework.length == 0 || err){
                            res.json({ error: '[!] Homework not found' }).status(301)
                        }else{
                            modelHomework.updateOne({ title: req.body.title, teacher: req.body.teacher }, { 
                                $push: { 
                                    completed: {
                                        title_result: req.body.title_result,
                                        desc_result: req.body.desc_result,
                                        name: token.name,
                                        class: token.class,
                                        major: token.major,
                                        date: req.body.date
                                    }
                                } 
                            }, (err, homework) => {
                                    res.json({ success: '[+] Homework Completed!' }).status(200)
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
            if(token.level == 'admin'){
                modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                    if(users.length == 0 || err){
                        res.json({ error: '[!] User not found' }).status(301)
                    }else{
                        modelHomework.deleteOne({ _id: req.body.id }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ success: '[+] Homework Deleted!' }).status(200)
                            }
                        })
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username, level: 'developer' }, (err, users) => {
                    if(users.length == 0 || err){
                        res.json({ error: '[!] User not found' }).status(301)
                    }else{
                        modelHomework.deleteOne({ _id: req.body.id }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ success: '[+] Homework Deleted!' }).status(200)
                            }
                        })
                    }
                })
            }else if(token.level == 'teacher'){
                modelUsers.find({ username: token.username, level: 'teacher' }, (err, users) => {
                    if(users.length == 0 || err){
                        res.json({ error: '[!] User not found' }).status(301)
                    }else{
                        modelHomework.deleteOne({ _id: req.body.id }, (err, homework) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301)
                            }else{
                                res.json({ success: '[+] Homework Deleted!' }).status(200)
                            }
                        })
                    }
                })
            }
        }
    })
})

module.exports = route
