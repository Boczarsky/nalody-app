class IcecreamShop {

  int id;
  String name;
  Address address;
  String logoUrl;
  String additionalInfo;
  List<String> flavours;
  double distance;

  IcecreamShop(
      this.id,
      this.name,
      this.address,
      this.logoUrl,
      this.additionalInfo,
      this.flavours
  );
}

class Address {
  String street;
  String city;
  double latitude;
  double longitude;

  Address(
      this.street,
      this.city,
      this.latitude,
      this.longitude
  );

  @override
  String toString() {
    return '${street}, ${city}';
  }
}