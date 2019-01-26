import { IICSDataProvider } from "../models/iics-data-provider";
import { IcecreamShop } from "../models/icecreamshop";
import * as fs from 'fs';

interface DataFile {
    nextId: number;
    icecreamshops: IcecreamShop[];
}

export class FileICSDataProvider implements IICSDataProvider {

    constructor(private dataFilePath: string) {}

    loadDataFromFile(): DataFile {
        const data = fs.readFileSync(this.dataFilePath);
        return JSON.parse(data.toString());
    }

    saveDataToFile(data: DataFile) {
        fs.writeFileSync(this.dataFilePath, JSON.stringify(data))
    }

    private countDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
        var earthRadiusKm = 6371;

        const dLat = this.degreesToRadians(lat2-lat1);
        const dLng = this.degreesToRadians(lng2-lng1);

        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return earthRadiusKm * c;
    }

    private degreesToRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }


    getAll(): Promise<IcecreamShop[]> {
        return new Promise((resolve, reject) => {
            const data = this.loadDataFromFile().icecreamshops;
            resolve(data);
        });

    }
    getById(icsId: number): Promise<IcecreamShop> {
        return new Promise((resolve, reject) => {
            const data = this.loadDataFromFile().icecreamshops
                .find((icecreamshop) => icecreamshop.id === icsId);
            resolve(data);
        });
    }
    getByCity(city: string): Promise<IcecreamShop[]> {
        return new Promise((resolve, reject) => {
            const data = this.loadDataFromFile().icecreamshops
                .filter((icecreamshop) => icecreamshop.address.city.toLowerCase().includes(city.toLowerCase()) );
            resolve(data);
        });
    }
    getByName(name: string): Promise<IcecreamShop[]> {
        return new Promise((resolve, reject) => {
            const data = this.loadDataFromFile().icecreamshops
                .filter((icecreamshop) => icecreamshop.name.toLowerCase().includes(name.toLowerCase()) );
            resolve(data);
        });
    }
    getWithinRange(lat: number, lng: number, rad: number): Promise<IcecreamShop[]> {
        return new Promise((resolve, reject) => {
            const data = this.loadDataFromFile().icecreamshops
                .filter((icecreamshop) => {
                    const {latitude, longitude} = icecreamshop.address;
                    return this.countDistance(latitude, longitude, lat, lng) <= rad;
                });
            resolve(data);
        });
    }
    getFlavours(icsId: number): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const data = this.loadDataFromFile().icecreamshops
                .find((icecreamshop) => icecreamshop.id === icsId);
            if(data) {
                resolve(data.flavours);
            } else {
                reject()
            }
        });
    }
    getFavorites(favorites: number[]): Promise<IcecreamShop[]> {
        return new Promise((resolve, reject) => {
            const data = this.loadDataFromFile().icecreamshops
                .filter((icecreamshop) => favorites.some((id) => icecreamshop.id === id));
            resolve(data);
        });
    }
    add(data: IcecreamShop): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if(this.checkICSData(data)) {
                const database = this.loadDataFromFile();
                database.icecreamshops.push(
                    {
                        id: database.nextId,
                        name: data.name,
                        logoUrl: data.logoUrl,
                        additionalInfo: data.additionalInfo,
                        address: data.address,
                        flavours: data.flavours
                    }
                );
                database.nextId = database.nextId + 1;
                this.saveDataToFile(database);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
    private checkICSData(data: IcecreamShop) {
        if(data.name && data.logoUrl && data.additionalInfo && data.address && data.flavours) {
            if(data.address.city && data.address.street && typeof(data.address.latitude) === 'number' && typeof(data.address.longitude) === 'number') {
                return true;
            }
        }
        return false;
    }
    update(data: IcecreamShop): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if(this.checkICSData(data)) {
                const database = this.loadDataFromFile();
                const index = database.icecreamshops.findIndex((icecreamshop) => icecreamshop.id === data.id);
                if(index === -1) {
                    resolve(false);
                } else {
                database.icecreamshops[index] = {
                        id: data.id,
                        name: data.name,
                        logoUrl: data.logoUrl,
                        additionalInfo: data.additionalInfo,
                        address: data.address,
                        flavours: data.flavours
                };
                this.saveDataToFile(database);
                resolve(true);
                }
            } else {
                resolve(false);
            }
        });
    }
    deleteIcecreamShop(icsId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const database = this.loadDataFromFile();
            const index = database.icecreamshops.findIndex((icecreamshop) => icecreamshop.id === icsId);
            if(index === -1) {
                resolve(false);
            } else {
                database.icecreamshops.splice(index, 1);
                this.saveDataToFile(database);
                resolve(true);
            }
        });
    }
    addFlavour(icsId: number, flavour: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const database = this.loadDataFromFile();
            const index = database.icecreamshops.findIndex((icecreamshop) => icecreamshop.id === icsId);
            if(index === -1) {
                resolve(false);
            } else {
                if(database.icecreamshops[index].flavours.find((item) => item === flavour)) {
                    resolve(false);
                }
                database.icecreamshops[index].flavours.push(flavour);
                this.saveDataToFile(database);
                resolve(true);
            }
        });
    }
    deleteFlavour(icsId: number, flavour: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const database = this.loadDataFromFile();
            const index = database.icecreamshops.findIndex((icecreamshop) => icecreamshop.id === icsId);
            if(index === -1) {
                resolve(false);
            } else {
                database.icecreamshops[index].flavours.findIndex((item) => item === flavour);
                this.saveDataToFile(database);
                resolve(true);
            }
        });
    }


}