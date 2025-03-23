document.getElementById("video-upload").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const loadingElement = document.getElementById("loading");
    const resultsElement = document.getElementById("results");
    const errorElement = document.getElementById("error");
    const uploadText = document.getElementById("upload-text");

    // Reset UI
    resultsElement.classList.add("hidden");
    errorElement.classList.add("hidden");
    uploadText.textContent = "Uploading...";
    loadingElement.classList.remove("hidden");

    // Show video preview
    const videoURL = URL.createObjectURL(file);
    previewVideo.src = videoURL;
    videoPreview.classList.remove("hidden");

    // Upload video to the backend
    const formData = new FormData();
    formData.append("video", file);

    fetch("/analyze", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }

            // Display results
            document.getElementById("total-duration").textContent = data.total_duration.toFixed(2);
            const activitiesList = document.getElementById("activities-list");
            activitiesList.innerHTML = "";

            for (const [activity, duration] of Object.entries(data.activities)) {
                const li = document.createElement("li");
                li.textContent = `${activity}: ${duration.toFixed(2)} seconds`;
                activitiesList.appendChild(li);
            }

            resultsElement.classList.remove("hidden");
        })
        .catch((error) => {
            // Display error
            document.getElementById("error-message").textContent = error.message;
            errorElement.classList.remove("hidden");
        })
        .finally(() => {
            // Reset UI
            loadingElement.classList.add("hidden");
            uploadText.textContent = "Choose a video file";
        });
});

// Dynamic Stars Background
function initializeStars() {
    const starsContainer = document.getElementById("starsContainer");

    // Clear any existing stars
    starsContainer.innerHTML = "";

    // Generate random stars
    for (let i = 0; i < 150; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;

        // Varied star sizes
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Varied opacity
        star.style.opacity = Math.random() * 0.8 + 0.2;

        // Varied animation duration
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;

        starsContainer.appendChild(star);
    }

    // Generate random comets (shooting stars)
    for (let i = 0; i < 5; i++) {
        createComet();
    }

    // Create comets at intervals
    setInterval(createComet, 8000);
}

function createComet() {
    const starsContainer = document.getElementById("starsContainer");
    const comet = document.createElement("div");
    comet.classList.add("comet");

    // Random starting position
    comet.style.top = `${Math.random() * 50}%`;
    comet.style.left = `${Math.random() * 80}%`;

    // Random rotation
    const angle = -45 + (Math.random() * 20 - 10);
    comet.style.transform = `rotate(${angle}deg)`;

    // Random size
    const size = Math.random() * 2 + 1;
    const length = Math.random() * 80 + 50;
    comet.style.width = `${size}px`;
    comet.style.height = `${length}px`;

    starsContainer.appendChild(comet);

    // Custom animation
    const duration = Math.random() * 3000 + 3000;
    const keyframes = [
        { transform: `translateX(0) translateY(0) rotate(${angle}deg)`, opacity: 1 },
        { transform: `translateX(${window.innerWidth}px) translateY(${window.innerHeight}px) rotate(${angle}deg)`, opacity: 0 },
    ];

    const animation = comet.animate(keyframes, {
        duration: duration,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        fill: "forwards",
    });

    // Remove comet after animation completes
    animation.onfinish = () => {
        comet.remove();
    };
}

// Initialize stars when the page loads
window.addEventListener("load", initializeStars);