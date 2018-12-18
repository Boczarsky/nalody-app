import 'package:flutter/material.dart';
import 'package:na_lody_flutter/icecream_shop.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ICSDetails extends StatefulWidget {

  final IcecreamShop icecreamShop;

  ICSDetails(this.icecreamShop);

  @override
  State<StatefulWidget> createState() {
    return _ICSDetailsState(icecreamShop);
  }
}

class _ICSDetailsState extends State {

  final IcecreamShop icecreamShop;
  String favoriteStatus = 'Dodaj do ulubionych';

  _ICSDetailsState(this.icecreamShop);

  @override
  void initState() {
    super.initState();
    getFavoriteStatus().then((status){
      setState(() {
        favoriteStatus = status;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(icecreamShop.name),
      ),
      body: ListView(
        children: <Widget>[
          Image.network(icecreamShop.logoUrl),
          RaisedButton(
              onPressed: toggleFavorites,
              child: Text(favoriteStatus)
          ),
          Container(
            margin: EdgeInsets.all(10.0),
            child: Text(icecreamShop.additionalInfo),
          ),
          Column(
            children: [
              Container(
                margin: EdgeInsets.only(left: 10.0),
                alignment: Alignment.centerLeft,
                child: Text('Dostępne smaki:')
              ),
              Card(
                child: Column(
                    children: icecreamShop.flavours.map( (flavour){
                      return ListTile(
                        title: Text(flavour),
                      );
                    }).toList()
                )
              )
            ]
          ),
          Row(
            children: <Widget>[
              Container(
                child: Text('Adres:'),
                margin: EdgeInsets.only(right: 5.0, left: 10.0, top: 10.0, bottom: 10.0),
              ),
              Text(icecreamShop.address.toString()),
            ],
          ),
          RaisedButton(
              onPressed: showOnMap,
              child: Text('Zobacz na mapie'))
        ]
      )
    );
  }
  showOnMap() async {
    var address = icecreamShop.address.toString().replaceAll(' ', '+');
    var url = 'https://www.google.com/maps/search/$address';
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  void toggleFavorites() async{
    if(await isFavorite()){
      SharedPreferences prefs = await SharedPreferences.getInstance();
      List<String> favorites = prefs.getStringList('favorites');
      favorites.remove(icecreamShop.id.toString());
      prefs.setStringList('favorites', favorites);
      setState(() {
        favoriteStatus = 'Dodaj do ulubionych';
      });
    } else {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      List<String> favorites = prefs.getStringList('favorites');
      favorites.add('${icecreamShop.id}');
      prefs.setStringList('favorites', favorites);
      setState(() {
        favoriteStatus = 'Usuń z ulubionych';
      });
    }
  }

  Future<String> getFavoriteStatus() async{
    if(await isFavorite()){
        return 'Usuń z ulubionych';
    }
    return 'Dodaj do ulubionych';
  }

  Future<bool> isFavorite() async{
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String> favorites = prefs.getStringList('favorites');
    return favorites.any((id){
      if(int.parse(id) == icecreamShop.id) {
        return true;
      }
      return false;
    });
  }

}