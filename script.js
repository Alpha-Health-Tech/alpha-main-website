// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = () => motionPreference.matches;
    const watchMotionPreference = (callback) => {
        if (motionPreference.addEventListener) {
            motionPreference.addEventListener('change', callback);
        } else if (motionPreference.addListener) {
            motionPreference.addListener(callback);
        }
    };

    if (hamburger && navMenu) {
        const navLinks = navMenu.querySelectorAll('.nav-link');
        const closeNav = () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        };

        hamburger.setAttribute('aria-expanded', 'false');

        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isActive));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeNav();
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                closeNav();
            }
        });
    }

    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({
                    behavior: isReducedMotion() ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header state on scroll
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        const handleScroll = () => {
            if (window.scrollY > 16) {
                siteHeader.setAttribute('data-scrolled', 'true');
            } else {
                siteHeader.removeAttribute('data-scrolled');
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
    }

    // Lazy Loading for Images
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // If image has src already (for immediate loading), just add loaded class
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    // Wait for image to load
                    img.addEventListener('load', function() {
                        img.classList.add('loaded');
                    });
                    
                    // Trigger load if not already loading
                    if (!img.src && img.dataset.src) {
                        img.src = img.dataset.src;
                    } else if (img.src) {
                        // Image has src but hasn't loaded yet, just ensure class is added
                        setTimeout(() => {
                            img.classList.add('loaded');
                        }, 100);
                    }
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Parallax Scrolling for Hero Sections
    const parallaxSections = Array.from(document.querySelectorAll('[data-parallax="true"]'));
    let parallaxScrollHandler = null;
    let parallaxTicking = false;

    const resetParallaxTransforms = () => {
        parallaxSections.forEach(section => {
            const imageContainer = section.querySelector('.hero__media, .hero-image-container, .hero-image');
            if (imageContainer) {
                imageContainer.style.transform = '';
            }
        });
    };

    const performParallaxStep = () => {
        const scrolled = window.pageYOffset;
        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const imageContainer = section.querySelector('.hero__media, .hero-image-container, .hero-image');
                if (imageContainer) {
                    const speed = 0.5;
                    const yPos = -(scrolled * speed);
                    imageContainer.style.transform = `translateY(${yPos}px)`;
                }
            }
        });
        parallaxTicking = false;
    };

    const scheduleParallax = () => {
        if (!parallaxTicking) {
            window.requestAnimationFrame(performParallaxStep);
            parallaxTicking = true;
        }
    };

    const teardownParallax = () => {
        if (parallaxScrollHandler) {
            window.removeEventListener('scroll', parallaxScrollHandler);
            parallaxScrollHandler = null;
        }
        parallaxTicking = false;
        resetParallaxTransforms();
    };

    const setupParallax = () => {
        if (parallaxSections.length === 0 || isReducedMotion()) {
            teardownParallax();
            return;
        }

        teardownParallax();
        parallaxScrollHandler = () => scheduleParallax();
        window.addEventListener('scroll', parallaxScrollHandler, { passive: true });
        scheduleParallax();
    };

    setupParallax();
    watchMotionPreference((event) => {
        if (event.matches) {
            teardownParallax();
        } else {
            setupParallax();
        }
    });

    // Fade-in Animation on Scroll
    const animateElements = Array.from(document.querySelectorAll(
        '.feature-card-modern, .service-card, .marketing-card, ' +
        '.solution-card, .challenge-item, .value-card-modern, ' +
        '.benefit-item, .contact-info-card'
    ));
    let fadeObserver = null;

    const teardownFadeObserver = () => {
        if (fadeObserver) {
            fadeObserver.disconnect();
            fadeObserver = null;
        }
        animateElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = '';
        });
    };

    const setupFadeObserver = () => {
        if (animateElements.length === 0 || isReducedMotion()) {
            teardownFadeObserver();
            return;
        }

        teardownFadeObserver();

        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    if (fadeObserver) {
                        fadeObserver.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            fadeObserver.observe(el);
        });
    };

    if (isReducedMotion()) {
        teardownFadeObserver();
    } else {
        setupFadeObserver();
    }

    watchMotionPreference((event) => {
        if (event.matches) {
            teardownFadeObserver();
        } else {
            setupFadeObserver();
        }
    });

    // Stats count-up animation
    const statCounters = document.querySelectorAll('.stat-card strong');
    if (statCounters.length) {
        const animateCounter = (el) => {
            if (el.dataset.countAnimated === 'true') {
                return;
            }

            const targetValue = parseFloat(el.dataset.countTarget || '0');
            if (!targetValue) {
                el.dataset.countAnimated = 'true';
                el.textContent = el.dataset.countOriginal || el.textContent;
                return;
            }

            const prefix = el.dataset.countPrefix || '';
            const suffix = el.dataset.countSuffix || '';
            const decimals = parseInt(el.dataset.countDecimals || '0', 10);
            const formatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });

            const startTime = performance.now();
            const duration = 1600;

            const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = targetValue * eased;
                const formattedNumber = formatter.format(
                    decimals > 0 ? parseFloat(currentValue.toFixed(decimals)) : Math.round(currentValue)
                );

                el.textContent = `${prefix}${formattedNumber}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.dataset.countAnimated = 'true';
                }
            };

            requestAnimationFrame(step);
        };

        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.55,
            rootMargin: '0px 0px -15% 0px'
        });

        const prepareCounter = (el) => {
            const original = el.textContent.trim();
            if (!el.dataset.countOriginal) {
                el.dataset.countOriginal = original;
            }

            if (el.dataset.countAnimated === 'true') {
                return;
            }

            const match = original.match(/[\d,.]+/);
            if (!match) {
                el.dataset.countAnimated = 'true';
                return;
            }

            const numericPart = match[0];
            const matchIndex = typeof match.index === 'number' ? match.index : original.indexOf(numericPart);
            const prefix = original.slice(0, matchIndex);
            const suffix = original.slice(matchIndex + numericPart.length);
            const targetValue = parseFloat(numericPart.replace(/,/g, ''));
            if (!targetValue) {
                el.dataset.countAnimated = 'true';
                el.textContent = original;
                return;
            }

            const decimals = (numericPart.split('.')[1] || '').length;

            el.dataset.countPrefix = prefix;
            el.dataset.countSuffix = suffix;
            el.dataset.countTarget = targetValue.toString();
            el.dataset.countDecimals = decimals.toString();
            el.textContent = `${prefix}${decimals ? Number(0).toFixed(decimals) : '0'}${suffix}`;

            statObserver.observe(el);
        };

        const startCounters = () => {
            if (isReducedMotion()) {
                statCounters.forEach(el => {
                    if (!el.dataset.countOriginal) {
                        el.dataset.countOriginal = el.textContent.trim();
                    }
                });
                return;
            }

            statCounters.forEach(el => {
                if (el.dataset.countAnimated === 'true') {
                    return;
                }
                prepareCounter(el);
            });
        };

        const resetCounters = () => {
            statObserver.disconnect();
            statCounters.forEach(el => {
                if (!el.dataset.countOriginal) {
                    el.dataset.countOriginal = el.textContent.trim();
                }
                el.textContent = el.dataset.countOriginal;
                delete el.dataset.countAnimated;
            });
        };

        startCounters();

        const handleMotionChange = (event) => {
            if (event.matches) {
                resetCounters();
            } else {
                startCounters();
            }
        };

        watchMotionPreference(handleMotionChange);
    }

    // Image Hover Effects
    const imageContainers = document.querySelectorAll('.service-image, .solution-image-half, .story-image');
    imageContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.05)';
            }
        });
        
        container.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });

    // Form submission handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Show success message (in production, this would send to a backend)
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Smooth reveal for hero content
    const heroContent = document.querySelector('.hero-content-overlay');
    if (heroContent) {
        const revealHero = () => {
            if (isReducedMotion()) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'none';
                heroContent.style.transition = 'none';
                return;
            }

            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(20px)';
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';

            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        };

        revealHero();
        watchMotionPreference(revealHero);
    }

    // Add loading class to images immediately for fade-in effect
    setTimeout(() => {
        lazyImages.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            }
        });
    }, 100);

    // Performance: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to parallax scroll if needed for performance
    const debouncedScroll = debounce(() => {
        // Additional scroll handling if needed
    }, 10);

    window.addEventListener('scroll', debouncedScroll);
});