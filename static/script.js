// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize components
    initializeTabs();
    initializeStars();
    initializeParallax();
    initializeBabylonScene();
    initializeToasts();
    initializePasswordToggles();
    initializeFormHandling();
    //loadStoredSettings();
    
    // Hide loading overlay with a delay for aesthetic reasons
    setTimeout(() => {
      const loadingOverlay = document.getElementById('loadingOverlay');
      loadingOverlay.classList.add('opacity-0');
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 500);
    }, 1500);
  });
  
  // Tab Navigation
  function initializeTabs() {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
  
    tabs.forEach(tab => {
      tab.addEventListener("click", function() {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove("active"));
        tabContents.forEach(tc => tc.classList.remove("active"));
  
        // Add active class to the clicked tab and corresponding content
        this.classList.add("active");
        const targetTab = this.getAttribute("data-tab");
        const targetContent = document.getElementById(targetTab);
        
        // Add animation class
        targetContent.classList.add("page-transition");
        targetContent.classList.add("active");
        
        // Remove animation class after animation completes
        setTimeout(() => {
          targetContent.classList.remove("page-transition");
        }, 600);
      });
    });
  }
  
  // Dynamic Stars Background
  function initializeStars() {
    const starsContainer = document.getElementById("starsContainer");
    
    // Clear any existing stars
    starsContainer.innerHTML = '';
  
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
      { transform: `translateX(${window.innerWidth}px) translateY(${window.innerHeight}px) rotate(${angle}deg)`, opacity: 0 }
    ];
    
    const animation = comet.animate(keyframes, {
      duration: duration,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      fill: 'forwards'
    });
    
    // Remove comet after animation completes
    animation.onfinish = () => {
      comet.remove();
    };
  }
  
  // JavaScript for Mousemove Star Effect
  document.body.addEventListener("mousemove", function(e) {
    // Only create stars 10% of the time to reduce performance impact
    if (Math.random() > 0.9) {
      const star = document.createElement("div");
      star.classList.add("star");
  
      // Varied star sizes
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
  
      // Position at mouse cursor
      star.style.left = `${e.clientX - size / 2}px`;
      star.style.top = `${e.clientY - size / 2}px`;
  
      // Set up the spread animation variables
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 50;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
  
      star.style.setProperty('--x', `${x}px`);
      star.style.setProperty('--y', `${y}px`);
  
      document.body.appendChild(star);
  
      // Apply animation
      star.style.animation = 'spread 2s ease-out forwards';
  
      // Remove after animation completes
      setTimeout(() => {
        star.remove();
      }, 2000);
    }
  });
  
  // Parallax Effect using GSAP
  function initializeParallax() {
    if (typeof gsap !== 'undefined' && gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
      // Register GSAP ScrollTrigger Plugin
      gsap.registerPlugin(ScrollTrigger);
  
      // Parallax for the Hero section
      document.querySelectorAll('[data-parallax-layers]').forEach((triggerElement) => {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
  
        // Define layers with different parallax speeds
        const layers = [
          { layer: "1", yPercent: 70 },
          { layer: "2", yPercent: 50 },
          { layer: "3", yPercent: 30 },
          { layer: "4", yPercent: 10 }
        ];
  
        // Apply animations to each layer
        layers.forEach((layerObj, idx) => {
          const elements = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
          if (elements.length > 0) {
            tl.to(elements, {
              yPercent: layerObj.yPercent,
              ease: "none"
            }, idx === 0 ? 0 : "<");
          }
        });
      });
  
      // Initialize smooth scrolling with Lenis if available
      if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothTouch: false
        });
  
        lenis.on('scroll', ScrollTrigger.update);
  
        // Update ScrollTrigger on Lenis scroll
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        
        requestAnimationFrame(raf);
      }
    } else {
      console.warn('GSAP or ScrollTrigger not loaded. Parallax effects will not work.');
    }
  }
  
  // Initialize Babylon.js Scene
  function initializeBabylonScene() {
    if (typeof BABYLON === 'undefined') {
      console.warn('Babylon.js not loaded. 3D scene will not work.');
      return;
    }
  
    const canvas = document.getElementById("renderCanvas");
    if (!canvas) {
      console.warn('Canvas element not found. 3D scene will not work.');
      return;
    }
  
    // Create Babylon engine
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    
    // Handle window resize
    window.addEventListener('resize', function() {
      engine.resize();
    });
    
    // Create scene
    const scene = createTerrainScene(engine, canvas);
    
    // Run render loop
    engine.runRenderLoop(function() {
      scene.render();
    });
  }
  
  // Create terrain scene for Babylon.js
  function createTerrainScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1); // Black background
    
    // Configuration
    const chunkSize = 400;
    const segments = 10;
    const chunks = new Map();
    const MIN_HEIGHT_ABOVE_TERRAIN = 15;
    const SMOOTHING_FACTOR = 0.1;
    
    // Set up camera
    const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.fov = 1.2;
    camera.setTarget(new BABYLON.Vector3(0, -5, -50));
    camera.attachControl(canvas, true);
    
    // Add minimal lighting
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    
    // Helper functions
    function generateHeight(x, z) {
      return Math.sin(x * 0.1) * Math.cos(z * 0.07) * 25 +
             Math.sin(z * 0.05 + x * 0.03) * 10 +
             Math.sin(x * 0.2) * Math.cos(z * 0.3) * 6;
    }
    
    function getAverageTerrainHeight(x, z) {
      let sum = 0;
      const samples = 5;
      const offset = 10;
      
      for (let dx = -offset; dx <= offset; dx += offset) {
        for (let dz = -offset; dz <= offset; dz += offset) {
          sum += generateHeight(x + dx, z + dz);
        }
      }
      
      return sum / (samples * samples);
    }
    
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
    
    // Create terrain chunk
    function createChunk(xOffset, zOffset) {
      const key = `${xOffset},${zOffset}`;
      if (chunks.has(key)) return;
      
      // Create terrain ground
      const terrain = BABYLON.MeshBuilder.CreateGround("terrain", {
        width: chunkSize,
        height: chunkSize,
        subdivisions: segments
      }, scene);
      
      // Modify vertices to create elevation
      const vertices = terrain.getVerticesData(BABYLON.VertexBuffer.PositionKind);
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i] + xOffset;
        const z = vertices[i + 2] + zOffset;
        vertices[i + 1] = generateHeight(x, z);
      }
      terrain.setVerticesData(BABYLON.VertexBuffer.PositionKind, vertices);
      
      // Create wireframe material
      const material = new BABYLON.StandardMaterial("wireframeMaterial", scene);
      material.wireframe = true;
      material.emissiveColor = new BABYLON.Color3(0.4, 0.4, 1.0); // Blue-ish wireframe
      material.disableLighting = true;
      
      // Apply material and position the terrain
      terrain.material = material;
      terrain.position.x = xOffset;
      terrain.position.z = zOffset;
      chunks.set(key, terrain);
    }
    
    // Variables for animation
    let speed = 0;
    let time = 0;
    let smoothHeight = 50;
    
    // Register before render function for animation
    scene.registerBeforeRender(() => {
      // Update time and speed
      speed += 0.5;
      time += 0.015;
      
      // Move camera
      camera.position.z = -speed;
      camera.position.x = Math.sin(time * 0.5) * 10;
      
      // Adjust camera height based on terrain
      const terrainHeight = getAverageTerrainHeight(camera.position.x, camera.position.z);
      const targetHeight = terrainHeight + MIN_HEIGHT_ABOVE_TERRAIN;
      
      // Smooth camera height changes
      smoothHeight = lerp(smoothHeight, targetHeight, SMOOTHING_FACTOR);
      camera.position.y = smoothHeight;
      
      // Add subtle camera rotation for more dynamic feel
      camera.rotation.z = Math.sin(time) * 0.02;
      camera.rotation.x = 0.05 + Math.sin(time * 0.5) * 0.02;
      
      // Create terrain chunks around camera
      const camX = Math.floor(camera.position.x / chunkSize) * chunkSize;
      const camZ = Math.floor(camera.position.z / chunkSize) * chunkSize;
      
      for (let x = -chunkSize; x <= chunkSize; x += chunkSize) {
        for (let z = -chunkSize * 2; z <= chunkSize; z += chunkSize) {
          createChunk(camX + x, camZ + z);
        }
      }
      
      // Clean up chunks that are far behind the camera
      for (const [key, chunk] of chunks) {
        if (chunk.position.z > camera.position.z + chunkSize * 2) {
          chunk.dispose();
          chunks.delete(key);
        }
      }
    });
    
    return scene;
  }
  
  // Toast Notification System
  function initializeToasts() {
    const toast = document.getElementById('toast');
    const closeToast = document.getElementById('closeToast');
    
    if (toast && closeToast) {
      closeToast.addEventListener('click', () => {
        hideToast();
      });
    }
  }
  
  function showToast(title, message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    if (!toast || !toastTitle || !toastMessage || !toastIcon) return;
    
    // Configure toast based on type
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Clear existing icon classes
    toastIcon.innerHTML = '';
    
    // Set icon based on type
    let icon;
    switch (type) {
      case 'success':
        icon = 'fa-check-circle';
        toastIcon.classList = 'text-green-500';
        break;
      case 'error':
        icon = 'fa-exclamation-circle';
        toastIcon.classList = 'text-red-500';
        break;
      case 'warning':
        icon = 'fa-exclamation-triangle';
        toastIcon.classList = 'text-yellow-500';
        break;
      case 'info':
        icon = 'fa-info-circle';
        toastIcon.classList = 'text-blue-500';
        break;
      default:
        icon = 'fa-check-circle';
        toastIcon.classList = 'text-green-500';
    }
    
    // Create icon element
    const iconEl = document.createElement('i');
    iconEl.className = `fas ${icon}`;
    toastIcon.appendChild(iconEl);
    
    // Show toast
    toast.classList.remove('hidden');
    
    // Use setTimeout to allow DOM update before animation
    setTimeout(() => {
      toast.classList.add('visible');
    }, 10);
    
    // Auto hide after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast();
      }, duration);
    }
  }
  
  function hideToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.classList.remove('visible');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }
  
  // Password Toggle Functionality
  function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        const inputField = this.closest('div').querySelector('input');
        const icon = this.querySelector('i');
        
        // Toggle password visibility
        if (inputField.type === 'password') {
          inputField.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          inputField.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });
  }

// Form Handling
function initializeFormHandling() {
  const videoForm = document.getElementById("videoForm");
  const generateBtn = document.getElementById("generateBtn");
  const saveSettingsBtn = document.getElementById("saveSettings");

  if (videoForm) {
    videoForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const geminiApiKey = document.getElementById("geminiApiKey").value;
      const unsplashApiKey = document.getElementById("unsplashApiKey").value;
      const topic = document.getElementById("topic").value;
      const duration = document.getElementById("duration").value;
      const keyPoints = document.getElementById("keyPoints").value;
      const style = document.getElementById("style")?.value || "educational";

      // Validate inputs
      if (!geminiApiKey || !unsplashApiKey || !topic || !duration || !keyPoints) {
        showToast("Validation Error", "Please fill in all required fields", "error");
        return;
      }

      // Store API keys in localStorage
      localStorage.setItem("geminiApiKey", geminiApiKey);
      localStorage.setItem("unsplashApiKey", unsplashApiKey);

      // Show generation in progress
      document.getElementById("generationStatus").classList.remove("hidden");
      updateProgress(0, "Starting generation process...");

      // Prepare request data
      const formData = {
        topic,
        duration,
        keyPoints: keyPoints.split("\n"),
        style,
        apiKeys: {
          gemini: geminiApiKey,
          unsplash: unsplashApiKey,
        },
      };

        // Send POST request to backend
        fetch('http://localhost:5000/videogen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gem_api: geminiApiKey,
              topic: topic,
              duration: duration,
              key_points: keyPoints.split('\n').map(k => k.trim()), // Match backend processing
              unsplash_api: unsplashApiKey,  // Added if needed by backend
              style: style
          })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
          if (data.success) {
            updateProgress(100, "Video generation complete!");
            // Display generated video
            const videoResult = document.getElementById("videoPreview");
            videoResult.innerHTML = `
              <video controls class="w-full mt-4">
                <source src="/videos/${data.videoPath}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <div class="mt-2 text-sm text-green-600">Video generated successfully!</div>
            `;
          } else {
            throw new Error(data.error || "Unknown error occurred");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showToast("Generation Failed", error.message, "error");
        })
        .finally(() => {
          // Hide progress bar after delay
          setTimeout(() => {
            document.getElementById("generationStatus").classList.add("hidden");
          }, 2000);
        });
    });
  }

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", function () {
      // Get settings values
      const geminiApiKey = document.getElementById("settingsGeminiApiKey").value;
      const unsplashApiKey = document.getElementById("settingsUnsplashApiKey").value;
      const defaultDuration = document.getElementById("defaultDuration").value;
      const defaultStyle = document.getElementById("defaultStyle").value;
      const enableAnimations = document.getElementById("enableAnimations").checked;
      const darkMode = document.getElementById("darkMode").checked;
      const autoSave = document.getElementById("autoSave").checked;

      // Store settings in localStorage
      if (geminiApiKey) localStorage.setItem("geminiApiKey", geminiApiKey);
      if (unsplashApiKey) localStorage.setItem("unsplashApiKey", unsplashApiKey);
      localStorage.setItem("defaultDuration", defaultDuration);
      localStorage.setItem("defaultStyle", defaultStyle);
      localStorage.setItem("enableAnimations", enableAnimations);
      localStorage.setItem("darkMode", darkMode);
      localStorage.setItem("autoSave", autoSave);

      // Show success toast
      showToast("Settings Saved", "Your settings have been saved successfully", "success");
    });
  }
}

// Example progress update function
function updateProgress(percentage, message) {
  const progressBar = document.getElementById("generationProgress");
  const statusText = document.getElementById("generationStatusText");
  if (progressBar) progressBar.style.width = `${percentage}%`;
  if (statusText) statusText.textContent = message;
}
  

  
  // Simulate video generation process
  function simulateVideoGeneration(topic, duration, keyPoints, style) {
    const steps = [
      { progress: 10, status: 'Analyzing topic and key points...' },
      { progress: 25, status: 'Generating script content...' },
      { progress: 40, status: 'Fetching relevant images...' },
      { progress: 60, status: 'Creating video segments...' },
      { progress: 80, status: 'Adding animations and transitions...' },
      { progress: 95, status: 'Finalizing video...' },
      { progress: 100, status: 'Video generation complete!' }
    ];
    
    let currentStep = 0;
    
    // Process each step with delay to simulate work
    function processStep() {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        updateProgress(step.progress, step.status);
        
        // Move to next step
        currentStep++;
        setTimeout(processStep, 1500);
      } else {
        // Generation complete
        finishVideoGeneration(topic);
      }
    }
    
    // Start processing steps
    processStep();
  }
  
  // Finish video generation and show controls
  function finishVideoGeneration(topic) {
    // Hide status indicators
    setTimeout(() => {
      // Show finished video (simple placeholder)
      const videoPreview = document.getElementById('videoPreview');
      if (videoPreview) {
        videoPreview.innerHTML = `
          <div class="w-full h-full flex items-center justify-center bg-black rounded-lg">
            <div class="text-center">
              <i class="fas fa-check-circle text-green-500 text-4xl mb-3"></i>
              //<p class="text-white">Video for "${topic}" generated successfully!</p>
            </div>
          </div>
        `;
      }
      
      // Show video controls
      document.getElementById('videoControls').classList.remove('hidden');
      
      // Add to history if enabled
      
      addToHistory(topic, data.videoPath);
      // Show success toast
      showToast('Success!', 'Your video has been generated successfully', 'success');
    }, 1000);
  }
  
  // Add video to history
//   function updateHistoryList() {
//     const historyList = document.getElementById('historyList');
//     const historyEmpty = document.getElementById('historyEmpty');
    
//     // Get history from localStorage
//     //let history = JSON.parse(localStorage.getItem('videoHistory') || []);
    
//     // Clear existing items
//     if (historyList) historyList.innerHTML = '';
    
//     if (history.length === 0) {
//         if (historyEmpty) historyEmpty.classList.remove('hidden');
//         if (historyList) historyList.classList.add('hidden');
//         return;
//     }
    
//     // Show history list
//     if (historyEmpty) historyEmpty.classList.add('hidden');
//     if (historyList) {
//         historyList.classList.remove('hidden');
        
//         // Add history items with your existing styling
//         history.forEach(item => {
//             const date = new Date(item.date).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//             });
            
//             const historyItem = document.createElement('div');
//             historyItem.className = 'glassmorphism p-4 rounded-lg cosmic-bg hover:transform hover:scale-105 transition-transform';
//             historyItem.innerHTML = `
//                 <div class="flex flex-col md:flex-row items-center gap-4">
//                     <div class="w-full md:w-1/4">
//                         <div class="aspect-video bg-gradient-to-r from-purple-800 to-blue-800 rounded-lg overflow-hidden shadow-lg">
//                             <img src="${item.thumbnail}" alt="${item.topic}" class="w-full h-full object-cover opacity-90">
//                         </div>
//                     </div>
//                     <div class="flex-1 space-y-2">
//                         <h3 class="text-xl font-bold cosmic-title">${item.topic}</h3>
//                         <p class="text-sm text-stone-300"><i class="fas fa-clock mr-2"></i>${date}</p>
//                         <div class="flex space-x-3">
//                             <button onclick="downloadVideo('${item.videoUrl}')" class="cosmic-button px-4 py-2 rounded-lg flex items-center">
//                                 <i class="fas fa-download mr-2"></i>Download
//                             </button>
//                             <button onclick="shareVideo('${item.id}')" class="cosmic-button px-4 py-2 rounded-lg flex items-center">
//                                 <i class="fas fa-share-alt mr-2"></i>Share
//                             </button>
//                             <button onclick="deleteHistoryItem('${item.id}')" class="px-4 py-2 rounded-lg bg-red-800/50 hover:bg-red-700/60 transition-colors">
//                                 <i class="fas fa-trash"></i>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             `;
//             historyList.appendChild(historyItem);
//         });
//     }
// }

// Modified addToHistory to match your UI
function addToHistory(topic, videoPath) {
    let history = JSON.parse(localStorage.getItem('videoHistory') || []);
    
    history.push({
        id: Date.now(),
        topic: topic,
        date: new Date().toISOString(),
        videoUrl: `/videos/${videoPath}`,
        thumbnail: 'https://via.placeholder.com/320x180/1a1a2e/ffffff?text=Video'
    });
    
    localStorage.setItem('videoHistory', JSON.stringify(history));
    updateHistoryList();
}

// Function to download a video
function downloadVideo(videoUrl) {
  const link = document.createElement("a");
  link.href = videoUrl;
  link.download = videoUrl.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function to share a video
async function shareVideo(videoUrl) {
  const fullUrl = window.location.origin + videoUrl;
  const title = videoUrl.split("/").pop().split(".")[0].replace(/-|_/g, " ");

  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: "Check out this video:",
        url: fullUrl,
      });
    } catch (error) {
      console.error("Sharing failed:", error);
      navigator.clipboard.writeText(fullUrl);
      showToast("Info", "Link copied to clipboard", "info");
    }
  } else {
    // Fallback for browsers that don't support sharing
    navigator.clipboard.writeText(fullUrl);
    showToast("Info", "Link copied to clipboard", "info");
  }
}
  
  // Load stored settings
  // function loadStoredSettings() {
  //   // Form fields
  //   const geminiApiKey = localStorage.getItem('geminiApiKey');
  //   const unsplashApiKey = localStorage.getItem('unsplashApiKey');
  //   const defaultDuration = localStorage.getItem('defaultDuration') || '60';
  //   const defaultStyle = localStorage.getItem('defaultStyle') || 'educational';
    
  //   // Set form values if stored
  //   if (geminiApiKey) {
  //     document.getElementById('geminiApiKey')?.setAttribute('value', geminiApiKey);
  //     document.getElementById('settingsGeminiApiKey')?.setAttribute('value', geminiApiKey);
  //   }
    
  //   if (unsplashApiKey) {
  //     document.getElementById('unsplashApiKey')?.setAttribute('value', unsplashApiKey);
  //     document.getElementById('settingsUnsplashApiKey')?.setAttribute('value', unsplashApiKey);
  //   }
    
  //   // Set duration and style
  //   if (document.getElementById('duration')) {
  //     document.getElementById('duration').value = defaultDuration;
  //   }
    
  //   if (document.getElementById('style') && document.getElementById('style').options) {
  //     for (let i = 0; i < document.getElementById('style').options.length; i++) {
  //       if (document.getElementById('style').options[i].value === defaultStyle) {
  //         document.getElementById('style').selectedIndex = i;
  //         break;
  //       }
  //     }
  //   }
    
  //   // Set settings values
  //   if (document.getElementById('defaultDuration')) {
  //     document.getElementById('defaultDuration').value = defaultDuration;
  //   }
    
  //   if (document.getElementById('defaultStyle') && document.getElementById('defaultStyle').options) {
  //     for (let i = 0; i < document.getElementById('defaultStyle').options.length; i++) {
  //       if (document.getElementById('defaultStyle').options[i].value === defaultStyle) {
  //         document.getElementById('defaultStyle').selectedIndex = i;
  //         break;
  //       }
  //     }
  //   }
    
  //   // Set toggle switches
  //   const enableAnimations = localStorage.getItem('enableAnimations') !== 'false';
  //   const darkMode = localStorage.getItem('darkMode') !== 'false';
  //   const autoSave = localStorage.getItem('autoSave') !== 'false';
    
  //   if (document.getElementById('enableAnimations')) {
  //     document.getElementById('enableAnimations').checked = enableAnimations;
  //   }
    
  //   if (document.getElementById('darkMode')) {
  //     document.getElementById('darkMode').checked = darkMode;
  //   }
    
  //   if (document.getElementById('autoSave')) {
  //     document.getElementById('autoSave').checked = autoSave;
  //   }
    
  //   // Update history list
  //   updateHistoryList();
  // }

// Enhanced Parallax and Transition Logic
document.addEventListener("DOMContentLoaded", function () {
    const parallaxTitle = document.querySelector('.parallax__title');
    const mainContainer = document.querySelector('.container');
    const gridLines = document.createElement('div');
    gridLines.classList.add('grid-lines');
    document.body.appendChild(gridLines);
    //updateHistoryList();
  
    // Hide title and show main content on scroll
    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        parallaxTitle.classList.add('hide');
        mainContainer.classList.add('visible');
      } else {
        parallaxTitle.classList.remove('hide');
        mainContainer.classList.remove('visible');
      }
    });
  
    // Initialize GSAP ScrollTrigger for smooth parallax
    gsap.registerPlugin(ScrollTrigger);
  
    gsap.to('.parallax__layers', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  
    // Add subtle background animations
    gsap.to('.grid-lines', {
      y: 40,
      repeat: -1,
      duration: 10,
      ease: 'linear',
    });
  });
  
  // Rest of your JavaScript code remains unchanged

 