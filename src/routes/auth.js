// Copyright 2022 By Fajar Firdaus

const express = require('express')
const route = express.Router()
const modelUsers = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

route.post('/login', (req,res) => {
    modelUsers.find({ username: req.body.username }, (err, check) => {
        if(err){
            res.json({ error: '[!] Username or password is wrong' }).status(401)
        }
            try{
                bcrypt.compare(req.body.password, check[0].password, (err, pw) => {
                    if(!pw){
                        res.json({ error: '[!] Username or password is wrong' }).status(401)
                    }else{
                        const Token = jwt.sign({
                            name: check[0].name,
                            class: check[0].class,
                            level: check[0].level,
                            username: check[0].username,
                            major: check[0].major,
                            gender: check[0].gender,
                            picture: check[0].picture
                        }, 'dontbeafool')
    
                        res.header({ token: Token, level: check[0].level })
                        res.json({ success: 'Successfully login' })
                    }
                })
            }catch(e){
                res.json({ error: '[!] Username or password is wrong' }).status(401)
            }
    })
})

route.post('/register', (req,res) => {
    modelUsers.findOne({ username: req.body.username }, (err, users) => {
        if(users != null){
            res.json({ error: '[!] Users already registered' }).status(301)
        }else{
            bcrypt.hash(req.body.password, 10, (err, pw) => {
                if(err){
                    res.json({ error: '[!] Something Wrong in server' }).status(501)
                }

                modelUsers.insertMany({ 
                    name: req.body.name,
                    class: req.body.class,
                    major: req.body.major,
                    username: req.body.username,
                    password: pw,
                    gender: req.body.gender,
                    level: req.body.level,
                }, (err, done) => {
                    if(err){
                        res.json({ error: '[!] Something wrong in server' }).status(501)
                    }else{
                        res.json({ success: 'Successfully registered' })
                    }
                })
            })
        }
    })
})

route.post('/picture', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Token is invalid' }).status(401)
        }else{
            modelUsers.findOne({ username: token.username }, (err, users) => {
                if(err){
                    res.json({ error: '[!] Something wrong in server' }).status(501)
                }else{
                    req.files.picture.mv(`./public/images/${users.username}.jpg`, (err) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(501)
                        }else{
                            res.json({ success: 'Successfully upload picture' })
                        }
                    })
                }
            })
        }
    })
})

route.post('/get', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Token is invalid' }).status(401)
        }else{
            modelUsers.findOne({ username: token.username }, (err, users) => {
                if(err){
                    res.json({ error: '[!] Something wrong in server' }).status(501)
                }else{
                    modelUsers.find({ name: { $regex: req.body.name }, level: 'students' }, (err, done) => {
                        res.json({ data: done })
                    })
                }
            })
        }
    })
})

route.post('/fullname', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Something wrong in server' }).status(501)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelUsers.updateOne({ username: token.username }, { $set: { name: req.body.name } }, (err, done) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(501)
                        }else{
                            res.json({ success: 'Successfully updated' })
                        }
                    })
                }
            })
        }
    })
})

route.post('/forgot', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    bcrypt.compare(req.body.old_password, users[0].password, (err, pw) => {
                        if(!pw){
                            res.json({ error: '[!] Wrong old password' }).status(301)
                        }else{
                            bcrypt.hash(req.body.new_password, 10, (err, pw) => {
                                if(err){
                                    res.json({ error: '[!] Something wrong in server' }).status(501)
                                }

                                modelUsers.updateOne({ username: token.username }, { $set: { password: pw } }, (err, done) => {
                                    if(err){
                                        res.json({ error: '[!] Something wrong in server' }).status(501)
                                    }else{
                                        res.json({ success: 'Successfully change password' })
                                    }
                                })
                            })
                        }
                    })
                }
            })
        }
    })
})

route.post('/profile', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(req.query.users == 'true'){
                modelUsers.findOne({ username: req.body.users }, (err, done) => {
                    if(err){
                        res.json({ error: '[!] Something on server' }).status(501)
                    }else{
                        res.json(done)
                    }
                })
            }else{
                modelUsers.findOne({ username: token.username }, (err, done) => {
                    if(err){
                        res.json({ error: '[!] Something on server' }).status(501)
                    }else{
                        res.json(done)
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
                    if(users.length == 0){
                        res.json({ error: '[!] You are not admin' }).status(301)
                    }else{
                        modelUsers.deleteOne({ username: req.body.username }, (err, done) => {
                            if(err){
                                res.json({ error: '[!] Something on server' }).status(501)
                            }else{
                                res.json({ success: 'Successfully deleted' })
                            }
                        })
                    }
                })
            }else if(token.level == 'developer'){
                modelUsers.find({ username: token.username, level: 'developer' }, (err, users) => {
                    if(users.length == 0){
                        res.json({ error: '[!] You are not admin' }).status(301)
                    }else{
                        modelUsers.deleteOne({ username: req.body.username }, (err, done) => {
                            if(err){
                                res.json({ error: '[!] Something on server' }).status(501)
                            }else{
                                res.json({ success: 'Successfully deleted' })
                            }
                        })
                    }
                })
            }
        }
    })
})

route.post('/getall/admin', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(token.level == 'admin' || token.level == 'developer'){
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0){
                        res.json({ error: '[!] Users not found' }).status(501)
                    }else{
                        if(req.query.admin == 'true'){
                            modelUsers.find({ level: 'admin' }, (err, all) => {
                                if(err){
                                    res.json({ error: '[!] Something on server' }).status(501)
                                }else{
                                    res.json({ users: all })
                                }
                            })
                        }else if(req.query.developer == 'true'){
                            modelUsers.find({ level: 'developer' }, (err, all) => {
                                if(err){
                                    res.json({ error: '[!] Something on server' }).status(501)
                                }else{
                                    res.json({ users: all })
                                }
                            })
                        }else if(req.query.teacher == 'true'){
                            modelUsers.find({ level: 'teacher' }, (err, all) => {
                                if(err){
                                    res.json({ error: '[!] Something on server' }).status(501)
                                }else{
                                    res.json({ users: all })
                                }
                            })
                        }
                    }
                })
            }else{
                res.json({ error: '[!] You are not admin' }).status(301)
            }
        }
    })
})

route.post('/search/admin', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            if(req.query.level == 'admin'){
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0){
                        res.json({ error: '[!] Users not found' }).status(501)
                    }else{
                        modelUsers.find({ name: { $regex: req.body.name }, level: 'admin' }, (err, all) => {
                            if(err){
                                console.log(err)
                            }else{
                                res.json({ users: all })
                            }
                        })
                    }
                })
            }else if(req.query.level == 'developer'){
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0){
                        res.json({ error: '[!] Users not found' }).status(501)
                    }else{
                        modelUsers.find({ name: { $regex: req.body.name }, level: 'admin' }, (err, all) => {
                            if(err){
                                res.json({ error: '[!] Something on server' }).status(501)
                            }else{
                                res.json({ users: all })
                            }
                        })
                    }
                })
            }else if(req.query.level == 'teacher'){
                modelUsers.find({ username: token.username }, (err, users) => {
                    if(users.length == 0){
                        res.json({ error: '[!] Users not found' }).status(501)
                    }else{
                        modelUsers.find({ name: { $regex: req.body.name }, level: 'admin' }, (err, all) => {
                            if(err){
                                res.json({ error: '[!] Something on server' }).status(501)
                            }else{
                                res.json({ users: all })
                            }
                        })
                    }
                })
            }
        }
    })
})


module.exports = route
