import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ICSSettings extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _SettingsState();
  }
}

class _SettingsState extends State {

  TextEditingController _controller = new TextEditingController(text: '10');

  @override
  void initState() {
    super.initState();
    SharedPreferences.getInstance().then((prefs){
      int radious = prefs.getInt('radious');
        setState(() {
          _controller.text = radious.toString();
        });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Ustawienia'),
      ),
      body: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              Container(
                margin: EdgeInsets.only(right: 20),
                child: Text('Zasięg radaru:', style: TextStyle(fontSize: 20),),
              ),
              Container(
                width: 50,
                child: TextField(
                  controller: _controller,
                  keyboardType: TextInputType.number,
                  onSubmitted: (input){
                    setState(() {
                      SharedPreferences.getInstance().then((prefs) {
                        prefs.setInt('radious', int.parse(input));
                      });
                    });
                  },
                )
              )
            ],
          )
        ]
      )
    );
  }
}