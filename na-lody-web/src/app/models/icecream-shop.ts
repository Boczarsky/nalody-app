import { Address } from './address';

export class IcecreamShop {
    id: Number;
    name: String;
    logoUrl: String;
    additionalInfo: String;
    address: Address;
    flavours: String[];

    constructor(data: IcecreamShop) {
        this.id = data.id;
        this.name = data.name;
        this.logoUrl = data.logoUrl;
        this.additionalInfo = data.additionalInfo;
        this.address = new Address(data.address);
        this.flavours = data.flavours;
    }
}
