const guard = require('../auth');

class IcecreamShopsRouter {
    constructor() {
        this.router = require('express').Router();
        this.controller = require('../controllers/icecreamshops-controller');
        this.init();
    }

    init() {
        this.router.route('/')
            .get(this.controller.getAll)
            .post(guard, this.controller.add);
        this.router.route('/owned')
            .get(guard, this.controller.getOwned);
        this.router.route('/report')
            .get(guard, this.controller.getReport);
        this.router.route('/favorite')
            .post(this.controller.getFavorite);
        this.router.route('/:id')
            .get(this.controller.getById)
            .put(guard, this.controller.update)
            .delete(guard, this.controller.remove);
    }
}

module.exports = new IcecreamShopsRouter().router;