
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

$(window).on('beforeunload', function() {
    $(window).scrollTop(0);
});

$(document).ready(function() {
    document.body.classList.add('motion-ready');

    const navbarCollapse = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const bootstrapCollapse = navbarCollapse && window.bootstrap?.Collapse
        ? bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false })
        : null;

    const syncNavbarToggleState = (isExpanded) => {
        if (!navbarToggler) {
            return;
        }

        navbarToggler.setAttribute('aria-expanded', String(isExpanded));
    };

    if (navbarCollapse && navbarToggler) {
        if (!bootstrapCollapse) {
            navbarToggler.addEventListener('click', function() {
                const isExpanded = navbarCollapse.classList.toggle('show');
                syncNavbarToggleState(isExpanded);
            });
        }

        navbarCollapse.addEventListener('shown.bs.collapse', function() {
            syncNavbarToggleState(true);
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            syncNavbarToggleState(false);
        });
    }

    window.scrollTo(0, 0);
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    const revealSection = (section) => {
        const delay = parseFloat(section.dataset.sectionDelay || 0);
        window.setTimeout(() => {
            section.classList.add('section-visible');
        }, delay * 1000);
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            revealSection(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.animated-section').forEach((section, index) => {
        if (index === 0) {
            revealSection(section);
            return;
        }

        sectionObserver.observe(section);
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    $('a.nav-link, a.btn-hero, a.btn-book-now').on('click', function(event) {
        if (this.hash !== '') {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 70
            }, 800);

            if (window.innerWidth < 992 && navbarCollapse?.classList.contains('show')) {
                if (bootstrapCollapse) {
                    bootstrapCollapse.hide();
                } else {
                    navbarCollapse.classList.remove('show');
                    syncNavbarToggleState(false);
                }
            }
        }
    });

    $('form').on('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! Our team will contact you soon.');
        $(this).trigger('reset');
    });

    $('.service-card, .feature-card').hover(function() {
        $(this).find('img, .feature-icon-wrapper').css({
            'transition': 'all 0.3s ease',
            'transform': 'scale(1.05)'
        });
    }, function() {
        $(this).find('img, .feature-icon-wrapper').css({
            'transform': 'scale(1)'
        });
    });

    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).find('.custom-card-style').addClass('show-card');
            } else {
                $(entry.target).find('.custom-card-style').removeClass('show-card');
            }
        });
    }, { threshold: 0.15 });

    const serviceContainer = document.querySelector('.custom-services-row');
    if (serviceContainer) {
        serviceObserver.observe(serviceContainer);
    }

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                const delay = parseFloat(el.dataset.animDelay || el.dataset.animdelay || 0);
                setTimeout(() => {
                    el.classList.add('in-view');
                    el.classList.add('animate__animated');
                }, delay * 1000);
            } else {
                el.classList.remove('in-view');
                el.classList.remove('animate__animated');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-anim], .scroll-animate').forEach(el => {
        animObserver.observe(el);
    });

    let currentSlide = 0;
    const testimonialContainer = $('.testi-carousel-container');
    const testimonialViewport = $('.testi-carousel-viewport');
    const testimonialTrack = $('.testi-carousel');
    const cards = testimonialTrack.find('.testi-card');
    const totalSlides = cards.length;
    const paginationContainer = $('.testi-pagination');
    let autoPlayInterval;

    if (testimonialTrack.length && testimonialViewport.length && totalSlides > 0) {
        paginationContainer.empty();
        for (let i = 0; i < totalSlides; i++) {
            paginationContainer.append(`<button type="button" class="testi-line ${i === 0 ? 'active' : ''}" aria-label="Go to testimonial ${i + 1}"></button>`);
        }

        const lines = $('.testi-pagination .testi-line');

        function getTrackOffset(index) {
            const activeCard = cards.get(index);
            if (!activeCard) {
                return 0;
            }

            const viewportWidth = testimonialViewport.innerWidth();
            const trackWidth = testimonialTrack[0].scrollWidth;
            
            // Calculate offset to center the specific card
            let targetOffset = (viewportWidth / 2) - (activeCard.offsetLeft + (activeCard.offsetWidth / 2));
            
            // Constrain within track bounds
            const minOffset = viewportWidth - trackWidth;
            
            return Math.max(minOffset, Math.min(0, targetOffset));
        }

        function updateCarousel(animate = true) {
            if (!cards.get(currentSlide)) {
                return;
            }

            const targetOffset = getTrackOffset(currentSlide);

            testimonialTrack.css({
                'transform': `translateX(${targetOffset}px)`,
                'transition': animate ? 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
            });

            cards.removeClass('active-card');
            lines.removeClass('active');

            cards.eq(currentSlide).addClass('active-card');
            lines.eq(currentSlide).addClass('active');
        }

        function goToSlide(index) {
            currentSlide = (index + totalSlides) % totalSlides;
            updateCarousel();
        }

        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(function() {
                goToSlide(currentSlide + 1);
            }, 3800);
        }

        function resetAutoPlay() {
            startAutoPlay();
        }

        $('.next-btn').on('click', function() {
            goToSlide(currentSlide + 1);
            resetAutoPlay();
        });

        $('.prev-btn').on('click', function() {
            goToSlide(currentSlide - 1);
            resetAutoPlay();
        });

        lines.on('click', function() {
            goToSlide($(this).index());
            resetAutoPlay();
        });

        testimonialContainer.on('mouseenter focusin', function() {
            clearInterval(autoPlayInterval);
        }).on('mouseleave focusout', function() {
            startAutoPlay();
        });

        $(window).on('resize', function() {
            updateCarousel(false);
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialContainer.on('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        testimonialContainer.on('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe Left -> Next
                goToSlide(currentSlide + 1);
                resetAutoPlay();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe Right -> Prev
                goToSlide(currentSlide - 1);
                resetAutoPlay();
            }
        }

        updateCarousel(false);
        startAutoPlay();
    }
});
