const jwt = require('jsonwebtoken');
const config = require('./config');

function guard(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if(typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, config.secret, (err, decoded) => {
            if(err) {
                res.status(401).send(err);
            } else {
                req.userData = {id: decoded.id, username: decoded.username}
                next();
            }
        });
    } else {
        res.status(400).send({message: 'Bearer token is required.'})
    }
}

module.exports = guard;