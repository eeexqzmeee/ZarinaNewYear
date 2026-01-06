// === ФАЙЛ: video.js - Видео галерея с пагинацией ===

class VideoGallery {
    constructor() {
        this.container = document.querySelector('.video-container');
        if (!this.container) return;
        
        this.grid = document.getElementById('videoGrid');
        this.isMobile = window.innerWidth <= 1024;
        this.videosPerPage = this.isMobile ? 1 : 2;
        this.totalVideos = 6;
        this.currentPage = 0;
        this.totalPages = Math.ceil(this.totalVideos / this.videosPerPage);
        this.videoFolder = 'videos/';
        this.videos = [];
        
        this.init();
    }

    init() {
        if (!this.grid) return;
        this.createNavigation();
        this.loadPage(0);
        this.setupResizeListener();
    }

    createNavigation() {
        const navigation = document.createElement('div');
        navigation.className = 'video-navigation';
        
        this.prevBtn = document.createElement('button');
        this.prevBtn.className = 'video-nav-btn';
        this.prevBtn.innerHTML = '←';
        this.prevBtn.addEventListener('click', () => this.previousPage());
        
        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'video-pagination';
        
        this.counter = document.createElement('div');
        this.counter.className = 'video-counter';
        this.updateCounter();
        
        paginationWrapper.appendChild(this.counter);
        
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.style.cssText = 'display: flex; gap: 0.8rem;';
        
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'pagination-dot';
            dot.dataset.page = i;
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
        
        paginationWrapper.appendChild(this.dotsContainer);
        
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'video-nav-btn';
        this.nextBtn.innerHTML = '→';
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        navigation.appendChild(this.prevBtn);
        navigation.appendChild(paginationWrapper);
        navigation.appendChild(this.nextBtn);
        
        this.container.appendChild(navigation);
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 1024;
                
                if (wasMobile !== this.isMobile) {
                    this.videosPerPage = this.isMobile ? 1 : 2;
                    this.totalPages = Math.ceil(this.totalVideos / this.videosPerPage);
                    this.currentPage = 0;
                    
                    this.dotsContainer.innerHTML = '';
                    for (let i = 0; i < this.totalPages; i++) {
                        const dot = document.createElement('div');
                        dot.className = 'pagination-dot';
                        dot.dataset.page = i;
                        dot.addEventListener('click', () => this.goToPage(i));
                        this.dotsContainer.appendChild(dot);
                    }
                    
                    this.loadPage(0);
                }
            }, 250);
        });
    }

    loadPage(pageIndex) {
        this.videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        
        this.currentPage = pageIndex;
        this.grid.innerHTML = '';
        this.videos = [];
        
        const startIndex = pageIndex * this.videosPerPage + 1;
        const endIndex = Math.min(startIndex + this.videosPerPage - 1, this.totalVideos);
        
        for (let i = startIndex; i <= endIndex; i++) {
            this.createVideoItem(i);
        }
        
        this.updateNavigation();
    }

    createVideoItem(index) {
        const item = document.createElement('div');
        item.className = 'video-item loading';
        
        const video = document.createElement('video');
        video.className = 'video-player';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        
        const videoPath = `${this.videoFolder}${index}.MOV`;
        
        video.addEventListener('loadeddata', () => {
            item.classList.remove('loading');
            video.play().catch(e => console.log('Autoplay prevented:', e));
        });
        
        video.addEventListener('error', () => {
            item.classList.remove('loading');
            this.createPlaceholder(item, index);
        });
        
        video.src = videoPath;
        
        item.appendChild(video);
        this.grid.appendChild(item);
        this.videos.push(video);
    }

    createPlaceholder(item, index) {
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: linear-gradient(135deg, 
                        rgba(255, 20, 147, 0.1) 0%,
                        rgba(255, 105, 180, 0.1) 100%);
            color: var(--light-pink);
        `;
        
        const icon = document.createElement('div');
        icon.style.cssText = 'font-size: 4rem; margin-bottom: 1rem;';
        icon.textContent = '▶';
        
        const text = document.createElement('div');
        text.style.cssText = 'font-size: 1.5rem; font-weight: 600;';
        text.textContent = `Видео ${index}`;
        
        placeholder.appendChild(icon);
        placeholder.appendChild(text);
        item.innerHTML = '';
        item.appendChild(placeholder);
    }

    updateNavigation() {
        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
        this.updateCounter();
        
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

window.addEventListener('DOMContentLoaded', () => {
    new VideoGallery();
});