const App = {
    lang: "es",
    mouse: { x: 0, y: 0, isActive: false }
};

const LanguageSystem = {
    init() {
        this.btnLang = document.getElementById("btn-lang");
        if (!this.btnLang) return;

        this.loadLanguage(App.lang);
        this.btnLang.addEventListener("click", () => this.toggleLanguage());
    },

    async loadLanguage(idioma) {
        try {
            const respuesta = await fetch(`locales/${idioma}.json`);
            const textos = await respuesta.json();
            const elementos = document.querySelectorAll("[data-i18n]");

            elementos.forEach((el) => {
                const clave = el.getAttribute("data-i18n");
                if (textos[clave]) el.innerHTML = textos[clave];
            });
        } catch (error) {
            console.error("Error cargando idioma (requiere servidor local):", error);
        }
    },

    toggleLanguage() {
        App.lang = App.lang === "es" ? "en" : "es";
        this.btnLang.textContent = App.lang === "es" ? "EN" : "ES";
        this.loadLanguage(App.lang);
    }
};

const UISystem = {
    init() {
        this.setupLoader();
        this.setupModalEvents();
        this.observeProjects();
        this.setupProjectCards();
    },

    setupLoader() {
        window.addEventListener("load", () => {
            const loadingScreen = document.getElementById("loading-screen");
            if (loadingScreen) {
                setTimeout(() => loadingScreen.classList.add("is-hidden"), 1500);
            }
        });
    },

    setupProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('button')) return;
                this.openModal(card);
            });
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (e.target.closest('a') || e.target.closest('button')) return;
                    this.openModal(card);
                }
            });
        });
    },

    openModal(cardElement) {
        cardElement.style.transform = 'scale(0.98)'; 
        
        setTimeout(() => {
            cardElement.style.transform = 'scale(1)';
            const modalOverlay = document.getElementById('project-modal');
            const modalBody = document.getElementById('modal-body');
            
            if (modalOverlay && modalBody) {
                modalBody.innerHTML = cardElement.querySelector('.project-expanded-content').innerHTML;
                modalOverlay.classList.add('is-active');
                document.body.style.overflow = 'hidden'; 
            }
        }, 100);
    },

    closeModal() {
        const modalOverlay = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (!modalOverlay) return;

        modalOverlay.classList.remove('is-active');
        document.body.style.overflow = 'auto'; 
        
        setTimeout(() => {
            if (modalBody) modalBody.innerHTML = '';
        }, 300);
    },

    setupModalEvents() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                const modalOverlay = document.getElementById('project-modal');
                if (modalOverlay && modalOverlay.classList.contains('is-active')) {
                    this.closeModal();
                }
            }
        });

        const modalOverlay = document.getElementById('project-modal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        const closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
    },

    observeProjects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("is-visible");
                    }, index * 200);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1, 
            rootMargin: "0px 0px -50px 0px"
        });

        const cards = document.querySelectorAll(".project-card");
        cards.forEach(card => observer.observe(card));
    }
};

const VisualEffects = {
    init() {
        this.trackMouse();
        this.initFirefly();
    },

    trackMouse() {
        document.addEventListener('mousemove', (e) => {
            App.mouse.x = e.clientX;
            App.mouse.y = e.clientY;
            App.mouse.isActive = true;
        });

        document.addEventListener('mouseleave', () => {
            App.mouse.isActive = false; 
        });
    },

    initFirefly() {
        const firefly = document.createElement('div');
        firefly.id = 'firefly';
        document.body.appendChild(firefly);

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const vel = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
        
        const MAX_SPEED = 2.5; 
        const FLEE_RADIUS = 150;

        const updateFirefly = () => {
            vel.x += (Math.random() - 0.5) * 0.4;
            vel.y += (Math.random() - 0.5) * 0.4;

            if (App.mouse.isActive) {
                const dx = pos.x - App.mouse.x;
                const dy = pos.y - App.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < FLEE_RADIUS) {
                    const force = (FLEE_RADIUS - distance) / FLEE_RADIUS;
                    vel.x += (dx / distance) * force * 1.5;
                    vel.y += (dy / distance) * force * 1.5;
                }
            }

            const currentSpeed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
            if (currentSpeed > MAX_SPEED) {
                vel.x = (vel.x / currentSpeed) * MAX_SPEED;
                vel.y = (vel.y / currentSpeed) * MAX_SPEED;
            }

            pos.x += vel.x;
            pos.y += vel.y;

            const margin = 30;
            if (pos.x < margin) vel.x += 0.2;
            if (pos.x > window.innerWidth - margin) vel.x -= 0.2;
            if (pos.y < margin) vel.y += 0.2;
            if (pos.y > window.innerHeight - margin) vel.y -= 0.2;

            firefly.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            requestAnimationFrame(updateFirefly);
        };

        updateFirefly();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    LanguageSystem.init();
    UISystem.init();
    VisualEffects.init();
});