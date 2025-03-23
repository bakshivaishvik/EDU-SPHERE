import os
from moviepy import ImageClip, concatenate_videoclips, AudioFileClip,TextClip,CompositeVideoClip,vfx
import pysrt 
import json
from PIL import Image, ImageDraw, ImageFont

def check_file_exists(file_path):
    """Check if a file exists at the specified path."""
    if os.path.isfile(file_path):
        return True
    else:
        raise FileNotFoundError(f"File not found: {file_path}")
    
def check_folder_exists(folder_path):
    '''Checks if a folder path is valid. '''
    if os.path.isdir(folder_path):
        return True
    else:
        raise FileNotFoundError(f"Folder not found at {folder_path}")
    
def get_files(folder, extensions):
    """
    Retrieves files with specified extensions from a folder.
    Parameters:
        folder (str): Path to the folder.
        extensions (tuple): File extensions to include (e.g., ('.jpg', '.png')).
    Returns:
        list: List of file paths.
    """
    if os.path.isdir(folder):
        return [
            os.path.join(folder, file)
            # Files are numbered , so that after sorting they are compiled into the video in that order.
            for file in sorted(os.listdir(folder),key=lambda x: int(x.split('_')[1].split('.')[0]))  
            if file.lower().endswith(extensions)
        ]
    else:
        raise OSError(f"{folder} not found.")



def create_srt(text :str,
            audio_file : AudioFileClip, 
            outfile_name:str,
            duration:int,
            chunk_size=5):
    
    # with open(text_file, "r") as file:
    #     words = file.read().split()
    words = text.split()
    chars = " ".join(words)
    chars_count = len(chars)
    word_count = len(words)
    # word_duration = audio_file.duration / word_count #seconds per word
    char_duration = audio_file.duration / chars_count #seconds per character
    # Generate subtitle file
    subs = pysrt.SubRipFile()
    start_time = duration 
    # Automatic chunk_size calculation
    # target_duration = 2 # Number of seconds the subtitle is displayed on the screen
    # chunk_size = round(target_duration/word_duration)
    
    

    for i in range(0, word_count, chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        end_time = start_time + (len(chunk) * char_duration)  

        subtitle = pysrt.SubRipItem(index=len(subs) + 1,
                                    start=pysrt.SubRipTime(seconds=start_time),
                                    end=pysrt.SubRipTime(seconds=end_time),
                                    text=chunk)

        subs.append(subtitle)
        start_time = end_time  

    out = f"samples/subtitles/.srt/{outfile_name}.srt"
    subs.save(out)
    return out


def extract_topic_from_json(file_path):
    '''
    extract_topic_from_json extract() takes json file path as input.
    - Opens the file as read-only and loads the JSON data from it.
    - Extracts the topic from the JSON data.

    On success, it returns the topic of the video.
    '''
    try:
        # Open the JSON file
        with open(file_path, 'r') as file:
            # Load JSON data from the file
            data = json.load(file)
            
            # Extract the topic, and audio_script from the JSON data
            topic = data.get('topic', 'No topic found')
            
            return topic
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
    except json.JSONDecodeError:
        print(f"Error: The file {file_path} contains invalid JSON.")
    except Exception as e:
        print("heloo2")
        print(f"An unexpected error occurred: {e}")
    


def extract_audio_from_json(file_path):
    '''
    extract_audio_topic_from_json() takes json file path as input.
    - Opens the file as read-only and loads the JSON data from it.
    - Extracts the audio_script from the JSON data.

    On success, it returns audio_script.
    '''
    try:
        # Open the JSON file
        with open(file_path, 'r') as file:
            # Load JSON data from the file
            data = json.load(file)
            print(data)
            # Extract the topic, audio_script and visual_script
            topic = data.get('topic', 'No topic found')
            audio_script = data.get('audio_script', [])
            # visual_script = data.get('visual_script', [])

            return audio_script
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
    except json.JSONDecodeError:
        print(f"Error: The file {file_path} contains invalid JSON.")
    except Exception as e:
        print(file_path)
        print(f"An unexpected error occurred: {e}")
    


def json_extract(json_path):
    '''
    json_extract() takes json file path as input.
    - Calls the extract_audio_from_json() to extract the text-to-speech / subtitles from the json file,
    and the topic of the video.

    On success, it returns the subtitles in list format, and the topic.
    '''
    
    # Extract parameters from json file
    audio_script = extract_audio_from_json(json_path)
    if audio_script:
        # print("Extracted Audio Parameters:")
        audio_data = []
        for item in audio_script:
            if 'text' in item:
                text = item['text']
                audio_data.append(text)
        return audio_data
    else:
        raise FileNotFoundError("No audio script found in the JSON file.")
    

def add_effects(clip):
    """
    Adds a effect from a curated list to the video clip.
    Parameters:
        clip (VideoClip): Video clip to which effects are to be added.
    Returns:
        VideoClip: Video clip with one effect applied.
    """
    random_effect =[vfx.FadeIn(duration=1),vfx.FadeOut(duration=1)]    
    # print(random_effect)
    return clip.with_effects(random_effect)


def create_intro_clip(background_image_path, 
                    duration, 
                    topic,
                    font_path):
    """
    Create an intro video clip with a background image and centered text.

    Parameters:
        background_image_path (str): Path to the background image.
        duration (int or float): Duration of the clip in seconds.
        topic (str): The text to display. Defaults to "Welcome to My Video!".
        font_path (str): Path to the TrueType font file.
        font_size (int): Size of the text font.
        text_color (str): Color of the text.

    Returns:
        VideoClip: A composite video clip with the background and centered text.
    """
    check_file_exists(background_image_path)
    # Create an ImageClip for the background image
    background = ImageClip(background_image_path, duration=duration)

    # Create a TextClip for the intro text
    text_clip = TextClip(text=topic,
                        size=(900, 90),
                        method='caption',
                        color="white",
                        font=font_path)

    # Position the text in the center and set its duration to match the background
    text_clip = text_clip.with_position("center").with_duration(duration)

    # Overlay the text clip on top of the background image
    final_clip = CompositeVideoClip([background, text_clip])
    
    return final_clip


def create_video(image_folder: str, 
                 audio_folder: str,
                 script_path: str,
                 font_path: str,
                 output_file: str,
                 with_subtitles: bool = False):
    """
    Main function that creates the video. The function works in 3 parts:
    1. Checks if the given parameters are correct.
    2. If `with_subtitle` flag is set to `False`, creates a video with the images and audio in the given folders.
       Each image is displayed with the same duration as the corresponding audio file.
    3. If the `with_subtitle` flag is set to `True`, embeds subtitles within the video itself, cannot be turned off in video players.
    
    Video is compiled using the `compose` method so that if the images are of different aspect ratios /resolutions then the video takes 
    the image with the largest resolution or aspect ratio as the default one and puts black bars with the rest of the non-fitting images.
    """
    check_folder_exists(audio_folder)
    check_file_exists(script_path)
    check_file_exists(font_path)
    
    # Create a placeholder image if no images are provided
    if not image_folder or not os.path.exists(image_folder) or not os.listdir(image_folder):
        placeholder_image = create_placeholder_image(font_path=font_path, text="No Image Available")
        images = [placeholder_image] * len(get_files(audio_folder, ('.mp3', '.wav')))
    else:
        check_folder_exists(image_folder)
        images = get_files(image_folder, ('.jpg', '.png'))
    
    audio_files = get_files(audio_folder, ('.mp3', '.wav'))
    subtitles = json_extract(script_path)
    raw_clips = []
    audio_durations = []
    Start_duration = 0
    
    # Creating the intro clip and appending it to raw clips
    path_to_background = "C:/Users/Sonu/Desktop/BITS-HECK-FINAL/resources/intro/intro.jpg"
    check_file_exists(path_to_background)
    topic = extract_topic_from_json(script_path)
    intro_clip = create_intro_clip(path_to_background, duration=5, topic=topic, font_path=font_path)
    raw_clips.append(intro_clip)
    
    # Create different clips with audio
    for img, audio in zip(images, audio_files):
        audio_clip = AudioFileClip(audio)
        image_clip = ImageClip(img).with_duration(audio_clip.duration).with_audio(audio_clip)
        audio_durations.append(audio_clip.duration)
        print(f"Video Clip no. {images.index(img) + 1} successfully created")
        Start_duration += audio_clip.duration
        image_clip = add_effects(image_clip)
        raw_clips.append(image_clip)
    
    # Creating the outro clip and appending it to raw clips
    outro_text = "made with Love by Team EDU-FLICK"
    outro_clip = create_intro_clip(path_to_background, duration=5, topic=outro_text, font_path=font_path)
    raw_clips.append(outro_clip)
    
    video = concatenate_videoclips(raw_clips, method="compose")
    
    if with_subtitles:
        Start_duration = 5
        subtitle_clips = []
        chunk_size = 10
        for text, duration in zip(subtitles, audio_durations):
            words = text.split()
            if len(words) > chunk_size:
                for i in range(0, len(words), chunk_size):
                    chunk = " ".join(words[i:i + chunk_size])
                    chunk_duration = duration * (len(chunk.split()) / len(words))
                    subtitle_clip = TextClip(
                        text=chunk,
                        font=font_path,
                        color='white',
                        bg_color='black',
                        size=(1000, 100),
                        method='caption',
                        text_align="center",
                        horizontal_align="center"
                    ).with_duration(chunk_duration).with_start(Start_duration).with_position('bottom')
                    subtitle_clips.append(subtitle_clip)
                    Start_duration += chunk_duration
            else:
                subtitle_clip = TextClip(
                    text=text,
                    font=font_path,
                    color='white',
                    bg_color='black',
                    size=(1000, 100),
                    method='caption',
                    text_align="center",
                    horizontal_align="center"
                ).with_duration(duration).with_start(Start_duration).with_position('bottom')
                subtitle_clips.append(subtitle_clip)
                Start_duration += duration
        subtitle_clips.insert(0, video)
        final_video = CompositeVideoClip(subtitle_clips)
    else:
        final_video = video
    
    final_video.write_videofile(output_file, fps=24, threads=os.cpu_count())
    print(f"Video created successfully: {output_file}")


def create_placeholder_image(width=1920, height=1080, text="No Image", font_path=None, font_size=50, text_color="white", bg_color="black"):
    """
    Creates a placeholder image with the specified dimensions and text.
    
    Parameters:
        width (int): Width of the image.
        height (int): Height of the image.
        text (str): Text to display on the image.
        font_path (str): Path to the font file.
        font_size (int): Size of the font.
        text_color (str): Color of the text.
        bg_color (str): Background color of the image.
    
    Returns:
        str: Path to the generated placeholder image.
    """
    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    if font_path:
        font = ImageFont.truetype(font_path, font_size)
    else:
        font = ImageFont.load_default()
    
    # Use textbbox to calculate the bounding box of the text
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]  # Calculate width from bounding box
    text_height = bbox[3] - bbox[1]  # Calculate height from bounding box
    
    # Center the text
    text_position = ((width - text_width) // 2, (height - text_height) // 2)
    
    # Draw the text on the image
    draw.text(text_position, text, font=font, fill=text_color)
    
    # Save the placeholder image
    placeholder_path = "placeholder.png"
    img.save(placeholder_path)
    
    return placeholder_path
        
        
def create_complete_srt(script_folder :str, 
            audio_file_folder : str, 
            outfile_path:str,
            chunk_size=10):
    """
    Creates an SRT file by extracting subtitles from the script_folder using `json_extract` function and audio files 
    from the `audio_file` folder. Segments the subtitles into the specified chunk size and maps the duration of the chunk to the 
    proportion of the length of the chunk.
    Parameters:
    script_folder (str): Path to the folder containing script json file.
    audio_file_folder (str): Path to the folder containing audio files.
    outfile_path (str): Path or Name of the SRT file given in output.
    chunk_size (str): Number of words per subtitle chunk.
    """
    script_folder=r"C:/Users/Sonu/Desktop/BITS-HECK-FINAL/resources/scripts/script.json";
    script = json_extract(script_folder)
    print(script)
    audio_files = get_files(audio_file_folder,(".wav",".mp3"))
    print(audio_files)
    audio_clips = []
    [audio_clips.append(AudioFileClip(x)) for x in audio_files]
    subs = pysrt.SubRipFile()
    start_time = 5 
    chunk = ''
    chunk_duration = 0
    end_time = 5
    n = 1
    for text,audio_clip in zip(script,audio_clips):
        duration = audio_clip.duration
        words = text.split()
        if len(words) > chunk_size:
            for i in range(0,len(words),chunk_size):
                chunk = " ".join(words[i : (i+chunk_size if i < len(words)-1 else len(words)-1)])
                chunk_duration = duration * (len(chunk.split())/len(words))
                end_time += chunk_duration
                subtitle = pysrt.SubRipItem(
                    index=n,
                    start=pysrt.SubRipTime(seconds=start_time),
                    end=pysrt.SubRipTime(seconds=end_time),
                    text=chunk
                )
                subs.append(subtitle)
                # For Debugging:
                # print(f"Subtitle no. {n} added successfully.")
                # print(f"Start : {start_time}")
                # print(f"End : {end_time}")
                start_time = end_time
                n+=1
        else:
            chunk = text
            chunk_duration = duration
            end_time += chunk_duration
            subtitle = pysrt.SubRipItem(
                index=len(subs) + 1,
                start=pysrt.SubRipTime(seconds=start_time),
                end=pysrt.SubRipTime(seconds=end_time),
                text=chunk
            )
            subs.append(subtitle)
            # For Debugging:
            print(f"Subtitle no. {n} added successfully.")
            # print(f"Start : {start_time}")
            # print(f"End : {end_time}")
            start_time = end_time
            n+=1
            
    subs.save(outfile_path)
    print(f"File saved successfully at {outfile_path}")

        

    
