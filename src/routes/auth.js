const express = require('express')
const route = express.Router()
const modelUsers = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

route.post('/login', (req,res) => {
    modelUsers.find({ username: req.body.username }, (err, check) => {
        if(err){
            res.json({ error: '[!] Username or password is wrong' }).status(401)
        }else{
            try{
                bcrypt.compare(req.body.password, check[0].password, (err, pw) => {
                    if(err){
                        res.json({ error: '[!] Username or password is wrong' }).status(401)
                    }else{
                        const Token = jwt.sign({
                            name: check[0].name,
                            class: check[0].class,
                            level: check[0].level,
                            username: check[0].username,
                            major: check[0].major,
                        }, 'dontbeafool')
    
                        res.header({ token: Token, level: check[0].level })
                        res.json({ success: 'Successfully login' })
                    }
                })
            }catch(err){
                res.json({ error: '[!] Username or password is wrong' }).status(401)
            }
        }
    })
})

route.post('/register', (req,res) => {
    modelUsers.findOne({ username: req.body.username }, (err, users) => {
        if(users != null){
            res.json({ error: '[!] Users already registered' }).status(301)
        }else{
            modelUsers.insertMany({ 
                name: req.body.name,
                class: req.body.class,
                major: req.body.major,
                username: req.body.username,
                password: req.body.password,
                gender: req.body.gender,
                level: req.body.level
            }, (err, done) => {
                if(err){
                    res.json({ error: '[!] Something wrong in server' }).status(501)
                }else{
                    res.json({ success: 'Successfully registered' })
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
            modelUsers.findOne({ username: token.username }, (err, done) => {
                if(err){
                    res.json({ error: '[!] Something on server' }).status(501)
                }else{
                    res.json(done)
                }
            })
        }
    })
})


module.exports = route
