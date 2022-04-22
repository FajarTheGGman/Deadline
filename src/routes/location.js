// Copyright 2022 By Fajar Firdaus

const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const modelUsers = require('../models/Users');
const modelLocation = require('../models/Location');

route.post('/get', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelLocation.find({}, (err, location) => {
                        if(err){
                            res.json({ error: '[!] Something wrong in server' }).status(301)
                        }else{
                            res.json({ location: location }).status(200)
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
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelLocation.find({}, (err, location) => {
                        if(location.length == 0){
                            modelLocation.insertMany({ 
                                location: req.body.location,
                                latitude: req.body.latitude,
                                longitude: req.body.longitude,
                                desc: req.body.desc
                            }, (err, location) => {
                                if(err){
                                    res.json({ error: '[!] Update location failed' }).status(301)
                                }else{
                                    res.json({ location }).status(200)
                                }
                            })
                        }else{
                            modelLocation.updateMany({ _id: req.body.id }, { $set: { 
                                location: req.body.location,
                                latitude: req.body.latitude,
                                longitude: req.body.longitude,
                                desc: req.body.desc
                            } }, (err, location) => {
                                if(err){
                                    res.json({ error: '[!] Update location failed' }).status(301)
                                }else{
                                    res.json({ location }).status(200)
                                }
                            })
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
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelLocation.find({}, (err, location) => {
                        if(location.length != 0){
                            res.json({ error: '[!] Location already exist' }).status(301)
                        }else{
                            modelLocation.insertMany({
                                location: req.body.location,
                                desc: req.body.desc,
                                latitude: req.body.latitude,
                                longitude: req.body.longitude
                            }, (err, location) => {
                                if(err){
                                    res.json({ error: '[!] Something wrong in server' }).status(301)
                                }else{
                                    res.json({ success: "[+] Successfully adding an location" }).status(200)
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
