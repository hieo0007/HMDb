import { useEffect } from 'react';

/**
 * useScrollAnimations
 * ---------------------
 * Registra duas funcionalidades de scroll globais:
 *
 * 1. Intersection Observer — elementos com classe `.fade-in` recebem
 *    `.visible` quando entram na viewport, ativando a animação CSS.
 *
 * 2. Parallax leve — elementos com `data-parallax` recebem
 *    transform: translateY() proporcional ao scroll.
 */
export function useScrollAnimations() {
  useEffect(() => {
    // ── 1. Intersection Observer (fade-in) ────────────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Desregistra depois de ativar (animação única)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const observe = () => {
      document.querySelectorAll('.fade-in, .mobile-fade-in').forEach((el) => observer.observe(el));
    };

    observe();

    // Reobserva se novos elementos forem inseridos via roteamento SPA
    const mutationObserver = new MutationObserver(observe);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // ── 2. Parallax leve ──────────────────────────────────────────────────
    const handleScroll = () => {
      const scrollY = window.scrollY;
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}
