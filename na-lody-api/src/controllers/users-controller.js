const user = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const saltRounds = 10;

class UsersController {
    constructor() {}

    async login(request, response) {
        const existingUser = await user.findOne( { username: request.body.username } );
        if(existingUser) {
            if(bcrypt.compareSync(request.password, existingUser.password)) {
                jwt.sign({
                    id: existingUser._id,
                    username: existingUser.username
                }, secret, { expiresIn: '24h' },
                (err, encoded) => {
                    if(err) {
                        response.status(500).send({message: 'Error while encoding'});
                    } else {
                        response.send({token: encoded, username: existingUser.username});
                    }
                })
            } else {
                response.sendStatus(401);
            }
        } else {
            response.sendStatus(401);
        }
        
    }

    async register(request, response) {
        const existingUser = await user.find( {username: request.body.username} );
        if(existingUser.length === 0) {
            try {
                await user.create({
                    _id: new mongoose.Types.ObjectId(),
                    username: request.body.username,
                    password: bcrypt.hashSync(request.body.password, saltRounds)
                });
                response.sendStatus(201);
            } catch( error ) {
                response.sendStatus(500);
            }
        } else {
            response.status(400).send({message: 'that user already exists'});
        }
    }

    getUser(request, response) {
        response.send(request.userData);
    }
    
}

module.exports = new UsersController();