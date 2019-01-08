const express = require('express');
const bodyParser = require('body-parser');

const iceCreamShops = require('./icecreamshops');

const app = express();

const port = 3000

app.use(bodyParser.json());

app.use('/icecreamshops', iceCreamShops);

app.listen(port);