from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
import tempfile
import os
from collections import defaultdict
import time

app = Flask(__name__)
CORS(app)

# Load the model and processor
processor = AutoImageProcessor.from_pretrained("DunnBC22/vit-base-patch16-224-in21k_Human_Activity_Recognition")
model = AutoModelForImageClassification.from_pretrained("DunnBC22/vit-base-patch16-224-in21k_Human_Activity_Recognition")

def preprocess_frame(frame):
    # Resize frame to match model's expected input size
    frame = cv2.resize(frame, (224, 224))
    # Convert BGR to RGB
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    # Preprocess using the model's processor
    inputs = processor(images=frame, return_tensors="pt")
    return inputs

def predict_action(inputs):
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = outputs.logits.softmax(dim=-1)
        predicted_idx = predictions.argmax().item()
        return model.config.id2label[predicted_idx]

def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise Exception("Error opening video file")

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    activity_durations = defaultdict(float)
    frame_count = 0
    sample_rate = 5  # Process every 5th frame to improve performance

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame_count % sample_rate != 0:
            continue

        inputs = preprocess_frame(frame)
        action = predict_action(inputs)
        activity_durations[action] += sample_rate / fps

    cap.release()

    total_duration = sum(activity_durations.values())
    return {
        "activities": dict(activity_durations),
        "total_duration": total_duration
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video = request.files['video']
    
    # Save the uploaded video to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
        video.save(temp_video.name)
        temp_path = temp_video.name

    try:
        result = analyze_video(temp_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the temporary file
        os.unlink(temp_path)

if __name__ == '__main__':
    app.run(host='192.168.0.110', port=5000, ssl_context=("C:/Users/Sonu/Desktop/MY_HACKS-2024/mypulls/GeoAttendance/cert.pem", "C:/Users/Sonu/Desktop/MY_HACKS-2024/mypulls/GeoAttendance/key.pem")) 