/* Alpha Health Tech — shared site behaviour */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* Hamburger toggle */
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');

    function closeMenu() {
        if (!hamburger || !navMenu) {
            return;
        }
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            var isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navMenu.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                closeMenu();
            }
        });

        window.addEventListener('resize', function () {
            if (window.matchMedia('(min-width: 64rem)').matches) {
                closeMenu();
            }
        });
    }

    /* Sticky-header scroll state */
    var header = document.querySelector('.site-header');

    function updateHeaderState() {
        if (window.scrollY > 8) {
            header.setAttribute('data-scrolled', '');
        } else {
            header.removeAttribute('data-scrolled');
        }
    }

    if (header) {
        window.addEventListener('scroll', updateHeaderState, { passive: true });
        updateHeaderState();
    }

    /* Smooth anchor scrolling, honouring reduced-motion preference */
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.addEventListener('click', function (event) {
        var link = event.target.closest('a[href^="#"]');
        if (!link) {
            return;
        }
        var id = link.getAttribute('href').slice(1);
        if (!id) {
            return;
        }
        var target = document.getElementById(id);
        if (!target) {
            return;
        }
        event.preventDefault();
        target.scrollIntoView({
            behavior: reduceMotion.matches ? 'auto' : 'smooth',
            block: 'start'
        });
        if (target.tabIndex < 0) {
            target.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: true });
    });

    /* Contact form: composes an email until the Zoho Forms embed replaces it */
    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var status = form.querySelector('.form__status');
            var name = form.querySelector('#cf-name').value.trim();
            var org = form.querySelector('#cf-org').value.trim();
            var email = form.querySelector('#cf-email').value.trim();
            var phone = form.querySelector('#cf-phone').value.trim();
            var message = form.querySelector('#cf-message').value.trim();
            if (!name || !email || !message) {
                if (status) {
                    status.textContent = 'Please fill in your name, email and message.';
                    status.classList.add('is-error');
                    status.classList.remove('is-success');
                }
                return;
            }
            var body = 'Name: ' + name + '\n' +
                (org ? 'Pharmacy or clinic: ' + org + '\n' : '') +
                'Email: ' + email + '\n' +
                (phone ? 'Phone: ' + phone + '\n' : '') +
                '\n' + message;
            var subject = 'Website enquiry from ' + name + (org ? ' (' + org + ')' : '');
            window.location.href = 'mailto:hello@alphahealthtech.co.uk?subject=' +
                encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            if (status) {
                status.textContent = 'Opening your email app — or write to hello@alphahealthtech.co.uk directly.';
                status.classList.add('is-success');
                status.classList.remove('is-error');
            }
        });
    }
});
