let maxParticleCount = 400; // set max confetti count
let particleSpeed = 2; // set the particle animation speed
export let startConfetti: () => void; // call to start confetti animation
export let stopConfetti: () => void; // call to stop adding confetti
export let toggleConfetti: () => void; // call to start or stop the confetti animation depending on whether it's already running
export let removeConfetti: () => void; // call to stop the confetti animation and remove all confetti immediately

(function () {
    interface Particle {
        color: string;
        x: number;
        y: number;
        diameter: number;
        tilt: number;
        tiltAngleIncrement: number;
        tiltAngle: number;
    }

    const colors: string[] = [
        "DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue",
        "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"
    ];
    
    let streamingConfetti = false;
    let animationTimer: number | null = null;
    let particles: Particle[] = [];
    let waveAngle = 0;

    function resetParticle(particle: Particle, width: number, height: number): Particle {
        particle.color = colors[Math.floor(Math.random() * colors.length)];
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.diameter = Math.random() * 10 + 5;
        particle.tilt = Math.random() * 10 - 10;
        particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
        particle.tiltAngle = 0;
        return particle;
    }

    function startConfettiInner(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        window.requestAnimationFrame = window.requestAnimationFrame ||
            window.requestAnimationFrame ||
            window.requestAnimationFrame ||
            window.requestAnimationFrame ||
            window.requestAnimationFrame ||
            function (callback: FrameRequestCallback): number {
                return window.setTimeout(callback, 16.6666667);
            };

        let canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement | null;

        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "confetti-canvas";
            canvas.style.position = "fixed";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.zIndex = "999999";
            canvas.style.pointerEvents = "none";
            canvas.style.display = "block";
            document.body.appendChild(canvas);
            canvas.width = width;
            canvas.height = height;

            window.addEventListener("resize", () => {
                canvas!.width = window.innerWidth;
                canvas!.height = window.innerHeight;
            }, true);
        }

        const context = canvas.getContext("2d")!;
        while (particles.length < maxParticleCount) {
            particles.push(resetParticle({} as Particle, width, height));
        }
        streamingConfetti = true;

        if (!animationTimer) {
            (function runAnimation() {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                if (particles.length === 0) {
                    animationTimer = null;
                } else {
                    updateParticles();
                    drawParticles(context);
                    animationTimer = requestAnimationFrame(runAnimation);
                }
            })();
        }

        setTimeout(() => stopConfetti(), 4000); // Stop after 4 seconds
    }

    function stopConfettiInner(): void {
        streamingConfetti = false;
    }

    function removeConfettiInner(): void {
        stopConfettiInner();
        particles = [];
    }

    function toggleConfettiInner(): void {
        if (streamingConfetti) {
            stopConfettiInner();
        } else {
            startConfettiInner();
        }
    }

    function drawParticles(context: CanvasRenderingContext2D): void {
        particles.forEach(particle => {
            context.beginPath();
            context.lineWidth = particle.diameter;
            context.strokeStyle = particle.color;
            const x = particle.x + particle.tilt;
            context.moveTo(x + particle.diameter / 2, particle.y);
            context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
            context.stroke();
        });
    }

    function updateParticles(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        waveAngle += 0.01;
        particles.forEach((particle, index) => {
            if (!streamingConfetti && particle.y < -15) {
                particle.y = height + 100;
            } else {
                particle.tiltAngle += particle.tiltAngleIncrement;
                particle.x += Math.sin(waveAngle);
                particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
                particle.tilt = Math.sin(particle.tiltAngle) * 15;
            }

            if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
                if (streamingConfetti && particles.length <= maxParticleCount) {
                    resetParticle(particle, width, height);
                } else {
                    particles.splice(index, 1);
                }
            }
        });
    }

    startConfetti = startConfettiInner;
    stopConfetti = stopConfettiInner;
    toggleConfetti = toggleConfettiInner;
    removeConfetti = removeConfettiInner;
})();


