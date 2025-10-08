/* =============================================================================
   MODERN FOTOSENTEZ WEBSITE - MAIN JAVASCRIPT
   ============================================================================= */

// =============================================================================
// GLOBAL VARIABLES & STATE
// =============================================================================

let currentTimelineStep = 1;
let isAutoPlaying = false;
let fabMenuOpen = false;
let darkTheme = false;

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingScreen();
    initializeNavigation();
    initializeThemeToggle();
    initializeScrollEffects();
    initializeCounterAnimations();
    initializeTypingEffect();
    initializeTimelineInteraction();
    initializeFAB();
    initializeParticleEffects();
});

// =============================================================================
// LOADING SCREEN
// =============================================================================

function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
    }, 3000);
}

// =============================================================================
// NAVIGATION
// =============================================================================

function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navbar scroll effects
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active navigation link based on scroll position
        updateActiveNavLink();
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

function updateActiveNavLink() {
    const sections = ['home', 'light-reactions', 'calvin-cycle', 'comparison', 'team'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                navLinks.forEach(link => link.classList.remove('active'));
                const targetLink = document.querySelector(`[href="#${sectionId}"]`);
                if (targetLink) {
                    targetLink.classList.add('active');
                }
            }
        }
    });
}

// =============================================================================
// THEME TOGGLE
// =============================================================================

function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        darkTheme = savedTheme === 'dark';
        applyTheme();
    }

    themeToggle.addEventListener('click', function() {
        darkTheme = !darkTheme;
        applyTheme();
        
        // Save theme preference
        localStorage.setItem('theme', darkTheme ? 'dark' : 'light');
        
        // Add rotation animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });

    function applyTheme() {
        if (darkTheme) {
            document.body.classList.add('dark-theme');
            themeIcon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('dark-theme');
            themeIcon.className = 'fas fa-moon';
        }
    }
}

// =============================================================================
// SCROLL EFFECTS
// =============================================================================

function initializeScrollEffects() {
    // Smooth scroll for navigation links
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

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stat-item, .timeline-step, .molecule-group').forEach(el => {
        observer.observe(el);
    });
}

// =============================================================================
// COUNTER ANIMATIONS
// =============================================================================

function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    };

    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// =============================================================================
// TYPING EFFECT
// =============================================================================

function initializeTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const text = element.getAttribute('data-text');
        element.textContent = '';
        let index = 0;

        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 100);
            }
        };

        // Start typing when element is visible
        const typingObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeChar, 1000);
                    typingObserver.unobserve(entry.target);
                }
            });
        });

        typingObserver.observe(element);
    });
}

// =============================================================================
// TIMELINE INTERACTION
// =============================================================================

function initializeTimelineInteraction() {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    timelineSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            setTimelineStep(index + 1);
        });
    });

    // Initialize first step
    updateTimelineProgress();
}

function setTimelineStep(step) {
    currentTimelineStep = step;
    
    const timelineSteps = document.querySelectorAll('.timeline-step');
    timelineSteps.forEach((stepEl, index) => {
        if (index + 1 <= step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
    
    updateTimelineProgress();
}

function updateTimelineProgress() {
    const progress = document.getElementById('timeline-progress');
    if (progress) {
        const percentage = (currentTimelineStep - 1) * 33.33;
        progress.style.width = `${percentage}%`;
    }
}

function nextStep() {
    if (currentTimelineStep < 4) {
        setTimelineStep(currentTimelineStep + 1);
    }
}

function previousStep() {
    if (currentTimelineStep > 1) {
        setTimelineStep(currentTimelineStep - 1);
    }
}

function autoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
        return;
    }

    isAutoPlaying = true;
    const autoPlayBtn = document.querySelector('.btn-primary[onclick="autoPlay()"]');
    if (autoPlayBtn) {
        autoPlayBtn.innerHTML = '<i class="fas fa-pause"></i> Durdur';
    }

    const autoPlayInterval = setInterval(() => {
        if (currentTimelineStep >= 4) {
            setTimelineStep(1);
        } else {
            nextStep();
        }
    }, 3000);

    // Store interval ID for cleanup
    window.autoPlayInterval = autoPlayInterval;
}

function stopAutoPlay() {
    isAutoPlaying = false;
    const autoPlayBtn = document.querySelector('.btn-primary[onclick="autoPlay()"]');
    if (autoPlayBtn) {
        autoPlayBtn.innerHTML = '<i class="fas fa-play"></i> Otomatik Oynat';
    }

    if (window.autoPlayInterval) {
        clearInterval(window.autoPlayInterval);
    }
}

// =============================================================================
// EQUATION ANIMATIONS
// =============================================================================

function animateEquation() {
    const moleculeGroups = document.querySelectorAll('.molecule-group');
    
    // Reset animation
    moleculeGroups.forEach(group => {
        group.style.animation = 'none';
        group.offsetHeight; // Trigger reflow
    });

    // Animate reactants first
    const reactants = document.querySelectorAll('.reactants .molecule-group');
    reactants.forEach((group, index) => {
        setTimeout(() => {
            group.style.animation = 'pulse 0.5s ease-in-out';
        }, index * 200);
    });

    // Then animate arrow
    setTimeout(() => {
        const arrow = document.querySelector('.reaction-arrow');
        if (arrow) {
            arrow.style.animation = 'slideInRight 0.5s ease-out';
        }
    }, 800);

    // Finally animate products
    const products = document.querySelectorAll('.products .molecule-group');
    setTimeout(() => {
        products.forEach((group, index) => {
            setTimeout(() => {
                group.style.animation = 'fadeInUp 0.5s ease-out';
            }, index * 200);
        });
    }, 1200);
}

function resetEquation() {
    const moleculeGroups = document.querySelectorAll('.molecule-group');
    const arrow = document.querySelector('.reaction-arrow');
    
    moleculeGroups.forEach(group => {
        group.style.animation = 'none';
    });
    
    if (arrow) {
        arrow.style.animation = 'none';
    }
}

// =============================================================================
// FLOATING ACTION BUTTON (FAB)
// =============================================================================

function initializeFAB() {
    const mainFab = document.querySelector('.main-fab');
    const fabMenu = document.querySelector('.fab-menu');
    
    if (mainFab) {
        mainFab.addEventListener('click', toggleFabMenu);
    }
}

function toggleFabMenu() {
    const fabMenu = document.querySelector('.fab-menu');
    const mainFabIcon = document.querySelector('.main-fab i');
    
    fabMenuOpen = !fabMenuOpen;
    
    if (fabMenuOpen) {
        fabMenu.classList.add('active');
        mainFabIcon.className = 'fas fa-times';
        mainFabIcon.style.transform = 'rotate(180deg)';
    } else {
        fabMenu.classList.remove('active');
        mainFabIcon.className = 'fas fa-plus';
        mainFabIcon.style.transform = 'rotate(0deg)';
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen mode not supported');
        });
    } else {
        document.exitFullscreen();
    }
}

function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'Fotosentez - İnteraktif Öğrenme Platformu',
            text: 'Fotosentez sürecini interaktif olarak öğren!',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link panoya kopyalandı!');
        });
    }
}

// =============================================================================
// PARTICLE EFFECTS
// =============================================================================

function initializeParticleEffects() {
    createFloatingParticles();
}

function createFloatingParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    if (!particleContainer) return;

    // Create multiple particles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticle(particleContainer);
        }, i * 500);
    }

    // Continue creating particles
    setInterval(() => {
        createParticle(particleContainer);
    }, 3000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
    particle.style.borderRadius = '50%';
    particle.style.position = 'absolute';
    particle.style.bottom = '-10px';
    particle.style.animation = `floatParticles ${Math.random() * 3 + 8}s linear forwards`;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 11000);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function startInteractiveJourney() {
    // Smooth scroll to timeline section
    scrollToSection('timeline');
    
    // Start auto play after a short delay
    setTimeout(() => {
        autoPlay();
    }, 1000);
    
    // Show notification
    showNotification('İnteraktif yolculuk başladı! 🌱');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: var(--primary-green);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-full);
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// =============================================================================
// RESPONSIVE HANDLERS
// =============================================================================

function handleResize() {
    // Close mobile menu on resize
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

window.addEventListener('resize', handleResize);

// =============================================================================
// ERROR HANDLING
// =============================================================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// =============================================================================
// PERFORMANCE OPTIMIZATION
// =============================================================================

// Lazy loading for images
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Debounce scroll events for better performance
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// =============================================================================
// ACCESSIBILITY IMPROVEMENTS
// =============================================================================

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu and FAB menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        if (fabMenuOpen) {
            toggleFabMenu();
        }
    }
    
    // Arrow keys for timeline navigation
    if (e.key === 'ArrowLeft') {
        previousStep();
    } else if (e.key === 'ArrowRight') {
        nextStep();
    }
});

// Focus management for better accessibility
function manageFocus() {
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-green)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    manageFocus();
    initializeLazyLoading();
});

console.log('🌱 Fotosentez Website loaded successfully!');

// =============================================================================
// NEW SECTION ANIMATIONS
// =============================================================================

// Light Reactions Animations
function startLightReactionAnimation() {
    const carriers = document.querySelectorAll('.electron-carrier');
    const photosystems = document.querySelectorAll('.photosystem-ii, .photosystem-i');
    const atpSynthase = document.querySelector('.atp-synthase');
    
    // Animate photosystems
    photosystems.forEach((ps, index) => {
        ps.style.animation = 'energyPulse 1s ease-in-out infinite';
    });
    
    // Animate electron carriers in sequence
    carriers.forEach((carrier, index) => {
        setTimeout(() => {
            carrier.style.animation = 'electronFlow 2s ease-in-out';
            createParticleExplosion(
                carrier.getBoundingClientRect().left + 30, 
                carrier.getBoundingClientRect().top + 30,
                '#ffeb3b'
            );
        }, index * 500);
    });
    
    // Animate ATP synthase
    if (atpSynthase) {
        atpSynthase.style.animation = 'atpSynthesis 2s linear infinite';
    }
    
    showNotification('Işığa bağlı reaksiyonlar başlatıldı! ⚡');
}

function pauseLightReactionAnimation() {
    const elements = document.querySelectorAll('.electron-carrier, .photosystem-ii, .photosystem-i, .atp-synthase');
    elements.forEach(el => {
        el.style.animationPlayState = el.style.animationPlayState === 'paused' ? 'running' : 'paused';
    });
}

function resetLightReactionAnimation() {
    const elements = document.querySelectorAll('.electron-carrier, .photosystem-ii, .photosystem-i, .atp-synthase');
    elements.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = '';
    });
    showNotification('Animasyon sıfırlandı 🔄');
}

// Calvin Cycle Animations
let calvinCycleInterval = null;
let cycleStep = 0;

function startCalvinCycleAnimation() {
    if (calvinCycleInterval) {
        clearInterval(calvinCycleInterval);
    }
    
    const phases = document.querySelectorAll('.phase');
    const speed = document.getElementById('cycle-speed')?.value || 5;
    const interval = 1100 - (speed * 100); // Speed control
    
    calvinCycleInterval = setInterval(() => {
        // Reset all phases
        phases.forEach(phase => {
            phase.classList.remove('active-phase');
            phase.style.transform = '';
            phase.style.background = 'rgba(255,255,255,0.15)';
        });
        
        // Activate current phase
        const currentPhase = phases[cycleStep % phases.length];
        if (currentPhase) {
            currentPhase.classList.add('active-phase');
            currentPhase.style.transform = 'scale(1.1)';
            currentPhase.style.background = 'rgba(139,195,74,0.3)';
            
            // Show phase animation
            const phaseContent = currentPhase.querySelector('.phase-content');
            if (phaseContent) {
                phaseContent.style.animation = 'fadeInScale 0.5s ease-out';
            }
            
            // Create visual effects
            createCycleParticles(currentPhase);
        }
        
        cycleStep++;
        
        // Update glucose output after complete cycle
        if (cycleStep % 3 === 0) {
            const glucose = document.querySelector('.glucose-output');
            if (glucose) {
                glucose.style.animation = 'glucoseFormation 1s ease-out';
            }
        }
    }, interval);
    
    showNotification('Calvin döngüsü başlatıldı! 🔄');
}

function createCycleParticles(phase) {
    const rect = phase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create CO2 particles for phase 1
    if (phase.dataset.phase === 'fixation') {
        createParticleExplosion(centerX, centerY, '#f44336', 5);
    }
    // Create ATP/NADPH particles for phase 2
    else if (phase.dataset.phase === 'reduction') {
        createParticleExplosion(centerX, centerY, '#ffc107', 8);
    }
    // Create RuBP particles for phase 3
    else if (phase.dataset.phase === 'regeneration') {
        createParticleExplosion(centerX, centerY, '#4caf50', 6);
    }
}

// Speed control for Calvin cycle
document.addEventListener('DOMContentLoaded', function() {
    const speedControl = document.getElementById('cycle-speed');
    if (speedControl) {
        speedControl.addEventListener('input', function() {
            if (calvinCycleInterval) {
                startCalvinCycleAnimation(); // Restart with new speed
            }
        });
    }
});

// Enhanced hover effects for comparison table
document.addEventListener('DOMContentLoaded', function() {
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
});

// Team member card interactions
document.addEventListener('DOMContentLoaded', function() {
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach(card => {
        card.addEventListener('click', function() {
            // Create pulse effect
            const avatar = this.querySelector('.member-avatar');
            if (avatar) {
                avatar.style.animation = 'none';
                avatar.offsetHeight; // Trigger reflow
                avatar.style.animation = 'energyPulse 0.5s ease-out';
            }
            
            // Show member details (could be expanded)
            const name = this.querySelector('h3').textContent;
            showNotification(`${name} ile tanıştınız! 👋`);
        });
    });
});

// Process flow step animations
document.addEventListener('DOMContentLoaded', function() {
    const flowSteps = document.querySelectorAll('.flow-step');
    
    // Animate steps in sequence when section is visible
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const steps = entry.target.querySelectorAll('.flow-step');
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.style.animation = 'slideInFromBottom 0.6s ease-out forwards';
                    }, index * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    });
    
    const flowSections = document.querySelectorAll('.flow-section');
    flowSections.forEach(section => {
        observer.observe(section);
    });
});

// Interactive detail cards
document.addEventListener('DOMContentLoaded', function() {
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach(card => {
        card.addEventListener('click', function() {
            // Toggle expanded state
            this.classList.toggle('expanded');
            
            if (this.classList.contains('expanded')) {
                this.style.transform = 'scale(1.05)';
                this.style.zIndex = '10';
                
                // Add expanded content if needed
                const expandedContent = document.createElement('div');
                expandedContent.className = 'expanded-content';
                expandedContent.innerHTML = `
                    <p style="margin-top: 1rem; font-style: italic; opacity: 0.8;">
                        Bu süreç hakkında daha fazla detay için tıklayın...
                    </p>
                `;
                this.appendChild(expandedContent);
                
                // Animate expanded content
                expandedContent.style.animation = 'fadeInScale 0.3s ease-out forwards';
            } else {
                this.style.transform = '';
                this.style.zIndex = '';
                
                // Remove expanded content
                const expandedContent = this.querySelector('.expanded-content');
                if (expandedContent) {
                    expandedContent.remove();
                }
            }
        });
    });
});

console.log('🚀 Advanced section animations loaded!');

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function createParticleExplosion(x, y, color = '#4caf50', count = 10) {
    // This function is already defined in interactions.js
    // Calling the global version
    if (window.createParticleExplosion) {
        window.createParticleExplosion(x, y, color, count);
    }
}
