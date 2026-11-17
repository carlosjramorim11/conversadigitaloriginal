/**
 * BRAND ATHLETE PREMIUM ENGINE - 2026
 * Focado em Alta Performance e Acessibilidade (Lighthouse Otimizado)
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initIntersectionAnimations();
    initAnimatedCounters();
    initPremiumLightbox();
});

/* ==========================================================================
   1. MENU MOBILE (ACESSIBILIDADE E FLUIDEZ)
   ========================================================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('.premium-header');
    
    if (!menuBtn || !mobileMenu) return;

    // Toggle menu
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
    });

    // Fecha ao clicar em qualquer link interno
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Efeito Blur Dinâmico no Header ao rolar a página (Otimizado com Passive Event)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.75rem 0';
            header.style.background = 'rgba(5, 5, 5, 0.9)';
        } else {
            header.style.padding = '1.25rem 0';
            header.style.background = 'rgba(5, 5, 5, 0.75)';
        }
    }, { passive: true });
}

/* ==========================================================================
   2. CONTADORES ANIMADOS (COM SUAVIZAÇÃO BASEADA EM TIME-STEP)
   ========================================================================== */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animate = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let start = 0;
        const duration = 2000; // 2 segundos de animação
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
                // Função de Easing Out Quad para desaceleração premium
                const progress = elapsedTime / duration;
                const easeOutQuad = progress * (2 - progress);
                
                start = Math.floor(easeOutQuad * target);
                counter.textContent = start + (counter.getAttribute('data-suffix') || '');
                requestAnimationFrame(updateNumber);
            } else {
                counter.textContent = target + (counter.getAttribute('data-suffix') || '');
            }
        };

        requestAnimationFrame(updateNumber);
    };

    // Aciona a animação apenas quando o elemento aparece na tela
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   3. ANIMAÇÕES DE ENTRADA (FADE IN UP/LEFT/RIGHT) VIA API INTERSECTION
   ========================================================================== */
function initIntersectionAnimations() {
    // Adiciona as classes apenas quando o elemento estiver prestes a entrar na viewport
    const animatedElements = document.querySelectorAll('.will-animate');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.getAttribute('data-animation') || 'animate-fade-up';
                entry.target.classList.add(animationType);
                animationObserver.unobserve(entry.target); // Roda apenas uma vez
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px' // Ativa um pouco antes de aparecer completamente
    });

    animatedElements.forEach(el => animationObserver.observe(el));
}

/* ==========================================================================
   4. LIGHTBOX PREMIUM DA GALERIA (PREVINE CLS E MEMORY LEAKS)
   ========================================================================== */
function initPremiumLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;

    // Cria a estrutura do Lightbox dinamicamente apenas quando necessário (Economiza DOM inicial)
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Visualizador de Imagem');
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Fechar visualizador" style="position: absolute; top: 20px; right: 30px; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; z-index: 2001;">&times;</button>
        <img class="lightbox-content" src="" alt="Imagem Ampliada" style="transform: scale(0.95); transition: transform 0.3s ease;">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetImg = item.querySelector('img');
            if (!targetImg) return;

            // Atribui o src da imagem
            lightboxImg.src = targetImg.getAttribute('data-fullsrc') || targetImg.src;
            lightboxImg.alt = targetImg.alt;
            
            // Exibe com transição opacidade
            lightbox.classList.add('active');
            setTimeout(() => {
                lightboxImg.style.transform = 'scale(1)';
            }, 50);
            
            document.body.style.overflow = 'hidden'; // Trava o scroll de fundo
        });
    });

    const closeLightbox = () => {
        lightboxImg.style.transform = 'scale(0.95)';
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Libera o scroll
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Fecha ao clicar fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Fechamento via tecla ESC (Acessibilidade)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}