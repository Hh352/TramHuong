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
            item.classList.remove('active');
        });
        clickedElement.classList.add('active');
    };

    // Desktop Nav Items Click
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // If it is just an anchor placeholder, prevent default to avoid page jump
            if (item.getAttribute('href').startsWith('#')) {
                // Keep default behavior for testing transitions, but can intercept if needed
            }
            setActiveLink(navItems, item);
        });
    });

    // Mobile Drawer Items Click
    drawerItems.forEach(item => {
        item.addEventListener('click', (e) => {
            setActiveLink(drawerItems, item);
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
});
