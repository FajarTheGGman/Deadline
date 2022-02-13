const express = require('express');
const route = express.Router();
const modelNotif = require('../models/Notification');
const modelUsers = require('../models/User');

route.post('/getall', (req,res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error '[!] Wrong Authorization' }).status(301);
        }else{
            modelUsers.find({ username: token.username }, (err, users) => {
                if(users.length == 0){
                    res.json({ error: '[!] User not found' }).status(301);
                }else{
                    modelNotif.find({ username: token.username }, (err, notifs) => {
                        if(notifs.length == 0){
                            res.json({ error: '[!] No notification found' }).status(301);
                        }else{
                            res.json({ notif: notifs }).status(200);
                        }
                    });
                }
            })
        }
    })
})

module.exports = route
