/**
 * WORLD AGARWOOD - NEWS & BLOG INTERACTIVE JS
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Category Filter and Pagination functionality removed as requested (UI-only static rendering)

    // 2. Dynamic Article Routing Simulation
    document.querySelectorAll('.read-more-btn, .widget-post-item, .featured-content a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle if clicking to detail page
            if (this.getAttribute('href') === 'chi-tiet-tin-tuc.html') {
                e.preventDefault();
                const isSidebar = this.classList.contains('widget-post-item');
                const isFeaturedMain = this.closest('.featured-card');
                
                let imgEl, titleEl, dateEl, categoryEl;
                
                if (isSidebar) {
                    imgEl = this.querySelector('img');
                    titleEl = this.querySelector('.widget-post-title');
                    dateEl = this.querySelector('.widget-post-date');
                } else if (isFeaturedMain) {
                    const cardContent = this.closest('.featured-content');
                    imgEl = this.closest('.featured-card').querySelector('img');
                    titleEl = cardContent.querySelector('.featured-title');
                    dateEl = cardContent.querySelector('.card-meta span:first-child');
                    categoryEl = this.closest('.featured-card').querySelector('.category-tag');
                } else {
                    const card = this.closest('.article-card');
                    if (card) {
                        imgEl = card.querySelector('img');
                        titleEl = card.querySelector('.card-title');
                        dateEl = card.querySelector('.card-meta span:first-child');
                        categoryEl = card.querySelector('.category-tag');
                    }
                }

                const articleData = {
                    titleVi: titleEl ? (titleEl.getAttribute('data-vi') || titleEl.textContent) : '',
                    imgSrc: imgEl ? imgEl.getAttribute('src') : '',
                    dateStr: dateEl ? dateEl.textContent.trim().replace(/^Ngày\s+/i, '') : '',
                    catVi: categoryEl ? (categoryEl.getAttribute('data-vi') || categoryEl.textContent) : 'TIN TỨC'
                };
                
                localStorage.setItem('currentArticleData', JSON.stringify(articleData));
                window.location.href = this.getAttribute('href');
            }
        });
    });

    // 3. Load article data if on detail page
    const detailContainer = document.querySelector('.article-main');
    if (detailContainer) {
        const storedData = localStorage.getItem('currentArticleData');
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                
                const mainImg = detailContainer.querySelector('.article-featured-img');
                const titleEl = detailContainer.querySelector('.article-title-text');
                const catEl = detailContainer.querySelector('.category-badge');
                const dateSpan = detailContainer.querySelector('.article-header-meta span:first-child span');

                if (mainImg && data.imgSrc) mainImg.src = data.imgSrc;
                if (titleEl && data.titleVi) {
                    titleEl.textContent = data.titleVi;
                }
                if (catEl && data.catVi) {
                    catEl.textContent = data.catVi;
                }
                if (dateSpan && data.dateStr) {
                    dateSpan.textContent = "Ngày " + data.dateStr;
                }
            } catch(e) {
                console.error("Error loading article data:", e);
            }
        }
    }

});
