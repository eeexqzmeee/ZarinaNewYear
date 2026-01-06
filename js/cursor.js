// === ФАЙЛ: cursor.js - Кастомный анимированный курсор ===

class CustomCursor {
    constructor() {
        this.cursorContainer = null;
        this.ringContainer = null;
        this.cursor = null;
        this.ring = null;
        this.cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.lastPos = { x: 0, y: 0 };
        this.velocity = 0;
        this.isMoving = false;
        this.isHovering = false;
        this.movingTimeout = null;
        this.starInterval = null;
        
        this.init();
    }

    init() {
        // Создаем контейнеры для курсора
        this.cursorContainer = document.createElement('div');
        this.cursorContainer.className = 'cursor-container';
        this.cursorContainer.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 10000; will-change: transform;';
        
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor idle';
        this.cursorContainer.appendChild(this.cursor);
        document.body.appendChild(this.cursorContainer);

        this.ringContainer = document.createElement('div');
        this.ringContainer.className = 'ring-container';
        this.ringContainer.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; will-change: transform;';
        
        this.ring = document.createElement('div');
        this.ring.className = 'cursor-ring idle';
        this.ringContainer.appendChild(this.ring);
        document.body.appendChild(this.ringContainer);

        this.setupEventListeners();
        this.animate();
    }

    setupEventListeners() {
        // Отслеживание движения мыши
        document.addEventListener('mousemove', (e) => {
            this.cursorPos.x = e.clientX;
            this.cursorPos.y = e.clientY;

            // Вычисляем скорость движения
            const dx = e.clientX - this.lastPos.x;
            const dy = e.clientY - this.lastPos.y;
            this.velocity = Math.sqrt(dx * dx + dy * dy);

            this.lastPos.x = e.clientX;
            this.lastPos.y = e.clientY;

            // Определяем состояние движения
            this.handleMovement();
        });

        // Наведение на интерактивные элементы
        this.addHoverListeners();

        // Добавляем observer для динамических элементов
        const observer = new MutationObserver(() => {
            this.addHoverListeners();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    addHoverListeners() {
        const interactiveElements = document.querySelectorAll('a, button, .dates-card, .logo, [role="button"], .heart, svg, path');
        
        interactiveElements.forEach(el => {
            if (!el.dataset.cursorListener) {
                el.dataset.cursorListener = 'true';
                el.addEventListener('mouseenter', () => this.setHoverState(true));
                el.addEventListener('mouseleave', () => this.setHoverState(false));
            }
        });
    }

    handleMovement() {
        if (this.isHovering) return;

        // Удаляем idle состояние
        this.cursor.classList.remove('idle');
        this.ring.classList.remove('idle');
        this.cursor.classList.add('moving');
        this.ring.classList.add('moving');
        this.isMoving = true;

        // Создаем трейл если скорость достаточная
        if (this.velocity > 5) {
            this.createTrail();
        }

        // Таймаут для возврата в idle
        clearTimeout(this.movingTimeout);
        this.movingTimeout = setTimeout(() => {
            if (!this.isHovering) {
                this.cursor.classList.remove('moving');
                this.ring.classList.remove('moving');
                this.cursor.classList.add('idle');
                this.ring.classList.add('idle');
                this.isMoving = false;
            }
        }, 150);
    }

    setHoverState(isHovering) {
        this.isHovering = isHovering;
        
        if (isHovering) {
            this.cursor.classList.remove('idle', 'moving');
            this.ring.classList.remove('idle', 'moving');
            this.cursor.classList.add('hovering');
            this.ring.classList.add('hovering');
            
            // Создаем звездочки при наведении
            this.starInterval = setInterval(() => {
                this.createStar();
            }, 100);
        } else {
            this.cursor.classList.remove('hovering');
            this.ring.classList.remove('hovering');
            
            clearInterval(this.starInterval);
            
            if (this.isMoving) {
                this.cursor.classList.add('moving');
                this.ring.classList.add('moving');
            } else {
                this.cursor.classList.add('idle');
                this.ring.classList.add('idle');
            }
        }
    }

    createTrail() {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = this.cursorPos.x + 'px';
        trail.style.top = this.cursorPos.y + 'px';
        document.body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 600);
    }

    createStar() {
        const star = document.createElement('div');
        star.className = 'cursor-star';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        star.style.left = this.cursorPos.x + 'px';
        star.style.top = this.cursorPos.y + 'px';
        star.style.setProperty('--tx', tx + 'px');
        star.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, 1000);
    }

    animate() {
        // Плавное следование кольца за курсором
        const lerpFactor = 0.12;
        
        this.ringPos.x += (this.cursorPos.x - this.ringPos.x) * lerpFactor;
        this.ringPos.y += (this.cursorPos.y - this.ringPos.y) * lerpFactor;

        // Применяем transform к контейнерам
        this.cursorContainer.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px)`;
        this.ringContainer.style.transform = `translate(${this.ringPos.x}px, ${this.ringPos.y}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

// Инициализация
window.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
});