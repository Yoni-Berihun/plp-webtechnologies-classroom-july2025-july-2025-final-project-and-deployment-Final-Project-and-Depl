/**
 * YO-coffee Website JavaScript
 * Handles navigation, form validation, animations, and accessibility features
 * Author: YO-coffee Development Team
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    // MOBILE NAVIGATION HANDLING
    // ===========================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = navLinks.classList.contains('active');
            navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }

    // ===========================================
    // FORM VALIDATION & ACCESSIBILITY
    // ===========================================
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (form && formStatus) {
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            input.addEventListener('input', () => {
                clearFieldError(input);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            // Validate all fields
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                formStatus.textContent = 'Message sent successfully! (Simulated)';
                formStatus.style.color = 'green';
                form.reset();
                // Focus management for screen readers
                formStatus.setAttribute('aria-live', 'polite');
            } else {
                formStatus.textContent = 'Please fill out all fields correctly.';
                formStatus.style.color = 'red';
                // Focus first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================
    
    /**
     * Validates a form field and shows/hides error messages
     * @param {HTMLElement} field - The form field to validate
     * @returns {boolean} - Whether the field is valid
     */
    function validateField(field) {
        const isValid = field.checkValidity();
        const errorId = field.id + '-error';
        let errorElement = document.getElementById(errorId);
        
        if (!isValid) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = errorId;
                errorElement.className = 'field-error';
                errorElement.setAttribute('role', 'alert');
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
            errorElement.textContent = field.validationMessage;
            field.setAttribute('aria-invalid', 'true');
            return false;
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            field.setAttribute('aria-invalid', 'false');
            return true;
        }
    }

    /**
     * Clears error styling and messages from a form field
     * @param {HTMLElement} field - The form field to clear
     */
    function clearFieldError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.setAttribute('aria-invalid', 'false');
    }

    // ===========================================
    // ANIMATIONS & INTERACTIVE FEATURES
    // ===========================================
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        reveals.forEach(reveal => observer.observe(reveal));
    } else {
        reveals.forEach(reveal => reveal.classList.add('active'));
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Loading animation for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
    });

    // Card hover effects with keyboard navigation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });

    // Add loading state to form submission
    if (form) {
        form.addEventListener('submit', () => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form processing
                setTimeout(() => {
                    submitBtn.textContent = 'Send';
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
});