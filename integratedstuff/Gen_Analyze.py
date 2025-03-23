from flask import Flask, request, render_template, redirect, url_for, send_from_directory, jsonify
from flask_cors import CORS
import json
import os
import re
import cv2
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
import tempfile
from collections import defaultdict
from imagegen.generate_script import VideoScriptGenerator
from imagegen.generate_image import main_download_images
from tts.generate_audio import main_generate_audio
from assembly.scripts.assembly_video import create_video, create_complete_srt

app = Flask(__name__)
CORS(app)

# Define paths
script_path = "resources/scripts/script.json"
images_path = "resources/images/"
audio_path = "resources/audio/"
font_path = "resources/font/font.ttf"
video_output_path = "resources/video/"
subtitle_output_path = "resources/subtitles/"

# Load the model and processor for video analysis
processor = AutoImageProcessor.from_pretrained("DunnBC22/vit-base-patch16-224-in21k_Human_Activity_Recognition")
model = AutoModelForImageClassification.from_pretrained("DunnBC22/vit-base-patch16-224-in21k_Human_Activity_Recognition")

def create_or_check_folder(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    else:
        if any(os.listdir(folder_path)):
            raise FileExistsError(f"Folder '{folder_path}' already exists and contains files.")

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        gem_api = request.form['gem_api']
        topic = request.form['topic']
        duration = int(request.form['duration'])
        key_points = request.form['key_points'].split(",")
        key_points = [word.strip() for word in key_points]

        # Generate script
        generator = VideoScriptGenerator(api_key=gem_api)
        script = generator.generate_script(topic, duration, key_points)
        generator.save_script(script, script_path)

        # Generate images
        main_download_images(script_path, images_path)

        # Generate audio
        main_generate_audio(script_path, audio_path)

        # Prepare for video assembly
        topic_cleaned = re.sub(r"[^A-Za-z0-9\s]+", " ", topic)
        topic_cleaned = re.sub(r"\s+", "_", topic_cleaned)[:100]
        sub_output_file = os.path.join(subtitle_output_path, f"{topic_cleaned}.srt")
        video_file = os.path.join(video_output_path, f"{topic_cleaned}.mp4")

        # Create subtitles
        create_complete_srt(script_path, audio_path, sub_output_file, chunk_size=10)

        # Create video
        create_video(images_path, audio_path, script_path, font_path, video_file, with_subtitles=True)

        # Redirect to the video viewing page
        return redirect(url_for('view_video', video_name=f"{topic_cleaned}.mp4"))

    return render_template('index.html')

@app.route('/video/<video_name>')
def view_video(video_name):
    return render_template('video.html', video_name=video_name)

@app.route('/resources/video/<video_name>')
def serve_video(video_name):
    return send_from_directory(video_output_path, video_name)

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

def preprocess_frame(frame):
    frame = cv2.resize(frame, (224, 224))
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
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
    sample_rate = 5

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

if __name__ == "__main__":
    create_or_check_folder(images_path)
    create_or_check_folder(audio_path)
    create_or_check_folder(video_output_path)
    create_or_check_folder(subtitle_output_path)
    app.run(host='0.0.0.0', port=5000)