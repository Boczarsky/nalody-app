const express = require('express');
const router = express.Router();
const database = require('./database');

router.route('/icecreamshops').get(getIcecreamShops).post(addIcecreamShop);

router.route('/icecreamshops/:id').get(getIcecreamShopById).delete(deleteIcecreamShop).put(updateIcecreamshop);

router.route('/icecreamshops/:id/flavours').get(getFlavours).post(addFlavour).delete(deleteFlavour);

router.route('/favorites').post(getFavorites);

async function getIcecreamShops(req, res) {
    const params = req.query;
    if(params.lat && params.long && params.rad) {
        const data = await parseIcecreamData( await database.getIcecreamShopsWithinRange(params.lat, params.long, params.rad));
        res.send(data);
    }
    else if(params.city){
        const data = await parseIcecreamData( await database.getIcecreamShopsByCity(params.city) );
        res.send(data);
    } 
    else if(params.all){
        const data = await parseIcecreamData( await database.getAllIcecreamShops());
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
        const data = await parseIcecreamData( await database.getIcecreamShopById(id) );
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
    const data = await parseIcecreamData( await database.getFavoriteIcecreamShops(favorites) );
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

async function parseIcecreamData(data) {
    const arr = [];
    for(columns of data.rows) {
        const flavours = await database.getFlavours(columns[0]);
        const parsedData = {id: columns[0], name: columns[1], logoUrl: columns[2] ? columns[2] : '', additionalInfo: columns[3] ? columns[3] : '', address: {city: columns[4], street: columns[5], latitude: columns[6], longitude: columns[7]}, flavours: flavours.rows.map((column) => column[0])};
        arr.push(parsedData);
    }
    return arr;
}

function parseFlavoursData(data) {
    const parsedData = data.rows.map((column) => column[0]);
    return parsedData;
}

module.exports = router;