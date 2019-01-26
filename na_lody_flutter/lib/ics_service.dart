import 'package:na_lody_flutter/icecream_shop.dart';
import 'package:location/location.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:latlong/latlong.dart';
import 'dart:convert' as JSON;

class IcecreamShopsService {

  static final IcecreamShopsService _icecreamShopsService = new IcecreamShopsService._internal();

  factory IcecreamShopsService() {
    return _icecreamShopsService;
  }

  IcecreamShopsService._internal();

  final location = new Location();

  Future<List<IcecreamShop>> scanArea() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final permision = await location.hasPermission();
    if(permision) {
      final currentLocation = await location.getLocation();
      final radius = prefs.getInt('radius');
      final url = 'http://192.168.137.1:3000/icecreamshops?mode=range&lat=' + currentLocation['latitude'].toString() + '&lng=' + currentLocation['longitude'].toString() + '&rad=' + radius.toString();
      final data = await http.get(url);
      final distance = new Distance();
      List<dynamic> response = JSON.jsonDecode(data.body);
      return response.map((item){
        IcecreamShop parsedData = IcecreamShop.fromJSON(item);
        parsedData.distance = distance.as(LengthUnit.Kilometer, new LatLng(parsedData.address.latitude, parsedData.address.longitude), new LatLng(currentLocation['latitude'], currentLocation['longitude']));
        return parsedData;
      }).toList();
    }
    return [];
  }

  Future<List<IcecreamShop>> citySearch(String city) async {
    final url = 'http://192.168.137.1:3000/icecreamshops?mode=city&name=' + city;
    final data = await http.get(url);
    List<dynamic> response = JSON.jsonDecode(data.body);
    return response.map((item){
      return IcecreamShop.fromJSON(item);
    }).toList();
  }

  Future<List<IcecreamShop>> getFavorites() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String> favorites = prefs.getStringList('favorites');
    final url = 'http://192.168.137.1:3000/icecreamshops/user/favorites';
    final data = await http.post(url, headers: {'Content-type': 'application/json'},
        body: JSON.jsonEncode(favorites));
    List<dynamic> response = JSON.jsonDecode(data.body);
    return response.map((item){
      return IcecreamShop.fromJSON(item);
    }).toList();
  }

}