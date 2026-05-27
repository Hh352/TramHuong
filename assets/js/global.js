/**
 * WORLD AGARWOOD - INTERACTIVE JS LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const mainHeader = document.getElementById('mainHeader');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const navItems = document.querySelectorAll('.nav-item');
    const drawerItems = document.querySelectorAll('.drawer-item');

    // 2. Scroll Event - Sticky Header Shift
    const handleScroll = () => {
        if (window.scrollY > 40) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load in case the page is already scrolled
    handleScroll();

    // 3. Mobile Menu Toggle - Open/Close Drawer
    const openMobileDrawer = () => {
        mobileToggle.classList.add('open');
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeMobileDrawer = () => {
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    mobileToggle.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
            closeMobileDrawer();
        } else {
            openMobileDrawer();
        }
    });

    drawerClose.addEventListener('click', closeMobileDrawer);
    drawerOverlay.addEventListener('click', closeMobileDrawer);

    // 4. Navigation Links Handling (Multi-Page Architecture)
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html'; // default to index.html if root

    const setActiveLinkMPA = (items) => {
        items.forEach(item => {
            // Ignore dropdown toggles
            if (item.id === 'drawerLangToggle' || item.classList.contains('dropdown-icon') || item.parentElement.classList.contains('nav-dropdown')) {
                return;
            }
            item.classList.remove('active');
            
            const href = item.getAttribute('href');
            if (href === currentFile) {
                item.classList.add('active');
            }
        });
    };

    setActiveLinkMPA(navItems);
    setActiveLinkMPA(drawerItems);

    // Mobile Drawer Items Click - Close drawer on navigation
    drawerItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Do not close drawer if clicking the language toggle
            if (item.id === 'drawerLangToggle') return;
            // Let the browser navigate, just close the drawer visually
            setTimeout(closeMobileDrawer, 50);
        });
    });

    // 6. Mobile Submenu Toggle
    const drawerLangToggle = document.getElementById('drawerLangToggle');
    if (drawerLangToggle) {
        drawerLangToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = drawerLangToggle.parentElement;
            parentLi.classList.toggle('open');
        });
    }

    // 7. Language Selection Logic (MPA)
    const applyLanguage = (selectedLang) => {
        const langItems = document.querySelectorAll('.lang-item');
        
        // Save to localStorage
        localStorage.setItem('selectedLang', selectedLang);

        // Set active class for the clicked item's group
        langItems.forEach(l => {
            if(l.getAttribute('data-lang') === selectedLang) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });
        
        // Switch images in all tab contents
        document.querySelectorAll('.lang-img').forEach(img => {
            if (img.classList.contains(selectedLang)) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
        
        // Update the main toggle flags
        const activeLangItem = document.querySelector(`.lang-item[data-lang="${selectedLang}"]`);
        if (activeLangItem) {
            const selectedFlag = activeLangItem.querySelector('img');
            if (selectedFlag) {
                const flagSrc = selectedFlag.getAttribute('src');
                const flagAlt = selectedFlag.getAttribute('alt');
                document.querySelectorAll('.current-lang-flag').forEach(img => {
                    img.setAttribute('src', flagSrc);
                    img.setAttribute('alt', flagAlt);
                });
            }
        }
        
        // Update texts based on selected language
        const textVi = selectedLang === 'vi' ? 'Tiếng Việt' : 'Vietnamese';
        const textEn = selectedLang === 'vi' ? 'Tiếng Anh' : 'English';
        
        document.querySelectorAll('.lang-item[data-lang="vi"]').forEach(viItem => {
            const img = viItem.querySelector('img');
            if (img) viItem.innerHTML = img.outerHTML + ' ' + textVi;
        });
        
        document.querySelectorAll('.lang-item[data-lang="en"]').forEach(enItem => {
            const img = enItem.querySelector('img');
            if (img) enItem.innerHTML = img.outerHTML + ' ' + textEn;
        });
    };

    // Apply saved language on page load
    const savedLang = localStorage.getItem('selectedLang') || 'vi';
    applyLanguage(savedLang);

    // Language Selection Click Event
    const langItems = document.querySelectorAll('.lang-item');
    langItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = item.getAttribute('data-lang');
            applyLanguage(selectedLang);
        });
    });

    // 8. Mobile Fancybox Integration (Single Image Only)
    document.querySelectorAll('.tab-content img').forEach(img => {
        img.addEventListener('click', () => {
            // Only activate Fancybox on mobile devices
            if (window.innerWidth <= 768) {
                const src = img.getAttribute('src');
                // Ensure image source is valid before opening
                if (src && src.trim() !== "") {
                    // Pass a single item array to disable gallery swiping
                    Fancybox.show([{ src: src, type: 'image' }]);
                }
            }
        });
    });

});
