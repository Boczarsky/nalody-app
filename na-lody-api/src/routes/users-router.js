const guard = require('../auth');

class UsersRouter {
    constructor() {
        this.router = require('express').Router();
        this.controller = require('../controllers/users-controller');
        this.init();
    }

    init() {
        this.router.route('/login').post(this.controller.login);
        this.router.route('/register').post(this.controller.register);
        this.router.route('/me').get(guard, this.controller.getUser);
    }
}

module.exports = new UsersRouter().router;