// === ФАЙЛ: particles.js - Анимация частиц ===

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            color: this.getRandomPinkShade()
        };
    }

    getRandomPinkShade() {
        const pinks = [
            'rgba(255, 20, 147, 0.8)',
            'rgba(255, 105, 180, 0.6)',
            'rgba(255, 182, 217, 0.5)'
        ];
        return pinks[Math.floor(Math.random() * pinks.length)];
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = particle.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    updateParticle(particle) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Интерактивность с мышью
        if (this.mouse.x && this.mouse.y) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x -= Math.cos(angle) * force * 2;
                particle.y -= Math.sin(angle) * force * 2;
            }
        }

        // Граничные условия
        if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.3;
                    this.ctx.strokeStyle = `rgba(255, 20, 147, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const particle of this.particles) {
            this.updateParticle(particle);
            this.drawParticle(particle);
        }

        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});