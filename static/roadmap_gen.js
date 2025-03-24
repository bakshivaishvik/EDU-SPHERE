
        // Generate stars when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            generateStars();
            //document.getElementById('generateBtn').addEventListener('click', generateRoadmap);
        });

        // Create twinkling stars in the background
        function generateStars() {
            const starsContainer = document.getElementById('starsContainer');
            const starCount = 150;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // Random position
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                
                // Random size
                const size = Math.random() * 2 + 1;
                
                // Random twinkle duration
                const duration = Math.random() * 3 + 1;
                
                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.animationDuration = `${duration}s`;
                
                starsContainer.appendChild(star);
            }
        }

        // Create dynamic stars
function createStars() {
    const container = document.getElementById('starsContainer');
    const count = 200;
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.opacity = Math.random();
        star.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(star);
    }
}

// Add CSS for stars
const style = document.createElement('style');
style.textContent = `
    .star {
        position: absolute;
        background: white;
        border-radius: 50%;
        animation: twinkle ${Math.random() * 5 + 3}s infinite alternate;
    }
    @keyframes twinkle {
        0% { opacity: 0.2; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Generate roadmap function
function generateRoadmap() {
    console.log('started generation!!!!!!!!');
    const learn = document.getElementById('learn').value;
    const time = document.getElementById('time').value;
    const level = document.getElementById('level').value;
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const resultsHeader = document.querySelector('.results-header');
    const timeline = document.getElementById('timeline');

    if (!learn || !time || !level) {
        alert('Please fill all fields to generate your roadmap');
        return;
    }

    generateBtn.disabled = true;
    loading.style.display = 'flex';
    resultsHeader.style.display = 'none';
    timeline.style.display = 'none';
    timeline.innerHTML = '';

    fetch('/generate_roadmap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            learn: learn,
            time: time,
            level: level 
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'error') {
            throw new Error(data.message);
        }
        
        // Update header info
        document.getElementById('topic-display').textContent = `Topic: ${data.data.topic}`;
        document.getElementById('time-display').textContent = `Time: ${data.data.timeframe}`;
        document.getElementById('level-display').textContent = `Level: ${data.data.level}`;
        
        resultsHeader.style.display = 'block';
        renderTimeline(data.data.steps);
    })
    .catch(error => {
        console.error('Error:', error);
        timeline.innerHTML = `
            <div class="error-message">
                <p>🚀 Failed to generate roadmap: ${error.message}</p>
            </div>
        `;
        timeline.style.display = 'block';
    })
    .finally(() => {
        generateBtn.disabled = false;
        loading.style.display = 'none';
    });
}

function renderTimeline(steps) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';

    if (!steps || steps.length === 0) {
        timeline.innerHTML = `
            <div class="error-message">
                <p>No roadmap steps were generated</p>
            </div>
        `;
        timeline.style.display = 'block';
        return;
    }

    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'timeline-step';
        
        stepElement.innerHTML = `
            <div class="timeline-marker">${index + 1}</div>
            <div class="timeline-content">
                <p class="step-description">${step.description}</p>
                <p class="step-duration">⏱ ${step.duration}</p>
                <div class="step-resources">
                    <span class="resources-label">📚 Resources:</span>
                    <div class="resources-list">${step.resources.map(r => r.title).join(', ')}</div>
                </div>
            </div>
        `;
        timeline.appendChild(stepElement);
    });

    timeline.style.display = 'block';
}
// Initialize stars when page loads
window.onload = function() {
    createStars();
};