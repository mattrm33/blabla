document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dynamic Year Update
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Mobile Menu Toggle
    const menuBtn = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const hamburgerSpans = menuBtn.querySelectorAll('span');

    menuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        
        // Animate Hamburger
        if (isOpen) {
            hamburgerSpans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburgerSpans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            hamburgerSpans[0].style.transform = 'none';
            hamburgerSpans[1].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburgerSpans[0].style.transform = 'none';
            hamburgerSpans[1].style.transform = 'none';
        });
    });

    // 3. Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Target elements to animate
    document.querySelectorAll('.fade-in-up, .reveal-text').forEach(el => {
        observer.observe(el);
    });

    // 4. Smooth Anchor Scrolling (Fallback for Safari/Older browsers)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Account for fixed header height
                const headerOffset = 80; 
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Contact Form Handling (Simulation)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = "Message Sent!";
            btn.style.backgroundColor = "#10B981"; // Green success color
            btn.style.color = "#fff";
            
            setTimeout(() => {
                contactForm.reset();
                btn.textContent = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
            }, 3000);
        });
    }

    // 6. Pricing Interaction
    const pricingBtns = document.querySelectorAll('.pricing-card button');
    pricingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const planName = this.parentElement.querySelector('.plan-name').textContent;
            alert(`You selected the ${planName}. Proceeding to checkout for €80.`);
            // Here you would redirect to Stripe/PayPal
        });
    });
});

