const icecreamshop = require('../models/icecreamshop');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');

class IcecreamShopsController {

    getAll(request, response) {
        const {city, name} = request.query;
        if(name) {
            icecreamshop.find({ "name": {"$regex": name} }, '_id name address.city address.street', (err, docs) => {
                if(err) {
                    response.status(500).send(err);
                } else {
                    response.send(docs);
                }
            })
        }
        else if(city) {
            icecreamshop.find({ "address.city": city }, '_id name address.city address.street', (err, docs) => {
                if(err) {
                    response.status(500).send(err);
                } else {
                    response.send(docs);
                }
            })
        } else {
            icecreamshop.find({}, '_id name address.city address.street', (err, docs) => {
                if(err) {
                    response.status(500).send(err);
                } else {
                    response.send(docs);
                }
            })
        }
    }

    getOwned(request, response) {
        icecreamshop.find({ owner: request.userData.username }, '_id name address.city address.street', (err, docs) => {
            if(err) {
                response.status(500).send(err);
            } else {
                response.send(docs);
            }
        })
    }

    getReport(request, response) {
        icecreamshop.find({ owner: request.userData.username }, 'name description imageUrl address.city address.street flavours', (err, docs) => {
            if(err) {
                response.status(500).send(err);
            } else {
                if (docs.length === 0) {
                    response.sendStatus(204)
                } else {
                    const pdf = new PDFDocument;
                    pdf.pipe(response);
                    pdf.font('fonts/Roboto-Medium.ttf');
                    docs.forEach( (icecreamshop) => {
                        pdf.text('Nazwa: ' + icecreamshop.name);
                        pdf.moveDown();
                        pdf.text('Opis: ' + icecreamshop.description);
                        pdf.moveDown();
                        pdf.text('Address: ' + icecreamshop.address.city + ', ' + icecreamshop.address.street);
                        pdf.moveDown();
                        const reducedFlavours = icecreamshop.flavours.reduce( (prev, curr) => prev + ', ' + curr );
                        pdf.text('Dostępne smaki: ' + reducedFlavours);
                        pdf.moveDown();
                    })
                    pdf.end();
                }
            }
        })
    }

    getFavorite(request, response) {
        const favorites = request.body;
        icecreamshop.find({ "_id": {$in: favorites} }, '_id name', (err, docs) => {
            if(err) {
                response.status(500).send(err);
            } else {
                response.send(docs);
            }
        })
    }

    add(request, response) {
        if(validateData(request.body)) {
        const { name, description, imageUrl, address, flavours } = request.body;
        icecreamshop.create({
            _id: new mongoose.Types.ObjectId(),
            owner: request.userData.username,
            name: name,
            description: description,
            imageUrl: imageUrl,
            address: address,
            flavours: flavours
        }).then((result) => response.send(result))
        } else {
            response.status(400).send( {message: 'Data not valid'} );
        }
    }

    getById(request, response) {
        const id = request.params.id;
        icecreamshop.findById(id, (err, doc) => {
            if(err) {
                response.status(500).send(err);
            } else {
                response.send(doc);
            }
        })
    }

    async update(request, response) {
        try {
            const isOwner = await checkIfOwner(request);
            if(isOwner) {
                if(validateData(request.body)) {
                    const id = request.params.id;
                    const { name, description, imageUrl, address, flavours } = request.body;
                    icecreamshop.findByIdAndUpdate(id, { name, description, imageUrl, address, flavours }, (err, doc) => {
                        if(err) {
                            response.status(500).send(err);
                        } else {
                            response.sendStatus(204);
                        }
                    })
                } else {
                    response.sendStatus(400);
                }
            } else {
                response.sendStatus(401);
            }
        } catch (err) {
            response.status(500).send(err);
        }
    }

    async remove(request, response) {
        try {
            const isOwner = await checkIfOwner(request);
            if(isOwner) {
                const id = request.params.id;
                icecreamshop.findByIdAndDelete(id, (err, doc) => {
                    if(err) {
                        response.status(500).send(err);
                    } else if(doc) {
                        response.sendStatus(204);
                    } else {
                        response.sendStatus(404);
                    }
                })
            } else {
                response.sendStatus(401);
            }
        } catch (err) {
            response.status(500).send(err);
        }
    }
}

function validateData(data) {
    const { name, address, flavours } = data;
    if ( name && name.trim() &&
        validateAddress(address) &&
        typeof flavours === 'object' ) {
            return true;
    }
    return false;
}

function validateAddress(address) {
    const { city, street, latitude, longitude } = address;
    if ( city && city.trim() &&
        street && street.trim() &&
        typeof latitude === 'number' &&
        typeof longitude === 'number' ) {
            return true;
    } else {
        return false
    }
}

async function checkIfOwner( request ) {
    return new Promise( (resolve, reject) => {
        icecreamshop.findById(request.params.id, (err, res) => {
            if(err) {
                reject(err);
            } else if (res && res.owner == request.userData.username) {
                resolve(true);
            } else {
                resolve(false)
            }
        })
    });
}

module.exports = new IcecreamShopsController();