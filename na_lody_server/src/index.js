const express = require('express');

const app = express();

const port = 3000

app.listen(port)

app.get('/', (req, res) => res.send('NaLody API'));

const smaki = ['CZEKOLADA','ŚMIETANKA','TRUSKAWKA'];

app.get('/smaki', (req, res) => res.send(
    smaki
));