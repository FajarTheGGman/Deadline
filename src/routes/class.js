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
                            res.json({ class: classes }).status(200)
                        }
                    })
                }
            })
        }
    })
})

route.post('/get', (req,res) => {
    modelClass.find({}, (err, classes) => {
        if(err){
            res.json({ error: '[!] Something wrong in server' }).status(501)
        }else{
            res.json({ class: classes }).status(200)
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
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        modelClass.find({ class: req.body.class }, (err, classes) => {
                            if(err){
                                res.json({ error: '[!] Something wrong in server' }).status(501)
                            }else{
                                if(classes.length == 0){
                                    modelClass.insertMany({ 
                                        class: req.body.class,
                                        desc: req.body.desc,
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
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username, level: 'developer' }, (err, users) => {
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
                                        desc: req.body.desc,
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
        }
    })
})

route.post('/update', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(token.level == 'admin'){
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
            }else if(token.level == 'developer'){
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
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        modelClass.deleteOne({ class: req.body.class }, (err, classes) => {
                            if(err){
                                res.json({ error: '[!] Something wrong in server' }).status(501)
                            }else{
                                res.json({ success: '[+] Success delete class' }).status(200)
                            }
                        })
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username, level: 'developer' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        modelClass.deleteOne({ class: req.body.class }, (err, classes) => {
                            if(err){
                                res.json({ error: '[!] Something wrong in server' }).status(501)
                            }else{
                                res.json({ success: '[+] Success delete class' }).status(200)
                            }
                        })
                    }
                })
            }else{
                res.json({ error: '[!] You are not authorized' }).status(501)
            }
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

route.post('/major/get', (req,res) => {
    modelMajor.find({}, (err, major) => {
        if(err){
            res.json({ error: '[!] Something wrong in server' }).status(501)
        }else{
            res.json({ major: major }).status(200)
        }
    })
})

route.post('/major/search', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(err || users.length == 0){
                    res.json({ error: '[!] Users not found' }).status(501)
                }else{
                    modelMajor.find({ major: { $regex: req.body.major } }, (err, majors) => {
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

route.post('/major/add', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(token.level == 'admin'){
                modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        modelMajor.find({ major: req.body.major }, (err, majors) => {
                            if(err){
                                res.json({ error: '[!] Something wrong in server' }).status(501)
                            }else{
                                if(majors.length == 0){
                                    modelMajor.insertMany({ 
                                        major: req.body.major,
                                        desc: req.body.desc,
                                    }, (err, majors) => {
                                        if(err){
                                            res.json({ error: '[!] Something wrong in server' }).status(501)
                                        }else{
                                            res.json({ success: '[+] Success add major' }).status(200)
                                        }
                                    })
                                }else{
                                    res.json({ error: '[!] Major already exist' }).status(501)
                                }
                            }
                        })
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username, level: 'developer' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        modelMajor.find({ major: req.body.major }, (err, majors) => {
                            if(err){
                                res.json({ error: '[!] Something wrong in server' }).status(501)
                            }else{
                                if(majors.length == 0){
                                    modelMajor.insertMany({ 
                                        major: req.body.major,
                                        desc: req.body.desc,
                                    }, (err, majors) => {
                                        if(err){
                                            res.json({ error: '[!] Something wrong in server' }).status(501)
                                        }else{
                                            res.json({ success: '[+] Success add major' }).status(200)
                                        }
                                    })
                                }else{
                                    res.json({ error: '[!] Major already exist' }).status(501)
                                }
                            }
                        })
                    }
                })
            }else{
                res.json({ error: '[!] You are not authorized' }).status(501)
            }
        }
    })
})

route.post('/major/update', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(token.level == 'admin'){
                modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        modelMajor.find({ major: req.body.major }, (err, majors) => {
                            if(err){
                                res.json({ error: '[!] Something wrong in server' }).status(501)
                            }else{
                                if(majors.length == 0){
                                    res.json({ error: '[!] Major does not exist' }).status(501)
                                }else{
                                    modelMajor.updateOne({ major: req.body.major }, {
                                        major: req.body.new_major,
                                        desc: req.body.new_desc,
                                    }, (err, majors) => {
                                        if(err){
                                            res.json({ error: '[!] Something wrong in server' }).status(501)
                                        }else{
                                            res.json({ success: '[+] Success update major' }).status(200)
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
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        modelMajor.find({ major: req.body.major }, (err, majors) => {
                            if(err){
                                res.json({ error: '[!] Something wrong in server' }).status(501)
                            }else{
                                if(majors.length == 0){
                                    res.json({ error: '[!] Major does not exist' }).status(501)
                                }else{
                                    modelMajor.updateOne({ major: req.body.major }, {
                                        major: req.body.new_major,
                                        desc: req.body.new_desc,
                                    }, (err, majors) => {
                                        if(err){
                                            res.json({ error: '[!] Something wrong in server' }).status(501)
                                        }else{
                                            res.json({ success: '[+] Success update major' }).status(200)
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }else{
                res.json({ error: '[!] You are not authorized' }).status(501)
            }
        }
    })
})

route.post('/major/delete', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(token.level == 'admin'){
                modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        modelMajor.deleteOne({ major: req.body.major }, (err, majors) => {
                            if(err){
                                res.json({ error: '[!] Something wrong in server' }).status(501)
                            }else{
                                res.json({ success: '[+] Success delete major' }).status(200)
                            }
                        })
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username, level: 'developer' }, (err, users) => {
                    if(err || users.length == 0){
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        modelMajor.deleteOne({ major: req.body.major }, (err, majors) => {
                            if(err){
                                res.json({ error: '[!] Something wrong in server' }).status(501)
                            }else{
                                res.json({ success: '[+] Success delete major' }).status(200)
                            }
                        })
                    }
                })
            }else{
                res.json({ error: '[!] You are not authorized' }).status(501)
            }
        }
    })
})

module.exports = route;
