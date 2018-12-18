import 'package:flutter/material.dart';
import 'package:na_lody_flutter/ics_service.dart';
import 'package:na_lody_flutter/icecream_shop.dart';
import 'package:na_lody_flutter/ics_details.dart';

class ICSFavoritesList extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _FavoritesListState();
  }
}

class _FavoritesListState extends State {

  List<IcecreamShop> icecreamShops = [];

  @override
  void initState() {
    super.initState();
    IcecreamShopsService().getFavorites().then((favorites){
      setState(() {
        icecreamShops = favorites;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Ulubione lodziarnie'),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await IcecreamShopsService().getFavorites().then((favorites){
            setState(() {
            icecreamShops = favorites;
            });
          });
          },
        child: ListView(
          children: icecreamShops.map((icecreamShop){
            return ListTile(
              title: Text(icecreamShop.name),
              subtitle: Text('${icecreamShop.address}'),
              onTap: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => ICSDetails(icecreamShop)
                    )
                );
              },
            );
          }).toList(),
        )
      )
    );
  }
}