const express = require('express');
const route = express.Router();
const modelUsers = require('../models/Users');
const modelRole = require('../models/Role');
const jwt = require('jsonwebtoken');

route.post('/getall', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0 || err){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    modelRole.find({}, (err, roles) => {
                        if(err){
                            res.json({ error: '[!] Error' }).status(301)
                        }else{
                            res.json({ roles: roles }).status(200)
                        }
                    })
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
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0 || err){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    modelRole.find({ name: { $regex: req.body.name } }, (err, roles) => {
                        if(err){
                            res.json({ error: '[!] Error' }).status(301)
                        }else{
                            res.json({ roles: roles }).status(200)
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
                if(users.length == 0 || err){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    modelRole.find({ name: req.body.name }, (err, roles) => {
                        if(roles.length > 0 || err){
                            res.json({ error: '[!] Role already exists' }).status(301)
                        }else{
                            modelRole.insertMany({
                                name: req.body.name,
                                level: req.body.level
                            }, (err, role) => {
                                if(err){
                                    res.json({ error: '[!] Error' }).status(301)
                                }else{
                                    res.json({ success: '[+] Role added' }).status(200)
                                }
                            })
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
                if(users.length == 0 || err){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    modelRole.find({ name: req.body.name }, (err, roles) => {
                        if(roles.length == 0){
                            res.json({ error: '[!] Role does not exists' }).status(301)
                        }else{
                            modelRole.updateOne({ name: req.body.name }, {
                                name: req.body.new_name,
                                level: req.body.new_level
                            }, (err, role) => {
                                if(err){
                                    res.json({ error: '[!] Error' }).status(301)
                                }else{
                                    res.json({ success: '[+] Role updated' }).status(200)
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
            modelUsers.find({ username: token.username, level: 'admin' }, (err, users) => {
                if(users.length == 0 || err){
                    res.json({ error: '[!] User not found' }).status(301)
                }else{
                    modelRole.find({ name: req.body.name }, (err, roles) => {
                        if(roles.length == 0){
                            res.json({ error: '[!] Role does not exists' }).status(301)
                        }else{
                            modelRole.deleteOne({ name: req.body.name }, (err, role) => {
                                if(err){
                                    res.json({ error: '[!] Error' }).status(301)
                                }else{
                                    res.json({ success: '[+] Role deleted' }).status(200)
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
