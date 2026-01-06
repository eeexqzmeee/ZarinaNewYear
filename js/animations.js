// === ФАЙЛ: animations.js - Дополнительные анимации ===

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCardHoverEffects();
        this.addCursorFollower();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    setupCardHoverEffects() {
        const card = document.querySelector('.dates-card');
        
        if (card) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        }
    }

    addCursorFollower() {
        const follower = document.createElement('div');
        follower.className = 'cursor-follower';
        follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 20, 147, 0.3), transparent);
            pointer-events: none;
            z-index: 9999;
            transition: all 0.15s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(follower);

        document.addEventListener('mousemove', (e) => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        });
    }
}

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});