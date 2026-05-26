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

    // 4. Navigation Links Handling
    const setActiveLink = (elements, clickedElement) => {
        elements.forEach(item => {
            // Ignore dropdown toggles when clearing active class
            if (item.id !== 'drawerLangToggle' && !item.classList.contains('dropdown-icon') && !item.parentElement.classList.contains('nav-dropdown')) {
                item.classList.remove('active');
            }
        });
        clickedElement.classList.add('active');
    };

    // Helper to switch main section content
    const switchTabContent = (targetId) => {
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    };

    // Desktop Nav Items Click
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                setActiveLink(navItems, item);
                switchTabContent(href.substring(1));
            }
        });
    });

    // Mobile Drawer Items Click
    drawerItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Do not close drawer if clicking the language toggle
            if (item.id === 'drawerLangToggle') return;
            
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                setActiveLink(drawerItems, item);
                switchTabContent(href.substring(1));
            }
            
            closeMobileDrawer();
        });
    });

    // 5. Scroll Spy Effect (Optional: updates active menu link on scroll if sections exist)
    const sections = document.querySelectorAll('main, footer, section[id]');
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            if (section.id) {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollPosition >= top && scrollPosition < top + height) {
                    const id = section.getAttribute('id');
                    // Find corresponding nav link
                    navItems.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            setActiveLink(navItems, link);
                        }
                    });
                }
            }
        });
    };
    
    // We only enable scrollSpy if sections actually exist beyond the simple placeholders
    // window.addEventListener('scroll', scrollSpy);

    // 6. Mobile Submenu Toggle
    const drawerLangToggle = document.getElementById('drawerLangToggle');
    if (drawerLangToggle) {
        drawerLangToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = drawerLangToggle.parentElement;
            parentLi.classList.toggle('open');
        });
    }

    // 7. Language Selection Active State
    const langItems = document.querySelectorAll('.lang-item');
    langItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = item.getAttribute('data-lang');
            
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
            const selectedFlag = item.querySelector('img');
            if (selectedFlag) {
                const flagSrc = selectedFlag.getAttribute('src');
                const flagAlt = selectedFlag.getAttribute('alt');
                document.querySelectorAll('.current-lang-flag').forEach(img => {
                    img.setAttribute('src', flagSrc);
                    img.setAttribute('alt', flagAlt);
                });
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
            
            // Do not translate, just UI as requested
            // Close drawer if on mobile
            if (mobileDrawer.classList.contains('open')) {
                // closeMobileDrawer();
            }
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
