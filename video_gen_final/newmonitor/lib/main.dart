import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const ActivityMonitorApp());
}

class ActivityMonitorApp extends StatelessWidget {
  const ActivityMonitorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Activity Monitor',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
