/**
 * NEXUM WEDDINGS – Main JavaScript
 * Handles: Navigation, Scroll Animations, Lightbox, Horizontal Scroll,
 *          Form Submission, Preloader, Parallax Effects
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initScrollReveal();
    initLightbox();
    initHorizontalScroll();
    initContactForm();
    initHeroParallax();
    initSmoothScroll();
    initCounterAnimation();
});


/* ============================
   PRELOADER
   ============================ */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = '';
            
            // Trigger hero animation
            const hero = document.querySelector('.hero');
            if (hero) hero.classList.add('visible');
        }, 800);
    });
    
    // Fallback: remove preloader after 3s
    setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('visible');
    }, 3000);
}


/* ============================
   NAVIGATION
   ============================ */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.navbar__hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    
    // Scroll effect
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    // Hamburger toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ScrollSpy for One-Pager sections
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');
    
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 250;
            sections.forEach(section => {
                const id = section.getAttribute('id');
                const top = section.offsetTop;
                const height = section.offsetHeight;
                
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        } else if (link.getAttribute('href')?.startsWith('#')) {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, { passive: true });
    }
}


/* ============================
   SCROLL REVEAL ANIMATIONS
   ============================ */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (!reveals.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
}


/* ============================
   LIGHTBOX
   ============================ */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');
    
    let currentImages = [];
    let currentIndex = 0;
    
    // Gallery items
    document.querySelectorAll('.gallery-item[data-lightbox]').forEach(item => {
        item.addEventListener('click', () => {
            const gallery = item.closest('.gallery-grid, .gallery-grid--masonry');
            if (gallery) {
                currentImages = Array.from(gallery.querySelectorAll('.gallery-item[data-lightbox]'));
                currentIndex = currentImages.indexOf(item);
            } else {
                currentImages = [item];
                currentIndex = 0;
            }
            
            openLightbox(item.querySelector('img').src);
        });
    });
    
    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPrev() {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex].querySelector('img').src;
    }
    
    function showNext() {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex].querySelector('img').src;
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}


/* ============================
   HORIZONTAL SCROLL GALLERY
   ============================ */
function initHorizontalScroll() {
    const scrollWrappers = document.querySelectorAll('.hscroll-wrapper');
    
    scrollWrappers.forEach(wrapper => {
        let isDown = false;
        let startX;
        let scrollLeft;
        let hasMoved = false;
        
        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            hasMoved = false;
            wrapper.style.cursor = 'grabbing';
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        });
        
        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });
        
        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });
        
        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const x = e.pageX - wrapper.offsetLeft;
            if (Math.abs(x - startX) > 8) {
                hasMoved = true;
            }
            const walk = (x - startX) * 1.5;
            wrapper.scrollLeft = scrollLeft - walk;
        });

        wrapper.addEventListener('click', (e) => {
            if (hasMoved) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }, true);
    });
}


/* ============================
   CONTACT FORM
   ============================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const messageDiv = document.getElementById('formMessage');
        
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            datum: form.querySelector('#datum')?.value || '',
            telefon: form.querySelector('#telefon')?.value || '',
            leistung: form.querySelector('#leistung')?.value || '',
            nachricht: form.querySelector('#nachricht').value
        };
        
        // Validation
        if (!formData.name || !formData.email || !formData.nachricht) {
            showFormMessage(messageDiv, 'Bitte füllen Sie alle Pflichtfelder aus.', 'error');
            return;
        }
        
        // Submit
        submitBtn.textContent = 'Wird gesendet...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/kontakt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showFormMessage(messageDiv, data.message, 'success');
                form.reset();
            } else {
                showFormMessage(messageDiv, 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.', 'error');
            }
        } catch (err) {
            showFormMessage(messageDiv, 'Verbindungsfehler. Bitte versuchen Sie es später erneut.', 'error');
        }
        
        submitBtn.textContent = 'Anfrage senden';
        submitBtn.disabled = false;
    });
    
    function showFormMessage(el, message, type) {
        if (!el) return;
        el.textContent = message;
        el.className = 'form-message ' + type;
        
        setTimeout(() => {
            el.className = 'form-message';
            el.textContent = '';
        }, 5000);
    }
}


/* ============================
   HERO PARALLAX EFFECT
   ============================ */
function initHeroParallax() {
    const heroImage = document.querySelector('.hero__image');
    if (!heroImage) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
        
        if (scrolled < heroHeight) {
            const speed = 0.3;
            heroImage.style.transform = `scale(1.05) translateY(${scrolled * speed}px)`;
        }
    }, { passive: true });
}


/* ============================
   SMOOTH SCROLL
   ============================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const hash = href.startsWith('/#') ? href.substring(1) : href;
            const target = document.querySelector(hash);
            
            if (target && (window.location.pathname === '/' || !href.startsWith('/#') || document.querySelector(hash))) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                try {
                    history.pushState(null, '', hash);
                } catch (err) {}
            }
        });
    });

    // Auto scroll if hash present on load
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 400);
    }
}


/* ============================
   COUNTER ANIMATION
   ============================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat__number');
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
    
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeOut = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(easeOut * target);
            
            el.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
}
