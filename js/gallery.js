// === ФАЙЛ: gallery.js - Галерея с пагинацией ===

class Gallery {
    constructor() {
        this.grid = document.getElementById('galleryGrid');
        this.isMobile = window.innerWidth <= 768;
        this.imagesPerPage = 4;
        this.totalImages = this.isMobile ? 16 : 48;
        this.currentPage = 0;
        this.totalPages = Math.ceil(this.totalImages / this.imagesPerPage);
        this.imageFolder = 'images/gallery/';
        
        this.init();
    }

    init() {
        this.createNavigation();
        this.loadPage(0);
        this.setupResizeListener();
    }

    createNavigation() {
        const navigation = document.createElement('div');
        navigation.className = 'gallery-navigation';
        
        // Кнопка назад
        this.prevBtn = document.createElement('button');
        this.prevBtn.className = 'gallery-nav-btn';
        this.prevBtn.innerHTML = '←';
        this.prevBtn.addEventListener('click', () => this.previousPage());
        
        // Пагинация
        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'gallery-pagination';
        
        this.counter = document.createElement('div');
        this.counter.className = 'gallery-counter';
        this.updateCounter();
        
        paginationWrapper.appendChild(this.counter);
        
        // Точки пагинации (показываем максимум 10)
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.style.cssText = 'display: flex; gap: 0.8rem;';
        
        const maxDots = Math.min(this.totalPages, 10);
        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'pagination-dot';
            dot.dataset.page = i;
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
        
        paginationWrapper.appendChild(this.dotsContainer);
        
        // Кнопка вперед
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'gallery-nav-btn';
        this.nextBtn.innerHTML = '→';
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        navigation.appendChild(this.prevBtn);
        navigation.appendChild(paginationWrapper);
        navigation.appendChild(this.nextBtn);
        
        document.querySelector('.gallery-container').appendChild(navigation);
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;
                
                if (wasMobile !== this.isMobile) {
                    this.totalImages = this.isMobile ? 16 : 48;
                    this.totalPages = Math.ceil(this.totalImages / this.imagesPerPage);
                    this.currentPage = 0;
                    this.loadPage(0);
                    this.updateNavigation();
                }
            }, 250);
        });
    }

    loadPage(pageIndex) {
        this.currentPage = pageIndex;
        this.grid.innerHTML = '';
        
        const imageSize = this.isMobile ? 'small' : 'medium';
        const startIndex = pageIndex * this.imagesPerPage + 1;
        const endIndex = Math.min(startIndex + this.imagesPerPage - 1, this.totalImages);
        
        for (let i = startIndex; i <= endIndex; i++) {
            this.createGalleryItem(i, imageSize);
        }
        
        this.updateNavigation();
    }

    createGalleryItem(index, size) {
        const item = document.createElement('div');
        item.className = 'gallery-item loading';
        
        const img = document.createElement('img');
        img.className = 'gallery-image';
        img.alt = `Фото ${index}`;
        img.loading = 'lazy';
        
        const imagePath = `${this.imageFolder}${index}-${size}.webp`;
        
        img.onload = () => {
            item.classList.remove('loading');
        };
        
        img.onerror = () => {
            item.classList.remove('loading');
            this.createPlaceholder(item, index);
        };
        
        img.src = imagePath;
        item.appendChild(img);
        this.grid.appendChild(item);
    }

    createPlaceholder(item, index) {
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, 
                        rgba(255, 20, 147, 0.1) 0%,
                        rgba(255, 105, 180, 0.1) 100%);
            color: var(--light-pink);
            font-size: 3rem;
            font-weight: 800;
        `;
        placeholder.textContent = index;
        item.innerHTML = '';
        item.appendChild(placeholder);
    }

    updateNavigation() {
        // Обновляем кнопки
        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
        
        // Обновляем счетчик
        this.updateCounter();
        
        // Обновляем точки
        const dots = this.dotsContainer.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    updateCounter() {
        this.counter.textContent = `${this.currentPage + 1} / ${this.totalPages}`;
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.loadPage(this.currentPage - 1);
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.loadPage(this.currentPage + 1);
        }
    }

    goToPage(pageIndex) {
        if (pageIndex >= 0 && pageIndex < this.totalPages) {
            this.loadPage(pageIndex);
        }
    }
}

// Инициализация
window.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});