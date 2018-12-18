import 'package:flutter/material.dart';
import 'package:na_lody_flutter/ics_service.dart';
import 'package:na_lody_flutter/ics_details.dart';
import 'package:na_lody_flutter/icecream_shop.dart';

class ICSCitySearch extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _CitySearchState();
  }
}

class _CitySearchState extends State {

  List<IcecreamShop> icecreamShops;
  @override
  void initState() {
    super.initState();
    icecreamShops = [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Szukaj w mieście'),
      ),
      body: Column(
        children: <Widget>[
          TextField(
            textInputAction: TextInputAction.search,
            onSubmitted: (city) {
              setState(() async {
                icecreamShops = await IcecreamShopsService().citySearch(city);
              });
            },
          ),
          Container(
            height: MediaQuery.of(context).size.height-123,
            child: ListView(
                children: icecreamShops.map((icecreamShop){
                  return ListTile(
                    title: Text(icecreamShop.name),
                    subtitle: Text(icecreamShop.address.street),
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => ICSDetails(icecreamShop)
                          )
                      );
                    },
                  );
                }).toList()
            )
          )
        ],
      )
    );
  }
}