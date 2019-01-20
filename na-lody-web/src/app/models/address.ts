export class Address {
    city: String;
    street: String;
    latitude: Number;
    longitude: Number;

    constructor(data: Address) {
        this.city = data.city;
        this.street = data.street;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
    }

    toString(): String {
        return `${this.city}, ${this.street}`;
    }
}
