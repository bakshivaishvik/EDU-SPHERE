# EDU-SPHERE

## Overview
This project is a comprehensive platform that integrates various functionalities, including video generation, learning resource recommendations, study analysis, and more. It leverages advanced AI models, such as Gemini AI, and tools like Flask, PyTorch, and Transformers to deliver an interactive and educational experience.

## Features

### 1. Video Generation
- Generate educational videos based on user-provided topics, duration, and key points.
- Includes script generation, image downloads, audio synthesis, and video assembly.
- Subtitles are automatically created and integrated into the videos.

### 2. Study Material Analysis
- Upload PDF or PPTX files to extract text and generate Yes/No questions.
- Evaluate answers and provide personalized study suggestions based on performance.

### 3. Learning Roadmap
- Generate a structured learning roadmap for a given topic, timeframe, and skill level.
- Fetches relevant learning resources dynamically from trusted sources.

### 4. Video Analysis
- Analyze uploaded videos to detect and classify human activities using a pre-trained model.

### 5. Blockchain Simulation
- Simulates blockchain operations for educational purposes.

### 6. Chatbot (Commented Out)
- A friendly AI tutor chatbot for answering user queries (currently disabled).

## Technologies Used
- **Backend**: Flask, Flask-CORS, Flask-SQLAlchemy
- **AI Models**: Transformers (Hugging Face), Gemini AI
- **Frontend**: HTML, CSS, JavaScript
- **Video Processing**: OpenCV, PyMuPDF, python-pptx
- **Blockchain**: Custom Blockchain Simulator
- **Database**: SQLite

## Project Structure
```
.
├── main.py                # Main Flask application
├── blochchain.py          # Blockchain simulator
├── templates/             # HTML templates for rendering pages
├── static/                # Static files (CSS, JS, images)
├── imagegen/              # Scripts for generating images and scripts
├── tts/                   # Text-to-speech audio generation
├── assembly/              # Video assembly scripts
├── resources/             # Resources for video generation (scripts, images, audio, etc.)
├── uploads/               # Uploaded files (PDFs, PPTs, etc.)
├── videos/                # Generated and uploaded videos
├── video_gen_final/       # Additional video generation utilities
├── integratedstuff/       # Integrated analysis scripts
└── frontend/              # Frontend-related files
```

## Installation

### Prerequisites
- Python 3.11+
- Node.js (for frontend development)
- pip (Python package manager)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd BITS-HECK-FINAL
   ```

2. Install Python dependencies:
   ```bash
   pip install -r video_gen_final/requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

4. Run the Flask application:
   ```bash
   python main.py
   ```

5. Access the application at `http://localhost:5000`.

## Usage

### Video Generation
1. Navigate to `/videogen`.
2. Provide the required inputs (API key, topic, duration, key points).
3. Submit the form to generate a video.

### Study Material Analysis
1. Navigate to `/upload`.
2. Upload a PDF or PPTX file.
3. View the generated Yes/No questions and study suggestions.

### Learning Roadmap
1. Navigate to `/generate_roadmap`.
2. Provide the topic, timeframe, and skill level.
3. View the generated roadmap and resources.

### Video Analysis
1. Navigate to `/analyze`.
2. Upload a video file.
3. View the analysis results.

### demonstration
[video demonstration](https://drive.google.com/file/d/1AUXROEMfSgQDudUsJ-Q0EID1wdsBzCJs/view?usp=drive_link)

## Contributing
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [Flask Framework](https://flask.palletsprojects.com/)
- [OpenCV](https://opencv.org/)
- [Gemini AI](https://gemini.ai/)
