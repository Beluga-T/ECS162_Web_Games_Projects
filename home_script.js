document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars = []; //stars array
    const seed = 3.1415926; // Seed for the random generator

    function SeedRandom(seed) {
        return function () {
            var x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
    }
    const starCanvas = document.getElementById('starCanvas');

    function adjustCanvasHeight() {
        // Set the canvas height to the full document height
        starCanvas.style.height = `${document.documentElement.scrollHeight + 200}px`;
    }

    // Adjust the canvas size on load
    adjustCanvasHeight();

    // Adjust the canvas size whenever the window resizes
    window.onresize = adjustCanvasHeight;
    function initStars() {
        const random = SeedRandom(seed);  // Use the seeded random generator here
        stars = []; // clear the stars array
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: random() * canvas.width,
                y: random() * canvas.height,
                size: random() * 2,
                speed: random() * 0.3 + 0.1
            });
        }
    }

    function moveStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let star of stars) {
            star.y -= star.speed;
            if (star.y < 0) {
                star.y = canvas.height;
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
        }
        requestAnimationFrame(moveStars);
    }

    initStars();
    moveStars();

    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars(); // Reset stars on resize
    };
});
