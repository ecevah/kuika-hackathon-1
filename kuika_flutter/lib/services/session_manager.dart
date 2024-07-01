import 'package:shared_preferences/shared_preferences.dart';

class SessionManager {
  static const String sessionIdKey = 'session_id';
  static const String tokenKey = 'token';

  static Future<void> setSessionId(String sessionId) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(sessionIdKey, sessionId);
  }

  static Future<String?> getSessionId() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString(sessionIdKey);
  }

  static Future<void> setToken(String token) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(tokenKey, token);
  }

  static Future<String?> getToken() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString(tokenKey);
  }
}
