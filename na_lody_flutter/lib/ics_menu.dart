import 'package:flutter/material.dart';
import 'package:na_lody_flutter/ics_scan_area.dart';
import 'package:na_lody_flutter/ics_city_search.dart';
import 'package:na_lody_flutter/ics_favorites_list.dart';
import 'package:na_lody_flutter/ics_settings.dart';

class ICSMenu extends StatelessWidget {

  double buttonSize = 150;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: <Widget>[
              RawMaterialButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => ICSScanArea()),
                  );
                },
                child: Container(
                    child: Image.asset('assets/search-area-button.jpg', width: buttonSize), decoration: BoxDecoration(border: Border.all(color: Colors.black12, width: 5)),
                ),
              ),
              RawMaterialButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => ICSCitySearch()),
                  );
                },
                child: Container(
                  child: Image.asset('assets/city-search-button.jpg', width: buttonSize), decoration: BoxDecoration(border: Border.all(color: Colors.black12, width: 5)),
                ),
              )
            ]
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: <Widget>[
              RawMaterialButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => ICSFavoritesList()),
                  );
              },
                child: Container(
                  child: Image.asset('assets/favorites-button.jpg', width: buttonSize), decoration: BoxDecoration(border: Border.all(color: Colors.black12, width: 5)),
                ),
              ),
              RawMaterialButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => ICSSettings()),
                  );
                },
                child: Container(
                  child: Image.asset('assets/settings-button.jpg', width: buttonSize), decoration: BoxDecoration(border: Border.all(color: Colors.black12, width: 5)),
                ),
              )
            ],
          )
        ],
      )
    );
  }
}