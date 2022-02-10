const express = require('express')
const route = express.Router()
const jwt = require('jsonwebtoken')
const modelUsers = require('../models/Users')
const modelEvents = require('../models/Events')

route.post('/getall', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] Users not found' })
                }else{
                    modelEvents.find({}, (err, events) => {
                        if(events.length == 0){
                            res.json({ error: '[!] Events not found' })
                        }else{
                            res.json({ events: events })
                        }
                    })
                }
            })
        }
    })
})

route.post('/search', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong Authorization' }).status(301)
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] Users not found' })
                }else{
                    modelEvents.find({ events: { $regex: req.body.events } }, (err, events) => {
                        if(events.length == 0){
                            res.json({ error: '[!] Events not found' })
                        }else{
                            res.json({ events: events })
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
                    modelEvents.find({ events: req.body.events }, (err, events) => {
                        if(events.length == 0){
                            modelEvents.insertMany({
                                events: req.body.events,
                                desc: req.body.desc,
                                date: req.body.date,
                            }, (err, events) => {
                                if(err){
                                    res.json({ error: '[!] Error while creating event' })
                                }else{
                                    res.json({ success: '[+] Event created' })
                                }
                            })
                        }else{
                            res.json({ error: '[!] Event already exists' })
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
                    res.json({ error: '[!] Users not found' }).status(301)
                }else{
                    modelEvents.find({ events: req.body.events }, (err, events) => {
                        if(events.length == 0){
                            res.json({ error: '[!] Events not found' }).status(301)
                        }else{
                            modelEvents.deleteOne({ events: req.body.events }, (err, events) => {
                                if(err){
                                    res.json({ error: '[!] Error while deleting event' }).status(501)
                                }else{
                                    res.json({ success: '[+] Event deleted' })
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
