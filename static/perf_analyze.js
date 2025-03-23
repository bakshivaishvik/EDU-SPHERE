// Generate stars when the page loads
document.addEventListener('DOMContentLoaded', function() {
    generateStars();
    typeText();
    setupScrollBehavior();
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

// Typing animation for the hero section
function typeText() {
    const textElement = document.getElementById('typed-text');
    const text = 'EduSphere'; // Text to be typed out
    const speed = 150; // Speed of typing in milliseconds
    
    let i = 0;
    function type() {
        if (i < text.length) {
            textElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Smooth scroll setup
function setupScrollBehavior() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function uploadFile() {
    var fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) { 
        alert("Please select a file."); 
        return; 
    }

    var formData = new FormData();
    formData.append("file", fileInput);

    $("#loading").show();
    $("#quiz").removeClass("active").html("");
    $("#evaluation").removeClass("active").html("");
    $("#submitBtn").hide();

    console.log("📤 Sending file to backend...");  // Debugging log

    $.ajax({
        url: "/upload",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            $("#loading").hide();
            console.log("📡 Response from Flask:", response);  // Debugging log

            if (response.questions && response.questions.length > 0) {
                questionsData = response.questions; 
                displayQuestions();
            } else {
                alert("❌ Error: No questions received from the server.");
            }
        },
        error: function(xhr, status, error) { 
            $("#loading").hide();
            alert("❌ Upload Error: " + error);
            console.error("❌ Upload Error:", xhr.responseText);
        }
    });
}

function displayQuestions() {
    let quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = "<h3>Answer the Questions:</h3>";
    
    questionsData.forEach((q, index) => {
        quizDiv.innerHTML += `<p><b>${q}</b></p>
                            <label><input type="radio" name="q${index}" value="yes"> Yes</label>
                            <label><input type="radio" name="q${index}" value="no"> No</label><br>`;
    });
    
    $("#quiz").addClass("active");
    $("#submitBtn").show();
}

// Function to render graphs
function renderGraphs(percentile, classAverage, studentScore) {
    // Percentile Ranking Chart
    const percentileData = {
        labels: ["0-10%", "10-20%", "20-30%", "30-40%", "40-50%", "50-60%", "60-70%", "70-80%", "80-90%", "90-100%"],
        datasets: [{
            label: "Percentile Distribution",
            data: [5, 10, 5, 25, 35, 30, 35, 40, 45, 10], // Example data
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
        }],
    };

    // Class Average Comparison Chart
    const classAverageData = {
        labels: ["Your Score", "Class Average"],
        datasets: [{
            label: "Score Comparison",
            data: [studentScore, classAverage],
            backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
        }],
    };

    // Render Percentile Ranking Chart
    const percentileCtx = document.getElementById("percentileChart").getContext("2d");
    new Chart(percentileCtx, {
        type: "bar",
        data: percentileData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    // Render Class Average Comparison Chart
    const classAverageCtx = document.getElementById("classAverageChart").getContext("2d");
    new Chart(classAverageCtx, {
        type: "bar",
        data: classAverageData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Modify the submitAnswers function to include graphs
function submitAnswers() {
    let answers = [];
    questionsData.forEach((q, index) => {
        let selected = document.querySelector(`input[name="q${index}"]:checked`);
        answers.push(selected ? selected.value : "no");
    });

    $("#loading").show();
    $("#evaluation").removeClass("active").html("");

    $.ajax({
        url: "/evaluate",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ questions: questionsData, answers: answers }),
        success: function(response) {
            $("#loading").hide();
            $("#evaluation").html(`
                <h3>Study Suggestion:</h3>
                <p>${response.study_suggestion}</p>
                <div class="analytics-section">
                    <h2>📊 Performance Analytics</h2>
                    <div class="chart-container">
                        <canvas id="percentileChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="classAverageChart"></canvas>
                    </div>
                </div>
            `);
            $("#evaluation").addClass("active");

            // Render graphs using data from the backend
            renderGraphs(response.percentile, response.class_average, response.student_score);
        },
        error: function(xhr, status, error) {
            $("#loading").hide();
            console.error("Error:", error);
            console.error("Server Response:", xhr.responseText);
            alert("An error occurred while submitting answers. Check the console for details.");
        }
    });
}