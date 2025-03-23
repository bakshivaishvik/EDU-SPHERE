import 'package:dio/dio.dart';
import 'package:dio/io.dart';
import 'dart:io';

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://192.168.0.110:5000', // Change this to your backend URL
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 120),
  ));

  ApiService() {
    // Allow self-signed certificates
    // ignore: deprecated_member_use
    (_dio.httpClientAdapter as IOHttpClientAdapter).onHttpClientCreate =
        (HttpClient client) {
      client.badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
      return client;
    };
  }

  Future<Map<String, dynamic>> uploadVideo(dynamic video) async {
    try {
      FormData formData;
      if (video is String) {
        // If video is a path string
        formData = FormData.fromMap({
          'video': await MultipartFile.fromFile(video),
        });
      } else if (video is File) {
        // If video is a File object
        formData = FormData.fromMap({
          'video': await MultipartFile.fromFile(video.path),
        });
      } else {
        throw Exception('Invalid video format');
      }

      final response = await _dio.post(
        '/analyze',
        data: formData,
        onSendProgress: (int sent, int total) {
          print('Upload progress: ${(sent / total * 100).toStringAsFixed(2)}%');
        },
      );

      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Failed to upload video');
      }
    } catch (e) {
      throw Exception('Error uploading video: ${e.toString()}');
    }
  }
}
