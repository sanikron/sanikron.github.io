document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    initWebGLBackground();
    initCarousel();
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We\'ll get back to you soon.');
            this.reset();
        });
    }

    const waitlistForm = document.querySelector('form[action*="waitlist"]');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thanks for joining the waitlist! We'll be in touch at ${email}.`);
            this.reset();
        });
    }
});

function initCarousel() {
    const cards = ['#card-1', '#card-2', '#card-3'];
    let currentIndex = 0;
    let slideInterval;
    const slideDuration = 5000;

    function showSlide(index) {
        cards.forEach(card => {
            document.querySelector(card).style.opacity = '0';
        });
        
        document.querySelector(cards[index]).style.opacity = '1';
        
        document.querySelectorAll('.dot-btn').forEach((dot, i) => {
            dot.classList.toggle('bg-blue-600', i === index);
            dot.classList.toggle('bg-gray-300', i !== index);
        });
        
        currentIndex = index;
    }

    function nextSlide() {
        const newIndex = (currentIndex + 1) % cards.length;
        showSlide(newIndex);
    }

    function startAutoSlide() {
        stopAutoSlide();
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    document.querySelectorAll('.dot-btn').forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    const carousel = document.querySelector('.relative.w-full.h-96');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
}

function initWebGLBackground() {
    console.log('Initializing dot animation background...');
    const container = document.getElementById('webgl-background');
    
    if (!container) {
        console.error('Background container not found!');
        return;
    }

    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        container.innerHTML = '';
        container.appendChild(canvas);
        
        function resizeCanvas() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        
        resizeCanvas();
        
        const dots = [];
        const dotCount = Math.floor((canvas.width * canvas.height) / 5000);
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
        
        class Dot {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.originalX = this.x;
                this.originalY = this.y;
                this.angle = Math.random() * Math.PI * 2;
                this.radius = Math.random() * 50 + 20;
            }
            
            update() {
                // Move in a small circular motion around original position
                this.angle += 0.005;
                this.x = this.originalX + Math.cos(this.angle) * this.radius;
                this.y = this.originalY + Math.sin(this.angle) * this.radius;
                
                // Keep dots within canvas
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                
                for (let dot of dots) {
                    const dx = this.x - dot.x;
                    const dy = this.y - dot.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance/100})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(dot.x, dot.y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        for (let i = 0; i < dotCount; i++) {
            dots.push(new Dot());
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let dot of dots) {
                dot.update();
                dot.draw();
            }
            
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            dots.length = 0;
            for (let i = 0; i < dotCount; i++) {
                dots.push(new Dot());
            }
        });
        
        animate();
        console.log('Dot animation background initialized');
        
    } catch (error) {
        console.error('Error initializing dot animation:', error);
    }
}

