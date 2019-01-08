import 'package:na_lody_flutter/icecream_shop.dart';
import 'package:location/location.dart';
import 'package:http/http.dart' as http;
import 'package:latlong/latlong.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert' as JSON;

class IcecreamShopsService {

  static final IcecreamShopsService _icecreamShopsService = new IcecreamShopsService._internal();

  factory IcecreamShopsService() {
    return _icecreamShopsService;
  }

  IcecreamShopsService._internal();

  final location = new Location();

  Future<List<IcecreamShop>> fetchAllIcecreamShops() async {
    final data = await http.get('http://192.168.137.1:3000/all');
    Map<String, dynamic> response = JSON.jsonDecode(data.body);
    List<dynamic> responseData = response["data"];
    return responseData.map((item){
      return IcecreamShop.fromJSON(item);
    }).toList();
  }

  Future<List<IcecreamShop>> scanArea() async {
    List<IcecreamShop> icecreamShops = await fetchAllIcecreamShops();
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final permision = await location.hasPermission();
    if(permision) {
      final currentLocation = await location.getLocation();
      return icecreamShops.where((icecreamShop){
        final distance = new Distance();
        icecreamShop.distance = distance(
            new LatLng(icecreamShop.address.latitude, icecreamShop.address.longitude),
            new LatLng(currentLocation['latitude'], currentLocation['longitude']))/1000;
        if(icecreamShop.distance<prefs.getInt('radious')) {
          return true;
        }
        return false;
      }).toList();
    }
    return [];
  }

  Future<List<IcecreamShop>> citySearch(String city) async {
    List<IcecreamShop>icecreamShops = await fetchAllIcecreamShops();
    return icecreamShops.where((icecreamShop) {
      if(icecreamShop.address.city.toLowerCase().contains(city.toLowerCase())){
        return true;
      }
      return false;
    }).toList();
  }

  Future<List<IcecreamShop>> getFavorites() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String> favorites = prefs.getStringList('favorites');
    List<IcecreamShop> icecreamShops = await fetchAllIcecreamShops();
    return icecreamShops.where((icecreamShop){
      return favorites.any((id){
        if(icecreamShop.id == int.parse(id)) {
          return true;
        }
        return false;
      });
    }).toList();
  }

}