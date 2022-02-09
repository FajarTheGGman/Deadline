const express = require('express');
const jwt = require('jsonwebtoken');
const route = express.Router();
const modelUsers = require('../models/users');
const modelAttendance = require('../models/attendance');

route.post('/getall', (req, res) => {
    jwt.verify(req.body.token, req.body.secret, (err, token) => {
        if(err){
            res.json({ error: '[!] Wrong authorization' });
        }

        modelUsers.find({ username: token.username, level: 'admin' }, (err, result) => {
            if(err){
                res.json({ error: '[!] Users no found' }).staus(301);
            }

            if(result.length > 0){
                modelAttendance.find({}, (err, result) => {
                    if(err){
                        res.json({ error: '[!] Error get all attendance' }).status(301);
                    }

                    if(result.length > 0){
                        res.json({ success: '[+] Get all attendance success', data: result });
                    }else{
                        res.json({ error: '[!] Error get all attendance' });
                    }
                });
            }else{
                res.json({ error: '[!] Error get all attendance' });
            }
        });
    })
})

module.exports = route;

