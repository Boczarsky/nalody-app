import { IICSDataProvider } from "../models/iics-data-provider";
import { Router, Request, Response } from "express";
const express = require('express');
export class ICSController {

    private router: Router;

    constructor(private dataProvider: IICSDataProvider) {
        this.router = express.Router();
        this.router.route('/')
            .get(this.getIcecreamShops.bind(this))
            .post(this.addIcecreamShop.bind(this));
        this.router.route('/:id')
            .get(this.getById.bind(this))
            .put(this.updateIcecreamShop.bind(this))
            .delete(this.deleteIcecreamShop.bind(this));
        this.router.route('/:id/flavours')
            .get(this.getFlavours.bind(this))
            .post(this.addFlavour.bind(this))
            .delete(this.deleteFlavour.bind(this));
        this.router.route('/user/favorites')
            .post(this.getFavorites.bind(this));
    }

    getRoutes() {
        return this.router;
    }

    async getIcecreamShops(req: Request, res: Response) {
        const mode = req.query.mode;
        switch(mode) {
            case 'all':
                try {
                    const data = await this.dataProvider.getAll();
                    res.send(data);
                } catch (err) {
                    res.status(500).send({error: err});
                }
                break;
            case 'city':
                try {
                    if(req.query.name) {
                        const data = await this.dataProvider.getByCity(req.query.name);
                        res.send(data);
                    } else {
                        res.status(403).send({error: "Wrong parameters!"});
                    }
                } catch (err) {
                    res.status(500).send({error: err});
                }
                break;
            case 'name':
                try {
                    if(req.query.name) {
                        const data = await this.dataProvider.getByName(req.query.name);
                        res.send(data);
                    } else {
                        res.status(403).send({error: "Wrong parameters!"});
                    }
                } catch (err) {
                    res.status(500).send({error: err});
                }
                break;
            case 'range':
                try {
                    const lat = parseFloat(req.query.lat);
                    const lng = parseFloat(req.query.lng);
                    const rad = parseInt(req.query.rad);
                    if(lat && lng && rad) {
                        const data = await this.dataProvider.getWithinRange(lat, lng, rad);
                        res.send(data);
                    } else {
                        res.status(403).send({error: "Wrong parameters!"});
                    }
                } catch (err) {
                    res.status(500).send({error: err});
                }
                break;
            default:
                res.status(403).send({error: "Wrong mode!"});
        }
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if(id) {
            try {
                const data = await this.dataProvider.getById(id);
                res.send(data);
            } catch (err) {
                res.status(500).send({error: err});
            }
        } else {
            res.status(403).send({error: "Wrong id!"});
        }
    }

    async getFlavours(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if(id) {
            try {
                const data = await this.dataProvider.getFlavours(id);
                res.send(data);
            } catch (err) {
                res .status(500).send({error: err});
            }
        } else {
            res.status(403).send({error: "Wrong id!"});
        }
    }

    async getFavorites(req: Request, res: Response) {
        const favorites = req.body;
        if(favorites) {
            try {
                const data = await this.dataProvider.getFavorites(favorites);
                res.send(data);
            } catch (err) {
                res.status(500).send({error: err});
            }
        } else {
            res.send([]);
        }
    }
    async addIcecreamShop(req: Request, res: Response) {
        const data = req.body;
        if(data) {
            try {
                const result = await this.dataProvider.add(data);
                if(result) {
                    res.sendStatus(204);
                } else {
                    res.status(403).send({error: "Create failed due to wrong data."});
                }
            } catch (err) {
                res.status(500).send({error: err});
            }
        } else {
            res.status(403).send({error: "Data not provided!"});
        }
    }
    async addFlavour(req: Request, res: Response){
        const id = parseInt(req.params.id);
        const flavour = req.query.value;
        if(id && flavour) {
            try {
                const result = await this.dataProvider.addFlavour(id, flavour);
                if(result) {
                    res.sendStatus(204);
                } else {
                    res.status(403).send({error: "Already exist!"});
                }
            } catch (err) {
                res.status(500).send({error: err});
            }
        } else {
            res.status(403).send({error: "Wrong parameters!"});
        }
    }

    async updateIcecreamShop(req: Request, res: Response) {
        const data = req.body;
        if(data) {
            try {
                const result = await this.dataProvider.update(data);
                if(result) {
                    res.sendStatus(204);
                } else {
                    res.status(403).send({error: "Update failed due to wrong data."});
                }
            } catch (err) {
                res.status(500).send({error: err});
            }
        } else {
            res.status(403).send({error: "Data not provided"});
        }
    }

    async deleteIcecreamShop(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if(id) {
            try {
                const result = await this.dataProvider.deleteIcecreamShop(id);
                if(result) {
                    res.sendStatus(204);
                } else {
                    res.status(403).send({error: "Cannot delete"});
                }
            } catch (err) {
                res.status(500).send({error: err});
            }
        } else {
            res.status(403).send({error: "Wrong id!"});
        }
    }

    async deleteFlavour(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const flavour = req.query.value;
        if(id) {
            try {
                const result = await this.dataProvider.deleteFlavour(id, flavour);
                if(result) {
                    res.sendStatus(204);
                } else {
                    res.status(403).send({error: "Cannot delete"});
                }
            } catch (err) {
                res.status(500).send({error: err});
            }
        } else {
            res.status(403).send({error: "Wrong parameters!"});
        }
    }
}