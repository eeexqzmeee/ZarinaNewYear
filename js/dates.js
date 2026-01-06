// === ФАЙЛ: dates.js - Управление датами ===

class DateManager {
    constructor() {
        this.dates = [
            '26 июля 2008',
            '6 января 2007',
            '7 сентября 2025',
            '28 декабря 2024'
        ];
        
        this.currentIndex = 0;
        this.dateElement = document.getElementById('currentDate');
        this.interval = 3000;
        
        this.startRotation();
    }

    startRotation() {
        setInterval(() => {
            this.changeDate();
        }, this.interval);
    }

    changeDate() {
        // Fade out с эффектом масштабирования и размытия
        this.dateElement.classList.add('fade-out');

        setTimeout(() => {
            // Смена индекса
            this.currentIndex = (this.currentIndex + 1) % this.dates.length;
            
            // Обновление контента
            this.dateElement.textContent = this.dates[this.currentIndex];
            
            // Удаление старых классов
            this.dateElement.classList.remove('fade-out');
            
            // Fade in с эффектом появления
            this.dateElement.classList.add('fade-in');
            
            // Удаление классов анимации после завершения
            setTimeout(() => {
                this.dateElement.classList.remove('fade-in');
            }, 800);
        }, 600);
    }
}

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    new DateManager();

});
