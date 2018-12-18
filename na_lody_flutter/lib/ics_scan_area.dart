import 'package:flutter/material.dart';
import 'package:na_lody_flutter/ics_details.dart';
import 'package:na_lody_flutter/icecream_shop.dart';
import 'package:na_lody_flutter/ics_service.dart';

class ICSScanArea extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _ScanAreaState();
  }
}

class _ScanAreaState extends State {

  List<IcecreamShop> icecreamShops = [];

  @override
  void initState() {
    super.initState();
    IcecreamShopsService()
        .scanArea()
        .then( (list) {
          setState(() {
            icecreamShops = list;
          });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Szukaj w okolicy'),
        ),
        body: RefreshIndicator(
          onRefresh: () async {
            await IcecreamShopsService().scanArea().then((list){
              setState(() {
                icecreamShops = list;
              });
            });
          },
          child: ListView(
            children: icecreamShops.map((icecreamShop){
              return ListTile(
                title: Text(icecreamShop.name),
                subtitle: Text('${icecreamShop.distance} km'),
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