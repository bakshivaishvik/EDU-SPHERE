import 'dart:io';

import 'package:dio/io.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:video_player/video_player.dart';

void main() {
  runApp(VideoGeneratorApp());
}

class VideoGeneratorApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Video Generator',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: VideoGeneratorScreen(),
    );
  }
}

class VideoGeneratorScreen extends StatefulWidget {
  @override
  _VideoGeneratorScreenState createState() => _VideoGeneratorScreenState();
}

class _VideoGeneratorScreenState extends State<VideoGeneratorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _topicController = TextEditingController();
  final _durationController = TextEditingController();
  final _keyPointsController = TextEditingController();
  String _statusMessage = '';
  String _videoUrl = '';
  VideoPlayerController? _videoController;
  bool _isVideoPlaying = false;
  bool _isLoading = false;

  // Dio instance with custom HttpClient to trust self-signed certificates
  final Dio _dio = Dio();

  @override
  void initState() {
    super.initState();
    _configureDio();
  }

  void _configureDio() {
    (_dio.httpClientAdapter as IOHttpClientAdapter).onHttpClientCreate =
        (HttpClient client) {
      client.badCertificateCallback =
          (X509Certificate cert, String host, int port) => true; // Trust all certificates
      return client;
    };
  }

  Future<void> _generateVideo() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _statusMessage = 'Generating video...';
        _videoUrl = '';
        _videoController?.dispose();
        _videoController = null;
        _isLoading = true;
      });

      try {
        // Replace with your Flask backend HTTPS URL
        final url = 'https://192.168.0.110:5000/generate_video';
        final response = await _dio.post(
          url,
          data: {
            'gemini_api_key': 'your_gemini_api_key',  // Replace with your API key
            'topic': _topicController.text,
            'duration': int.parse(_durationController.text),
            'key_points': _keyPointsController.text.split(','),
            'feedback': 'no',
          },
          options: Options(headers: {'Content-Type': 'application/json'}),
        );

        if (response.statusCode == 200) {
          final responseData = response.data;
          setState(() {
            _statusMessage = 'Video generated successfully!';
            _videoUrl = responseData['video_url'];
            _videoController = VideoPlayerController.network(_videoUrl)
              ..initialize().then((_) {
                setState(() {});
              });
          });
        } else {
          setState(() {
            _statusMessage = 'Failed to generate video: ${response.data}';
          });
        }
      } catch (e) {
        setState(() {
          _statusMessage = 'An error occurred: $e';
        });
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _videoController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Video Generator'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _topicController,
                decoration: InputDecoration(
                  labelText: 'Topic',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a topic';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _durationController,
                decoration: InputDecoration(
                  labelText: 'Duration (in seconds)',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a duration';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _keyPointsController,
                decoration: InputDecoration(
                  labelText: 'Key Points (comma-separated)',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter key points';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isLoading ? null : _generateVideo,
                child: _isLoading
                    ? SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Text('Generate Video'),
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
              ),
              SizedBox(height: 10),
              Text(
                'Note: Video generation might take up to 10 minutes or more.',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                  fontStyle: FontStyle.italic,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20),
              Text(
                _statusMessage,
                style: TextStyle(
                  fontSize: 16,
                  color: _statusMessage.contains('successfully') ? Colors.green : Colors.red,
                ),
                textAlign: TextAlign.center,
              ),
              if (_videoUrl.isNotEmpty)
                Column(
                  children: [
                    SizedBox(height: 20),
                    _videoController != null && _videoController!.value.isInitialized
                        ? AspectRatio(
                            aspectRatio: _videoController!.value.aspectRatio,
                            child: VideoPlayer(_videoController!),
                          )
                        : CircularProgressIndicator(),
                    SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _isVideoPlaying = !_isVideoPlaying;
                          _isVideoPlaying
                              ? _videoController!.play()
                              : _videoController!.pause();
                        });
                      },
                      child: Text(_isVideoPlaying ? 'Pause' : 'Play'),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}