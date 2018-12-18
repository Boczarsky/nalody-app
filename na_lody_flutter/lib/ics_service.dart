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
  final List<IcecreamShop> icecreamShops = [
  IcecreamShop(1,'Zimny Drań', new Address('Raciborska 9', 'Gliwice', 50.294420, 18.663970), 'https://img.taste.com.au/a9tkfBF7/taste/2017/02/fruity-tingle-ice-cream-cones-121035-1.jpg', 'none', ['Truskawka', 'Pistacja', 'Malina', 'Jagoda']),
  IcecreamShop(2,'Polskie Lody Rzemieślnicze', new Address('Bankowa 7', 'Gliwice', 50.293090, 18.665100), 'http://www.pamperedchef.com/iceberg/com/recipe/1287045-lg.jpg', 'none', ['Truskawka']),
  IcecreamShop(3,'Istne Lody Rzemieślnicze', new Address('Mariacka Tylna 7', 'Katowice', 50.257090, 19.025570), 'https://www.sugarhero.com/wp-content/uploads/2016/05/doughnut-ice-cream-sundae-5.jpg', 'none', ['Truskawka']),
  IcecreamShop(4,'Gelato Studio', new Address('Stanisława Dubois 2', 'Gliwice', 50.298430, 18.675190), 'https://img.taste.com.au/6CgraiFM/w720-h480-cfill-q80/taste/2017/12/roasted-peach-sour-cream-ice-cream-taste_1980x1320-133837-1.jpg', 'none', ['Truskawka']),
  IcecreamShop(5,'Lucky Lood', new Address('Dolnych Wałów 1', 'Gliwice', 50.293650, 18.668300), 'https://www.seriouseats.com/2018/06/20180625-no-churn-vanilla-ice-cream-vicky-wasik-13-1500x1125.jpg', 'none', ['Truskawka']),
  IcecreamShop(6,'Gelateria Vaneta', new Address('Jana Siemińskiego 18-20', 'Gliwice', 50.296460, 18.659930), 'https://img.taste.com.au/jiN6NCCD/taste/2016/11/no-churn-ice-cream-4-ways-100932-1.jpeg', 'none', ['Truskawka']),
  ];

//  void fetchIcecreamShops() async {
//    final data = await http.get('http://www.mocky.io/v2/5c17faec2f00005400af0e61');
//    Response response = JSON.jsonDecode(data.body);
//    print(response);
//  }

  Future<List<IcecreamShop>> scanArea() async {
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