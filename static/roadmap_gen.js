
        // Generate stars when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            generateStars();
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

        function generateRoadmap() {
            const learn = document.getElementById('learn').value;
            const time = document.getElementById('time').value;
            const level = document.getElementById('level').value;
        
            if (!learn || !time || !level) {
                alert('Please fill all the fields.');
                return;
            }
        
            // Add loading indicator
          //  const output = document.getElementById('output');
         //   output.innerHTML = '<div style="text-align: center; padding: 50px 0;"><div style="border: 3px solid rgba(99, 102, 241, 0.3); border-radius: 50%; border-top-color: var(--primary-color); width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto;"></div><p style="margin-top: 15px;">Generating your roadmap...</p></div>';
            
            fetch('/generate_roadmap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ learn, time, level }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    output.innerHTML = `<div style="color: var(--error);">${data.error}</div>`;
                } else {
                    renderTimeline(data.roadmap);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                output.innerHTML = `<div style="color: var(--error);">An error occurred. Please try again.</div>`;
            });
        }
        
        function renderTimeline(roadmap) {
            const timeline = document.getElementById('timeline');
            timeline.innerHTML = ''; // Clear previous content
        
            roadmap.forEach((step, index) => {
                const stepElement = document.createElement('div');
                stepElement.className = 'timeline-step';
                stepElement.innerHTML = `
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <h3>${step.title}</h3>
                        <p>${step.description}</p>
                        <p><strong>Duration:</strong> ${step.duration}</p>
                        <p><strong>Resources:</strong> ${step.resources.join(', ')}</p>
                    </div>
                `;
                timeline.appendChild(stepElement);
            });
        }