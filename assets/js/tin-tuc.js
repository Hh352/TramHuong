/**
 * WORLD AGARWOOD - NEWS & BLOG INTERACTIVE JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Translation Synchronization
    const updateLanguageContent = (lang) => {
        // Update all text nodes with data-vi and data-en attributes
        document.querySelectorAll('[data-vi][data-en]').forEach(el => {
            // Keep the entire main content area (banner, sidebar categories, articles) and the header CTA button in Vietnamese
            const isNewsPageExcluded = el.closest('main') || el.closest('.header-cta');
            const translation = (isNewsPageExcluded || lang === 'vi') ? el.getAttribute('data-vi') : el.getAttribute('data-en');
            
            // Check if element has child elements (e.g. icons) to preserve, or is simple text
            const icon = el.querySelector('i');
            if (icon) {
                // If it contains an icon, replace only the text node part or rebuild
                el.innerHTML = '';
                el.appendChild(icon);
                el.appendChild(document.createTextNode(' ' + translation));
            } else {
                el.textContent = translation;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-placeholder-vi][data-placeholder-en]').forEach(el => {
            el.setAttribute('placeholder', lang === 'vi' ? el.getAttribute('data-placeholder-vi') : el.getAttribute('data-placeholder-en'));
        });
    };

    // Initialize current language
    const getSavedLang = () => localStorage.getItem('selectedLang') || 'vi';
    updateLanguageContent(getSavedLang());

    // Listen for language selector clicks (both in desktop header and mobile drawer)
    document.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', () => {
            // Small delay to ensure localStorage has been updated by global.js
            setTimeout(() => {
                updateLanguageContent(getSavedLang());
            }, 50);
        });
    });

    // 2. Category Filter and Pagination functionality removed as requested (UI-only static rendering)

    // 3. Dynamic Article Routing Simulation
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
                    titleEn: titleEl ? (titleEl.getAttribute('data-en') || titleEl.textContent) : '',
                    imgSrc: imgEl ? imgEl.getAttribute('src') : '',
                    dateStr: dateEl ? dateEl.textContent.trim().replace(/^Ngày\s+/i, '') : '',
                    catVi: categoryEl ? (categoryEl.getAttribute('data-vi') || categoryEl.textContent) : 'TIN TỨC',
                    catEn: categoryEl ? (categoryEl.getAttribute('data-en') || categoryEl.textContent) : 'NEWS'
                };
                
                localStorage.setItem('currentArticleData', JSON.stringify(articleData));
                window.location.href = this.getAttribute('href');
            }
        });
    });

    // 4. Load article data if on detail page
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
                    titleEl.setAttribute('data-vi', data.titleVi);
                    titleEl.setAttribute('data-en', data.titleEn);
                    titleEl.textContent = getSavedLang() === 'vi' ? data.titleVi : data.titleEn;
                }
                if (catEl && data.catVi) {
                    catEl.setAttribute('data-vi', data.catVi);
                    catEl.setAttribute('data-en', data.catEn);
                    catEl.textContent = getSavedLang() === 'vi' ? data.catVi : data.catEn;
                }
                if (dateSpan && data.dateStr) {
                    const viDate = "Ngày " + data.dateStr;
                    const enDate = data.dateStr;
                    dateSpan.setAttribute('data-vi', viDate);
                    dateSpan.setAttribute('data-en', enDate);
                    dateSpan.textContent = getSavedLang() === 'vi' ? viDate : enDate;
                }
            } catch(e) {
                console.error("Error loading article data:", e);
            }
        }
    }

});
