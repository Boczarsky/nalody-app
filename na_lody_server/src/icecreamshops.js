const express = require('express');
const router = express.Router();
const database = require('./database');

router.route('/').get(getIcecreamShops).post(addIcecreamShop);

router.route('/:id').get(getIcecreamShopById).delete(deleteIcecreamShop);

router.route('/favorites').get(getFavorites);

async function getIcecreamShops(req, res) {
    const params = req.query;
    const data = await database.getIcecreamShopsWithinRange(params.lat, params.long, params.rad);
    res.send(data);
}

async function getIcecreamShopById(req, res) {
    const id = req.params.id;
    const data = await database.getIcecreamShopById(id);
    res.send(data);
}

async function getFavorites(req, res) {
    const favorites = req.body.favorites;
    const data = await database.getFavoriteIcecreamShops(favorites);
    res.send(data);
}

function deleteIcecreamShop(req, res) {
    const id = req.params.id;
    res.sendStatus(500)
}

function addIcecreamShop(req, res) {
    res.sendStatus(500)
}

module.exports = router;