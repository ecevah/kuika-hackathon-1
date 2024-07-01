import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:kuika_flutter/pages/chatbot.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class LoginPage extends StatelessWidget {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  Future<void> performLogin(BuildContext context) async {
    var url =
        Uri.parse('http://192.168.184.49:5500/login'); // API URL'inizi girin
    var response = await http.post(url,
        body: json.encode({
          // Encode the body to JSON string
          'username': _usernameController.text,
          'password': _passwordController.text,
        }),
        headers: {'Content-Type': 'application/json'});

    if (response.statusCode == 200) {
      var data = json.decode(response.body);
      var token = data['access_token'];
      var clientId = data['client_id'];

      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);
      await prefs.setString('client_id', clientId);

      createSession(clientId, "device", token);

      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => ChatScreen()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed: ${response.body}')));
    }
  }

  Future<void> createSession(
      String clientID, String device, String token) async {
    String url = 'http://192.168.184.49:5500/session';

    try {
      var response = await http.post(
        Uri.parse(url),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'Client_ID': clientID,
          'Device': device,
        }),
      );

      if (response.statusCode == 201) {
        print('Session created successfully: ${response.body}');
        SharedPreferences prefs = await SharedPreferences.getInstance();
        var data = json.decode(response.body);
        var jsonResponse = json.decode(response.body);
        var sessionId = jsonResponse['data']['_id'];
        print(sessionId);

        // Save the '_id' (session ID) in SharedPreferences
        await prefs.setString('session_id', sessionId);
      } else {
        print('Failed to create session. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error occurred while creating session: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Image.asset(
                'assets/Logo.png',
                height: 80.0,
              ),
              const SizedBox(height: 20.0),
              TextField(
                controller: _usernameController,
                decoration: InputDecoration(
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: const BorderSide(color: Colors.green),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: const BorderSide(color: Colors.grey),
                  ),
                  labelText: 'Username',
                  labelStyle: const TextStyle(color: Colors.grey),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 20.0),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: const BorderSide(color: Colors.green),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: const BorderSide(color: Colors.grey),
                  ),
                  labelText: 'Password',
                  labelStyle: const TextStyle(color: Colors.grey),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 20.0),
              ElevatedButton(
                onPressed: () => performLogin(context),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                child: const Text('Sign in',
                    style: TextStyle(color: Colors.white, fontSize: 18)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
