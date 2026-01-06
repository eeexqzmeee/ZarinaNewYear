// === ФАЙЛ: smooth-scroll.js - Плавная прокрутка секций ===

class SmoothScroll {
    constructor() {
        this.sections = Array.from(document.querySelectorAll('section'));
        this.currentSection = 0;
        this.isScrolling = false;
        this.touchStartY = 0;
        this.gallerySection = document.querySelector('.gallery-section');
        this.isInGallery = false;
        this.galleryScrollTop = 0;
        
        this.init();
    }

    init() {
        this.setupWheelListener();
        this.setupTouchListeners();
        this.setupKeyboardListeners();
    }

    isGalleryFullyScrolled(direction) {
        if (!this.gallerySection) return true;
        
        const scrollTop = window.pageYOffset;
        const galleryTop = this.gallerySection.offsetTop;
        const galleryBottom = galleryTop + this.gallerySection.scrollHeight;
        const viewportBottom = scrollTop + window.innerHeight;
        
        // Проверяем, находимся ли мы в галерее
        this.isInGallery = scrollTop >= galleryTop - 100 && scrollTop < galleryBottom - window.innerHeight + 100;
        
        if (!this.isInGallery) return true;
        
        // Проверяем, достигли ли мы начала или конца галереи
        if (direction > 0) {
            // Скролл вниз - проверяем, достигли ли низа
            return viewportBottom >= galleryBottom - 50;
        } else {
            // Скролл вверх - проверяем, достигли ли верха
            return scrollTop <= galleryTop + 50;
        }
    }

    setupWheelListener() {
        let scrollTimeout;
        let accumulatedDelta = 0;
        const threshold = 100;
        
        window.addEventListener('wheel', (e) => {
            // Если мы в галерее и не достигли её границ, разрешаем обычный скролл
            if (this.isInGallery && !this.isGalleryFullyScrolled(e.deltaY)) {
                return;
            }

            e.preventDefault();
            
            if (this.isScrolling) return;
            
            accumulatedDelta += e.deltaY;
            
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                if (Math.abs(accumulatedDelta) >= threshold) {
                    const direction = accumulatedDelta > 0 ? 1 : -1;
                    this.scrollToNextSection(direction);
                }
                accumulatedDelta = 0;
            }, 50);
        }, { passive: false });
    }

    setupTouchListeners() {
        window.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const diff = this.touchStartY - touchEndY;

            // Если в галерее, проверяем границы
            const direction = diff > 0 ? 1 : -1;
            if (this.isInGallery && !this.isGalleryFullyScrolled(direction)) {
                return;
            }

            if (Math.abs(diff) > 50) {
                this.scrollToNextSection(direction);
            }
        }, { passive: true });
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            if (this.isScrolling) return;

            let direction = 0;
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                direction = 1;
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                direction = -1;
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.scrollToSection(0);
                return;
            } else if (e.key === 'End') {
                e.preventDefault();
                this.scrollToSection(this.sections.length - 1);
                return;
            }

            if (direction !== 0) {
                // Если в галерее, проверяем границы
                if (this.isInGallery && !this.isGalleryFullyScrolled(direction)) {
                    return;
                }
                this.scrollToNextSection(direction);
            }
        });
    }

    scrollToNextSection(direction) {
        const currentScroll = window.pageYOffset;
        let targetSection = null;

        if (direction > 0) {
            // Скролл вниз
            targetSection = this.sections.find(section => section.offsetTop > currentScroll + 100);
        } else {
            // Скролл вверх
            const reversed = [...this.sections].reverse();
            targetSection = reversed.find(section => section.offsetTop < currentScroll - 100);
        }

        if (targetSection) {
            const targetIndex = this.sections.indexOf(targetSection);
            this.scrollToSection(targetIndex);
        }
    }

    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length || this.isScrolling) {
            return;
        }

        this.isScrolling = true;
        this.currentSection = index;

        const targetSection = this.sections[index];
        const start = window.pageYOffset;
        const target = targetSection.offsetTop;
        const distance = target - start;
        const duration = 1200;
        let startTime = null;

        const easeInOutCubic = (t) => {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = easeInOutCubic(progress);
            window.scrollTo(0, start + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                this.isScrolling = false;
            }
        };

        requestAnimationFrame(animation);
    }
}

// Инициализация
window.addEventListener('DOMContentLoaded', () => {
    new SmoothScroll();
});