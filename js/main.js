document.addEventListener('DOMContentLoaded', () => {
    // --- Canvas Particle Mesh ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null };

        // Configuration
        const config = {
            particleColor: 'rgba(125, 125, 125, 0.6)',
            lineColor: 'rgba(125, 125, 125, 0.25)',
            particleRadius: 1.5,
            connectionRadius: 150,
            mouseRadius: 200,
            baseVelocity: 0.3,
            density: 15000 // pixels per particle
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('resize', resize);

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * config.baseVelocity;
                this.vy = (Math.random() - 0.5) * config.baseVelocity;
                this.size = Math.random() * config.particleRadius + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Boundary wrap
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.mouseRadius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (config.mouseRadius - distance) / config.mouseRadius;
                        const directionX = forceDirectionX * force * 0.5;
                        const directionY = forceDirectionY * force * 0.5;
                        
                        this.x -= directionX; 
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                ctx.fillStyle = config.particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const area = width * height;
            const particleCount = Math.floor(area / config.density);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connections
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionRadius) {
                        ctx.strokeStyle = config.lineColor;
                        ctx.lineWidth = 1 - (distance / config.connectionRadius);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        resize();
        animate();
    }

    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const text1 = "Intelligence,";
        const text2 = "Applied.";
        
        async function typeWriter() {
            await new Promise(r => setTimeout(r, 800)); // Initial delay

            // Type first line
            for (let i = 0; i < text1.length; i++) {
                typewriterElement.innerHTML += text1.charAt(i);
                await new Promise(r => setTimeout(r, 60 + Math.random() * 30));
            }
            
            // Line break
            typewriterElement.innerHTML += "<br>";
            await new Promise(r => setTimeout(r, 300));

            // Type second line
            for (let i = 0; i < text2.length; i++) {
                typewriterElement.innerHTML += text2.charAt(i);
                await new Promise(r => setTimeout(r, 60 + Math.random() * 30));
            }

            // Hide cursor
            const cursor = document.getElementById('cursor');
            if (cursor) {
                cursor.style.opacity = '0';
                setTimeout(() => cursor.style.display = 'none', 500);
            }
        }

        typeWriter();
    }
});