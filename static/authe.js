document.addEventListener("DOMContentLoaded", function () {
    // Firebase configuration - Replace with your own config
    const firebaseConfig = {
        apiKey: "AIzaSyAciriJZH-nXszZVznWXDEAWZJQh4-qFTs",
        authDomain: "edu-sphere-46faa.firebaseapp.com",
        projectId: "edu-sphere-46faa",
        storageBucket: "edu-sphere-46faa.firebasestorage.app",
        messagingSenderId: "1085764621488",
        appId: "1:1085764621488:web:dbb690e8ee0306e83a1775"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // DOM Elements
    const authCard = document.getElementById("authCard");
    const toggleBtns = document.querySelectorAll(".toggle-btn");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const errorMessage = document.getElementById("error-message");
    const starsContainer = document.getElementById("starsContainer");

    // Toggle between sign in and sign up
    toggleBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            authCard.classList.toggle("flipped");
            errorMessage.textContent = '';
            errorMessage.classList.remove('active');
        });
    });

    // Sign In
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Add loading state to button
        const button = loginForm.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Signing In...';
        button.disabled = true;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Redirect to dashboard on successful login
                window.location.href = '/upload';
            })
            .catch((error) => {
                showError(error.message);
                button.textContent = originalText;
                button.disabled = false;
            });
    });

    // Sign Up
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        // Add loading state to button
        const button = signupForm.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Creating Account...';
        button.disabled = true;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Redirect to dashboard on successful signup
                window.location.href = '/upload';
            })
            .catch((error) => {
                showError(error.message);
                button.textContent = originalText;
                button.disabled = false;
            });
    });

    // Show error message with animation
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('active');
        setTimeout(() => {
            errorMessage.classList.remove('active');
        }, 5000);
    }

    // Dynamic Stars Background
    function initializeStars() {
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

        // Generate comets at intervals
        setInterval(createComet, 8000);
        // Create initial comets
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createComet(), i * 1500);
        }
    }

    function createComet() {
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
    initializeStars();

    // Enhance form input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Additionally, add window resize event to reinitialize stars for responsiveness
    window.addEventListener('resize', initializeStars);
});