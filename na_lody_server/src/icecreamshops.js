const express = require('express');
const router = express.Router();
const database = require('./database');

router.route('/').get(getIcecreamShops).post(addIcecreamShop);

router.route('/:id').get(getIcecreamShopById).delete(deleteIcecreamShop);

router.route('/favorites').post(getFavorites);

router.route('/shops/all').get(getAll);

async function getIcecreamShops(req, res) {
    const params = req.query;
    if(params.lat && params.long && params.rad) {
        const data = await parseData( await database.getIcecreamShopsWithinRange(params.lat, params.long, params.rad));
        res.send(data);
    }
    else if(params.city){
        const data = await parseData( await database.getIcecreamShopsByCity(params.city) );
        res.send(data);
    } 
    else {
        res.sendStatus(403);
    }
}

async function getAll(req, res) {
        const data = await parseData( await database.getAll());
        res.send(data);
}

async function getIcecreamShopById(req, res) {
    const id = parseInt(req.params.id);
    if(id) {
        const data = await parseData( await database.getIcecreamShopById(id) );
        res.send(data);
    }
    else {
        res.sendStatus(403);
    }
}

async function getFavorites(req, res) {
    const favorites = req.body;
    const data = await parseData( await database.getFavoriteIcecreamShops(favorites) );
    res.send(data);
}

async function deleteIcecreamShop(req, res) {
    const id = req.params.id;
    res.sendStatus(await database.deleteIcecreamShop(id));
}

async function addIcecreamShop(req, res) {
    res.sendStatus(await database.addIcecreamShop(req.body));
}

async function parseData(data) {
    const arr = [];
    for(columns of data.rows) {
        const flavours = await database.getFlavours(columns[0]);
        const parsedData = {id: columns[0], name: columns[1], logoUrl: columns[2] ? columns[2] : '', additionalInfo: columns[3] ? columns[3] : '', address: {city: columns[4], street: columns[5], latitude: columns[6], longitude: columns[7]}, flavours: flavours.rows.map((column) => column[0])};
        arr.push(parsedData);
    }
    return arr;
}


module.exports = router;