const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');

const nalodyapp = require('./nalodyapp');

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.use('/nalodyapp', nalodyapp);

app.listen(port);

database.init();

process
    .once('SIGTERM', database.closePoolAndExit)
    .once('SIGINT',  database.closePoolAndExit);