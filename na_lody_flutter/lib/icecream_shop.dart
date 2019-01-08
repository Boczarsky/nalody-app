class IcecreamShop {

  int id;
  String name;
  Address address;
  String logoUrl;
  String additionalInfo;
  List<dynamic> flavours;
  double distance;

  IcecreamShop({
    this.id,
    this.name,
    this.address,
    this.logoUrl,
    this.additionalInfo,
    this.flavours
  });

  factory IcecreamShop.fromJSON(Map<String, dynamic> parsedJSON) {
    return IcecreamShop(
      id: int.parse(parsedJSON["id"]),
      name: parsedJSON["name"],
      address: Address.fromJSON(parsedJSON["address"]),
      logoUrl: parsedJSON["logoUrl"],
      additionalInfo: parsedJSON["additionalInfo"],
      flavours: parsedJSON["flavours"]
    );
  }
}

class Address {
  String street;
  String city;
  double latitude;
  double longitude;

  Address({
    this.street,
    this.city,
    this.latitude,
    this.longitude
  });

  factory Address.fromJSON (Map<String,dynamic> parsedJSON) {
    return Address(
      street: parsedJSON["street"],
      city: parsedJSON["city"],
      latitude: double.parse(parsedJSON["latitude"]),
      longitude: double.parse(parsedJSON["longitude"])
    );
  }

  @override
  String toString() {
    return '${street}, ${city}';
  }
}