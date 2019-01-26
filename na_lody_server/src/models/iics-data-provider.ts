import { IcecreamShop } from "./icecreamshop";

export interface IICSDataProvider {
    getAll(): Promise<IcecreamShop[]>;
    getById(icsId: number): Promise<IcecreamShop>;
    getByCity(city: string): Promise<IcecreamShop[]>;
    getByName(name: string): Promise<IcecreamShop[]>;
    getWithinRange(lat: number, lng: number, rad: number): Promise<IcecreamShop[]>;
    getFlavours(icsId: number): Promise<string[]>;
    getFavorites(favorites: number[]): Promise<IcecreamShop[]>;
    add(data: IcecreamShop): Promise<boolean>;
    update(data: IcecreamShop): Promise<boolean>;
    deleteIcecreamShop(icsId: number): Promise<boolean>;
    addFlavour(icsId: number, flavour: string): Promise<boolean>;
    deleteFlavour(icsId: number, flavour: string): Promise<boolean>;
}