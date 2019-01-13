import 'package:flutter/material.dart';
import 'package:na_lody_flutter/ics_menu.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(MyApp());
  initStorage();
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
          appBar: AppBar(
              title: Text('Na Lody'),
          ),
          body: ICSMenu()
      ),
    );
  }
}

initStorage() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  List<String> favorites = prefs.getStringList('favorites');
  int radius = prefs.getInt('radius');
  if(favorites == null){
    prefs.setStringList('favorites', []);
  }
  if(radius == null){
    prefs.setInt('radius', 10);
  }
}
