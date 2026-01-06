// === ФАЙЛ: preloader.js - Прелоадер и музыка ===

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('mainContent');
    const startBtn = document.getElementById('startBtn');
    const music = document.getElementById('backgroundMusic');
    
    console.log('Preloader script loaded');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('Start button clicked');
            
            // Запускаем музыку
            if (music) {
                music.volume = 0.3;
                music.play().catch(e => console.log('Audio play failed:', e));
            }

            // Скрываем прелоадер
            if (preloader) {
                preloader.classList.add('hidden');
            }

            // Показываем основной контент
            if (mainContent) {
                mainContent.style.display = 'block';
                setTimeout(() => {
                    mainContent.classList.add('visible');
                }, 50);
            }

            // Удаляем прелоадер из DOM
            setTimeout(() => {
                if (preloader && preloader.parentNode) {
                    preloader.remove();
                }
            }, 1000);
        });
    }
});