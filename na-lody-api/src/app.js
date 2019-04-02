const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const users = require('./routes/users-router');
const icecreamshops = require('./routes/icecreamshops-router');
const config = require('./config');

class App {
    constructor() {
        this.app = express();
        this.init();
    }

    init() {
        this.applyMiddleware();
        this.mountRoutes();
        this.connectToDatabase();
        process.once('SIGINT', () => {
            console.log('Terminating...')
            mongoose.disconnect().then(() => {
                process.exit();
            })
        });
        process.once('SIGTERM', () => {
            console.log('Terminating...')
            mongoose.disconnect().then(() => {
                process.exit();
            })
        });
    }

    async connectToDatabase() {
        try {
            await mongoose.connect(config.databaseUrl, {useNewUrlParser: true});
        } catch (err) {
            console.error(err);
        }
    }

    applyMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cors());
    }

    mountRoutes() {
        this.app.get('/api', (request, response) => {
            response.send('<h1>Server is running!<h1>');
        })
        this.app.use('/api/users', users);
        this.app.use('/api/icecreamshops', icecreamshops);
    }
}

module.exports = new App().app;