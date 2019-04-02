export interface IcecreamShop {
    name: string;
    description: string;
    imageUrl: string;
    address: {
        city: string,
        street: string,
        latitude: number;
        longitude: number;
    };
    flavours: Array<string>;
}
