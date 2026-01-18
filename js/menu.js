// js/menu.js
// Script para gerenciar o menu lateral (drawer)

export function inicializarMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.querySelector('.sidebar-close');
    const overlay = document.querySelector('.overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

    if (!menuBtn || !sidebar) return;

    // Abrir menu
    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Fechar menu
    function fecharMenu() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    sidebarClose?.addEventListener('click', fecharMenu);
    overlay?.addEventListener('click', fecharMenu);

    // Fechar ao clicar em um link
    sidebarLinks.forEach(link => {
        link.addEventListener('click', fecharMenu);
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharMenu();
    });
}

export function setMenuAtivo(pagina) {
    const links = document.querySelectorAll('.sidebar-menu a');
    links.forEach(link => {
        if (link.getAttribute('data-page') === pagina) {
            link.style.borderLeftColor = 'var(--color-primary)';
            link.style.color = 'var(--color-primary)';
        } else {
            link.style.borderLeftColor = 'transparent';
            link.style.color = 'var(--color-text)';
        }
    });
}
