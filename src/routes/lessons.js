const express = require('express');
const route = express.Router();
const modelUsers = require('../models/Users');
const modelLessons = require('../models/Lessons');
const jwt = require('jsonwebtoken');

route.post('/getall', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301);
        }else{
            if(token.level == 'students'){
                if(req.body.users == 'true'){
                    modelUsers.find({ username: req.body.users }, (err, users) => {
                        if(err || users.length == 0){
                            res.json({ error: '[!] User not found' }).status(301);
                        }else{
                            modelLessons.find({ class: token.class, day: req.body.day }, (err, lessons) => {
                                if(err){
                                    res.json({ error: '[!] Error' }).status(301);
                                }else{
                                    res.json({ lessons: lessons }).status(200);
                                }
                            });
                        }
                    })
                }else{
                    modelUsers.find({ username: token.username }, (err, users) => {
                        if(err || users.length == 0){
                            res.json({ error: '[!] User not found' }).status(301);
                        }else{
                            modelLessons.find({ class: token.class, day: req.body.day }, (err, lessons) => {
                                if(err){
                                    res.json({ error: '[!] Error' }).status(301);
                                }else{
                                    res.json({ lessons: lessons }).status(200);
                                }
                            });
                        }
                    })
                }
            }else if(token.level == 'admin'){
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0){
                        res.json({ error: '[!] user not found' }).status(301);
                    }else{
                        modelLessons.find({}, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] error' }).status(301);
                            }else{
                                res.json({ lessons: lessons }).status(200);
                            }
                        });
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0){
                        res.json({ error: '[!] user not found' }).status(301);
                    }else{
                        modelLessons.find({}, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] error' }).status(301);
                            }else{
                                res.json({ lessons: lessons }).status(200);
                            }
                        });
                    }
                })
            }else if(token.level == 'teacher'){
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0){
                        res.json({ error: '[!] user not found' }).status(301);
                    }else{
                        modelLessons.find({ teacher: token.username }, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] error' }).status(301);
                            }else{
                                res.json({ lessons: lessons }).status(200);
                            }
                        });
                    }
                })
            }
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
                    if(users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ lessons: { $regex: req.body.lessons }, teacher: token.username }, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301);
                            }else{
                                res.json({ lessons: lessons }).status(200);
                            }
                        })
                    }
                })
            }else{
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ lessons: { $regex: req.body.lessons } }, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301);
                            }else{
                                res.json({ lessons: lessons }).status(200);
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
                    if(err || users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ lessons: req.body.lessons }, (err, lessons) => {
                            if(err){
                                console.log(err);
                            }else{
                                if(lessons.length == 0){
                                    modelLessons.insertMany({
                                        lessons: req.body.lessons,
                                        teacher: req.body.teacher,
                                        class: req.body.class,
                                        day: req.body.day,
                                        date: req.body.time
                                    }, (err, lessons) => {
                                        if(err){
                                            res.json({ error: '[!] Error' }).status(301);
                                        }else{
                                            res.json({ success: '[+] Success' }).status(200);
                                        }
                                    })
                                }else{
                                    res.json({ error: '[!] Lesson already exists' }).status(301);
                                }
                            }
                        })
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username, level: 'developer' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ lessons: req.body.lessons }, (err, lessons) => {
                            if(err){
                                console.log(err);
                            }else{
                                if(lessons.length == 0){
                                    modelLessons.insertMany({
                                        lessons: req.body.lessons,
                                        teacher: req.body.teacher,
                                        class: req.body.class,
                                        day: req.body.day,
                                        date: req.body.time
                                    }, (err, lessons) => {
                                        if(err){
                                            res.json({ error: '[!] Error' }).status(301);
                                        }else{
                                            res.json({ success: '[+] Success' }).status(200);
                                        }
                                    })
                                }else{
                                    res.json({ error: '[!] Lesson already exists' }).status(301);
                                }
                            }
                        })
                    }
                })
            }else if(token.level == 'teacher'){
                modelUsers.find({ username: token.username, level: 'teacher' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ lessons: req.body.lessons }, (err, lessons) => {
                            if(err){
                                console.log(err);
                            }else{
                                if(lessons.length == 0){
                                    modelLessons.insertMany({
                                        lessons: req.body.lessons,
                                        teacher: token.username,
                                        class: req.body.class,
                                        day: req.body.day,
                                        date: req.body.time
                                    }, (err, lessons) => {
                                        if(err){
                                            res.json({ error: '[!] Error' }).status(301);
                                        }else{
                                            res.json({ success: '[+] Success' }).status(200);
                                        }
                                    })
                                }else{
                                    res.json({ error: '[!] Lesson already exists' }).status(301);
                                }
                            }
                        })
                    }
                })

            }
        }
    })
})

route.post('/update', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(token.level == 'admin'){
                modelUsers.find({ username: req.body.username, level: 'admin' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ title: req.body.title }, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301);
                            }else{
                                if(lessons.length == 0){
                                    modelLessons.updateOne({ title: req.body.title }, {
                                        title: req.body.title,
                                        teacher: req.body.teacher,
                                        day: req.body.day,
                                        hour: req.body.hour,
                                        date: req.body.date
                                    }, (err, lessons) => {
                                        if(err){
                                            res.json({ error: '[!] Error' }).status(301);
                                        }else{
                                            res.json({ success: '[+] Success' }).status(200);
                                        }
                                    })
                                }else{
                                    res.json({ error: '[!] Lesson already exists' }).status(301);
                                }
                                }
                        })
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: req.body.username, level: 'developer' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ title: req.body.title }, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301);
                            }else{
                                if(lessons.length == 0){
                                    modelLessons.updateOne({ title: req.body.title }, {
                                        title: req.body.title,
                                        teacher: req.body.teacher,
                                        day: req.body.day,
                                        hour: req.body.hour,
                                        date: req.body.date
                                    }, (err, lessons) => {
                                        if(err){
                                            res.json({ error: '[!] Error' }).status(301);
                                        }else{
                                            res.json({ success: '[+] Success' }).status(200);
                                        }
                                    })
                                }else{
                                    res.json({ error: '[!] Lesson already exists' }).status(301);
                                }
                            }
                        })
                    }
                })
            }else if(token.level == 'teacher'){
                modelUsers.find({ username: req.body.username, level: 'teacher' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ title: req.body.title }, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301);
                            }else{
                                if(lessons.length == 0){
                                    modelLessons.updateOne({ title: req.body.title }, {
                                        title: req.body.title,
                                        teacher: req.body.teacher,
                                        day: req.body.day,
                                        hour: req.body.hour,
                                        date: req.body.date
                                    }, (err, lessons) => {
                                        if(err){
                                            res.json({ error: '[!] Error' }).status(301);
                                        }else{
                                            res.json({ success: '[+] Success' }).status(200);
                                        }
                                    })
                                }else{
                                    res.json({ error: '[!] Lesson already exists' }).status(301);
                                }
                            }
                        })
                    }
                })
            }
        }
    })
})


route.post('/add/class', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                console.log(users);
                if(err || users.length == 0){
                    res.json({ error: '[!] User not found' }).status(301);
                }else{
                    modelLessons.find({ lessons: req.body.lessons }, (err, lessons) => {
                        if(err){
                            res.json({ error: '[!] Error' }).status(301);
                        }else{
                            if(lessons.length != 0){
                                modelLessons.updateMany({
                                    title: req.body.title,
                                    teacher: req.body.teacher,
                                }, { $push: { 
                                    major: {
                                        name: req.body.major,
                                    },
                                    class: {
                                        name: req.body.class,
                                    }
                                } }, (err, lessons) => {
                                    if(err){
                                        res.json({ error: '[!] Error' }).status(301);
                                    }else{
                                        res.json({ success: '[+] Success' }).status(200);
                                    }
                                })
                            }else{
                                res.json({ error: '[!] Lesson not found' }).status(301);
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
            if(token.level == 'admin'){
                modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ lessons: req.body.lessons }, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301);
                            }else{
                                if(lessons.length == 0){
                                    res.json({ error: '[!] Lesson not found' }).status(301);
                                }else{
                                    modelLessons.deleteOne({ lessons: req.body.lessons }, (err, lessons) => {
                                        if(err){
                                            res.json({ error: '[!] Error' }).status(301);
                                        }else{
                                            res.json({ success: '[+] Success' }).status(200);
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username, level: 'developer' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ lessons: req.body.lessons }, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301);
                            }else{
                                if(lessons.length == 0){
                                    res.json({ error: '[!] Lesson not found' }).status(301);
                                }else{
                                    modelLessons.deleteOne({ lessons: req.body.lessons }, (err, lessons) => {
                                        if(err){
                                            res.json({ error: '[!] Error' }).status(301);
                                        }else{
                                            res.json({ success: '[+] Success' }).status(200);
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }else if(token.level == 'teacher'){
                modelUsers.find({ username: token.username, level: 'teacher' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] User not found' }).status(301);
                    }else{
                        modelLessons.find({ lessons: req.body.lessons, teacher: token.username }, (err, lessons) => {
                            if(err){
                                res.json({ error: '[!] Error' }).status(301);
                            }else{
                                if(lessons.length == 0){
                                    res.json({ error: '[!] Lesson not found' }).status(301);
                                }else{
                                    modelLessons.deleteOne({ lessons: req.body.lessons, username: token.username }, (err, lessons) => {
                                        if(err){
                                            res.json({ error: '[!] Error' }).status(301);
                                        }else{
                                            res.json({ success: '[+] Success' }).status(200);
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        }
    })
})

module.exports = route;
