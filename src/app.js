import { CONFIG } from './config.js';

class NewsAggregator {
    constructor() {
        this.newsGrid = document.getElementById('news-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        this.articles = [];
        this.isLoading = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.fetchNews();
    }

    setupEventListeners() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.updateFilter(category, btn);
            });
        });
    }

    updateFilter(category, activeBtn) {
        this.currentFilter = category;
        
        // Update UI
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');

        this.renderArticles();
    }

    async fetchNews() {
        if (CONFIG.API_KEY === 'YOUR_NEWS_API_KEY') {
            this.renderError('Please add your NewsAPI.org API key in <code>src/config.js</code> to see live news.');
            this.isLoading = false;
            return;
        }

        this.isLoading = true;
        this.renderSkeletons();

        try {
            // NewsAPI search query
            const query = CONFIG.KEYWORDS.join(' OR ');
            const url = `${CONFIG.API_BASE_URL}?q=${encodeURIComponent(query)}&pageSize=${CONFIG.ARTICLES_LIMIT}&sortBy=publishedAt&apiKey=${CONFIG.API_KEY}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch news. Please check your API key.');
            }

            const data = await response.json();
            
            if (data.status === 'error') {
                throw new Error(data.message || 'API Error');
            }

            this.articles = data.articles || [];
            this.isLoading = false;
            this.renderArticles();

        } catch (error) {
            console.error('Error fetching news:', error);
            this.renderError(error.message);
            this.isLoading = false;
        }
    }

    getCategoryFromContent(article) {
        const text = (article.title + ' ' + article.description).toLowerCase();
        if (text.includes('laravel')) return 'laravel';
        if (text.includes('javascript') || text.includes('js')) return 'javascript';
        if (text.includes('ai') || text.includes('intelligence') || text.includes('gpt')) return 'ai';
        return 'general';
    }

    renderSkeletons() {
        this.newsGrid.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card skeleton';
            this.newsGrid.appendChild(skeleton);
        }
    }

    renderError(message) {
        this.newsGrid.innerHTML = `
            <div class="error-container">
                <h2>Ouch! Something went wrong</h2>
                <p>${message}</p>
                <button class="retry-btn" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }

    renderArticles() {
        const filtered = this.currentFilter === 'all' 
            ? this.articles 
            : this.articles.filter(article => {
                const cat = this.getCategoryFromContent(article);
                return cat === this.currentFilter;
            });

        if (filtered.length === 0 && !this.isLoading) {
            this.newsGrid.innerHTML = `
                <div class="error-container">
                    <h2>No articles found</h2>
                    <p>Try refreshing or selecting a different category.</p>
                </div>
            `;
            return;
        }

        this.newsGrid.innerHTML = '';
        
        filtered.forEach((article, index) => {
            // Add ad every 5 items
            if (index > 0 && index % 5 === 0) {
                const ad = document.createElement('div');
                ad.className = 'in-grid-ad';
                ad.innerHTML = `<span>Sponsor Advertisement Showcase</span>`;
                this.newsGrid.appendChild(ad);
            }

            const category = this.getCategoryFromContent(article);
            const isDark = index % 2 !== 0; // Alternate dark/white

            const card = document.createElement('article');
            card.className = `news-card ${isDark ? 'dark-card' : ''}`;
            card.innerHTML = `
                <img src="${article.urlToImage || 'https://via.placeholder.com/400x220?text=News+Thumbnail'}" 
                     alt="${article.title}" 
                     class="card-image"
                     onerror="this.src='https://via.placeholder.com/400x220?text=No+Image'">
                <div class="card-content">
                    <span class="category-badge badge-${category}">${category}</span>
                    <h3 class="card-title">${article.title}</h3>
                    <p class="card-description">${article.description || 'Click to read the full story on the original website.'}</p>
                    <div class="card-footer">
                        <div class="author-info">
                            <span>${article.author || 'TechPulse Staff'}</span>
                        </div>
                        <span class="read-more">Read Story &rarr;</span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                window.open(article.url, '_blank');
            });

            this.newsGrid.appendChild(card);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NewsAggregator();
});
