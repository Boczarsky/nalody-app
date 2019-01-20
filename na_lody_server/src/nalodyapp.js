const express = require('express');
const router = express.Router();
const database = require('./database');

router.route('/icecreamshops').get(getIcecreamShops).post(addIcecreamShop);

router.route('/icecreamshops/:id').get(getIcecreamShopById).delete(deleteIcecreamShop).put(updateIcecreamshop).post(deleteIcecreamShop);

router.route('/icecreamshops/:id/flavours').get(getFlavours).post(addFlavour).delete(deleteFlavour);

router.route('/favorites').post(getFavorites);

async function getIcecreamShops(req, res) {
    const params = req.query;
    if(params.lat && params.long && params.rad) {
        const data = await parseIcecreamShopsData( await database.getIcecreamShopsWithinRange(params.lat, params.long, params.rad));
        res.send(data);
    }
    else if(params.city){
        const data = await parseIcecreamShopsData( await database.getIcecreamShopsByCity(params.city) );
        res.send(data);
    }
    else if(params.name) {
        const data = await parseIcecreamShopsData( await database.getIcecreamShopByName(params.name) );
        res.send(data);
    } 
    else if(params.all){
        const data = await parseIcecreamShopsData( await database.getAllIcecreamShops());
        res.send(data);
    }
    else {
        res.sendStatus(403);
    }
}

async function addIcecreamShop(req, res) {
    res.sendStatus(await database.addIcecreamShop(req.body));
}

async function getIcecreamShopById(req, res) {
    const id = parseInt(req.params.id);
    if(id) {
        const data = await parseIcecreamShopData( await database.getIcecreamShopById(id) );
        res.send(data);
    }
    else {
        res.sendStatus(403);
    }
}

async function deleteIcecreamShop(req, res) {
    const id = req.params.id;
    res.sendStatus(await database.deleteIcecreamShop(id));
}

async function updateIcecreamshop(req, res) {
    const id = parseInt(req.params.id);
    const modify = req.query.modify;
    const data = req.body;
    if(modify === 'address'){
        if(checkAddressDataValidity(data)) {
            res.sendStatus(await database.updateAddress(id, data.city, data.street, data.latitude, data.longitude));
        } else {
            res.sendStatus(403);
        }
    } else if (modify === 'icecreamshop') {
        if(checkIcecreamShopDataValidity(data)) {
            res.sendStatus(await database.updateIcecreamshop(id, data.name, data.logoUrl, data.additionalInfo))
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}

async function getFlavours(req, res) {
    const id = parseInt(req.params.id);
    res.send(parseFlavoursData(await database.getFlavours(id)));
}

async function addFlavour(req, res) {
    const id = parseInt(req.params.id);
    const flavour = req.query.flavour;
    res.sendStatus(await database.addFlavour(id, flavour));
}

async function deleteFlavour(req, res) {
    const id = parseInt(req.params.id);
    const flavour = req.query.flavour;
    res.sendStatus(await database.deleteFlavour(id, flavour));
}

async function getFavorites(req, res) {
    const favorites = req.body;
    const data = await parseIcecreamShopsData( await database.getFavoriteIcecreamShops(favorites) );
    res.send(data);
}


function checkIcecreamShopDataValidity(data) {
    const { name, logoUrl, additionalInfo } = data;
    return name && logoUrl && additionalInfo; 
}

function checkAddressDataValidity(data) {
    const {city, street, latitude, longitude} = data;
    return city && street && latitude && longitude;
}

async function parseIcecreamShopsData(data) {
    const arr = [];
    for(column of data.rows) {
        const flavours = await database.getFlavours(column[0]);
        const parsedData = {id: column[0], name: column[1], logoUrl: column[2] ? column[2] : '', additionalInfo: column[3] ? column[3] : '', address: {city: column[4], street: column[5], latitude: column[6], longitude: column[7]}, flavours: flavours.rows.map((column) => column[0])};
        arr.push(parsedData);
    }
    return arr;
}

async function parseIcecreamShopData(data) {
    column = data.rows[0];
    const flavours = await database.getFlavours(column[0]);
    return {id: column[0], name: column[1], logoUrl: column[2] ? column[2] : '', additionalInfo: column[3] ? column[3] : '', address: {city: column[4], street: column[5], latitude: column[6], longitude: column[7]}, flavours: flavours.rows.map((column) => column[0])};
}

function parseFlavoursData(data) {
    const parsedData = data.rows.map((column) => column[0]);
    return parsedData;
}

module.exports = router;