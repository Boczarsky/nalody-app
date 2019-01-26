export interface IcecreamShop {
    id: number;
    name: string;
    address: Address;
    logoUrl: string,
    additionalInfo: string,
    flavours: string[];
}

export interface Address {
    street: string;
    city: string;
    latitude: number;
    longitude: number;
}
