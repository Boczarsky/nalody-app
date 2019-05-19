const user = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const saltRounds = 10;

class UsersController {
    constructor() {}

    async login(request, response) {
        user.findOne({username: request.body.username}, (err, existingUser) => {
            if(err) {
                response.status(500).send({message: err});
            }else if(existingUser) {
                if(bcrypt.compareSync(request.body.password, existingUser.password)) {
                    jwt.sign({
                        id: existingUser._id,
                        username: existingUser.username
                    }, secret, { expiresIn: '24h' },
                    (err, encoded) => {
                        if(err) {
                            response.status(500).send({message: 'Error while encoding'});
                        } else {
                            response.send({'access-token': encoded, username: user.username});
                        }
                    })
                } else {
                    response.sendStatus(401);
                }
            } else {
                response.sendStatus(401);
            }
        })
    }

    async register(request, response) {
        user.findOne( {username: request.body.username}, async (err, existingUser) => {
            if(err) {
                response.status(500).send({message: err});
            } else if(!existingUser) {
                try {
                    await user.create({
                        _id: new mongoose.Types.ObjectId(),
                        username: request.body.username,
                        password: bcrypt.hashSync(request.body.password, saltRounds)
                    });
                    response.sendStatus(204);
                } catch( error ) {
                    response.status(500).send({message: error});
                }
            } else {
                response.status(403).send({message: 'User already exist!'});
            }
        });
    }

    getUser(request, response) {
        response.send(request.userData);
    }
    
}

module.exports = new UsersController();