import json
import os
import time
import requests
from urllib.parse import quote

# Path to JSON file
script_path = "resources/scripts/script.json"
images_output_path = "resources/images/"
os.makedirs(images_output_path, exist_ok=True)

# Unsplash API credentials
UNSPLASH_ACCESS_KEY = "9WDL97h1VW5rcSZyDoMYDOADwPNnx-vWDHs41PtusVc"  # Replace with your Unsplash Access Key
UNSPLASH_API_URL = "https://api.unsplash.com/search/photos"

# Function to download an image from a URL
def download_image(url, file_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(file_path, "wb") as f:
            f.write(response.content)
        print(f"Saved: {file_path}")
    else:
        print(f"Failed to download image from {url}")

# Function to search for images using Unsplash API
def search_unsplash(query, num_images=1):
    headers = {
        "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"
    }
    params = {
        "query": query,
        "per_page": num_images,  # Number of images to fetch
        "orientation": "landscape"  # Optional: Fetch landscape-oriented images
    }
    response = requests.get(UNSPLASH_API_URL, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        image_urls = [result["urls"]["regular"] for result in data["results"]]  # Use "regular" size images
        return image_urls
    else:
        print(f"Unsplash API request failed: {response.status_code}")
        return []

# Function to find the nearest match for the prompt
def find_nearest_match(prompt, image_urls):
    """
    Find the image URL that best matches the prompt.
    For simplicity, return the first image.
    """
    if not image_urls:
        return None
    return image_urls[0]

# Main function to process the JSON and download images
def main_download_images(script_path, images_output_path):
    # JSON Decoding Error Handling
    with open(script_path, "r", encoding="utf-8") as file:
        try:
            data = json.load(file)
        except json.JSONDecodeError:
            print("Error reading JSON file.")
            return

    # JSON Key Error Handling
    if "visual_script" not in data:
        print("Missing key in JSON.")
        return

    # Looping Through the Scenes
    for idx, scene in enumerate(data["visual_script"]):
        try:
            prompt = scene["prompt"]
            timestamp = scene.get("timestamp", f"{idx:03d}")
            scene_id = timestamp.replace(":", "-")

            # Search for images using Unsplash API
            image_urls = search_unsplash(prompt, num_images=5)  # Fetch more images for better matching
            if not image_urls:
                print(f"No images found for prompt: {prompt}")
                continue

            # Find the nearest match for the prompt
            image_url = find_nearest_match(prompt, image_urls)
            if not image_url:
                print(f"No suitable image found for prompt: {prompt}")
                continue

            # Download the nearest match image
            file_path = os.path.join(images_output_path, f"scene_{scene_id}.jpg")
            download_image(image_url, file_path)

            time.sleep(1)  # Add a delay to avoid hitting API rate limits

        except Exception as e:
            print(f"Error processing scene {idx}: {e}")

    print("Done.")

# Run the script
if __name__ == "__main__":
    main_download_images(script_path, images_output_path)