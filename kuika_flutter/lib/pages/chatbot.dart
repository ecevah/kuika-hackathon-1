import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:kuika_flutter/services/session_manager.dart';
import 'package:encrypt/encrypt.dart' as encrypt;
import 'dart:convert';
import 'dart:typed_data';

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<ChatMessage> _messages = [];
  final String key = "thisisasecretkey";
  final BLOCK_SIZE = 16;

  String encryptMessage(String plainText, String key) {
    final keyBytes = Uint8List.fromList(utf8.encode(key).sublist(0, 16));
    final keyEncrypt = encrypt.Key(keyBytes);

    final encrypter =
        encrypt.Encrypter(encrypt.AES(keyEncrypt, mode: encrypt.AESMode.ecb));
    final encrypted = encrypter.encrypt(plainText);

    return base64Encode(encrypted.bytes);
  }

  String decryptMessage(String encryptedBase64Text, String key) {
    final keyBytes = Uint8List.fromList(utf8.encode(key).sublist(0, 16));
    final keyDecrypt = encrypt.Key(keyBytes);

    final encrypter =
        encrypt.Encrypter(encrypt.AES(keyDecrypt, mode: encrypt.AESMode.ecb));
    final decrypted =
        encrypter.decrypt(encrypt.Encrypted(base64Decode(encryptedBase64Text)));

    return decrypted;
  }

  void _handleSubmitted(String text) async {
    if (text.trim().isEmpty) return;
    _controller.clear();

    String? sessionId = await SessionManager.getSessionId();
    String? token = await SessionManager.getToken();

    if (sessionId == null || token == null) {
      print("Session ID or Token not found");
      return;
    }

    String url = 'http://192.168.184.49:5500/response';
    var encryptedRequest = encryptMessage(text, key);

    var response = await http.post(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'Session_ID': sessionId,
        'Request': encryptedRequest,
      }),
    );

    if (response.statusCode == 201) {
      var data = jsonDecode(response.body)['data'];

      String decryptedRequest = decryptMessage(data['Request'], key);
      String decryptedResponse = decryptMessage(data['Response'], key);

      addMessage(decryptedRequest, false);

      addMessage(decryptedResponse, true);
    } else {
      print(
          'Failed to send/receive message. Status code: ${response.statusCode}');
    }
  }

  void addMessage(String text, bool position) {
    ChatMessage message = ChatMessage(
      text: text,
      position: position,
    );
    setState(() {
      _messages.insert(0, message);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Chat'),
      ),
      body: Column(
        children: <Widget>[
          Flexible(
            child: ListView.builder(
              padding: EdgeInsets.all(8.0),
              reverse: true,
              itemBuilder: (_, int index) => _messages[index],
              itemCount: _messages.length,
            ),
          ),
          Divider(height: 1.0),
          Container(
            child: _buildTextComposer(),
          ),
        ],
      ),
    );
  }

  Widget _buildTextComposer() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8.0),
      child: Row(
        children: <Widget>[
          Flexible(
            child: TextField(
              controller: _controller,
              onSubmitted: _handleSubmitted,
              decoration: InputDecoration(
                hintText: "Ask or search anything",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20.0),
                  borderSide: BorderSide(color: Colors.grey),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20.0),
                  borderSide: BorderSide(color: Colors.grey),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20.0),
                  borderSide: BorderSide(color: Colors.grey),
                ),
                filled: true,
                fillColor: Colors.white,
                contentPadding: EdgeInsets.all(10.0),
              ),
              style: TextStyle(color: Colors.black),
            ),
          ),
          Container(
            margin: EdgeInsets.symmetric(horizontal: 4.0),
            child: IconButton(
              icon: Icon(Icons.send),
              onPressed: () => _handleSubmitted(_controller.text),
            ),
          ),
        ],
      ),
    );
  }
}

class ChatMessage extends StatelessWidget {
  final String text;
  final bool position;

  ChatMessage({required this.text, required this.position});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10.0),
      child: Row(
        mainAxisAlignment:
            position ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: <Widget>[
          if (!position)
            CircleAvatar(
              child: Image.asset("assets/memoji11.png"),
              backgroundColor: Colors.grey,
            ),
          Container(
            margin: EdgeInsets.only(left: 8.0, right: 8.0),
            padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
            decoration: BoxDecoration(
              color: position
                  ? Color.fromRGBO(240, 250, 249, 1)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(12.0),
            ),
            child: position
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 275,
                        child: Text(
                          text,
                          style: TextStyle(fontSize: 16.0, color: Colors.black),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 7.0),
                        child: const Row(
                          children: [
                            Padding(
                              padding: EdgeInsets.all(3.0),
                              child: Icon(Icons.thumb_up_alt_outlined),
                            ),
                            Padding(
                              padding: EdgeInsets.all(3.0),
                              child: Icon(Icons.thumb_down_alt_outlined),
                            )
                          ],
                        ),
                      )
                    ],
                  )
                : SizedBox(
                    width: 275,
                    child: Text(
                      text,
                      style: TextStyle(fontSize: 16.0, color: Colors.black),
                    ),
                  ),
          ),
          if (position)
            CircleAvatar(
                backgroundColor: Color.fromRGBO(240, 250, 249, 1),
                child: Icon(
                  Icons.smart_toy_outlined,
                  color: Colors.green,
                )),
        ],
      ),
    );
  }
}
