// js/instagram-loader.js
// Script para carregar fotos do Instagram dinamicamente

// CONFIGURAÇÃO: Substitua este token pelo seu token de acesso do Instagram Basic Display
const INSTAGRAM_TOKEN = 'SEU_TOKEN_AQUI';
const INSTAGRAM_USER_ID = 'SEU_USER_ID_AQUI';

/**
 * Carrega as fotos mais recentes do Instagram
 * @param {number} limit - Número de fotos a carregar (padrão: 4)
 */
async function carregarFotosInstagram(limit = 4) {
    const container = document.getElementById('galeria-container');
    
    if (!INSTAGRAM_TOKEN || INSTAGRAM_TOKEN === 'SEU_TOKEN_AQUI') {
        console.log('Token do Instagram não configurado. Usando imagens placeholder.');
        return;
    }

    try {
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${INSTAGRAM_TOKEN}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            container.innerHTML = '';
            data.data.forEach(post => {
                if (post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL') {
                    const item = document.createElement('div');
                    item.className = 'galeria-item';
                    item.innerHTML = `
                        <img src="${post.media_url}" alt="Instagram Post" onclick="window.open('${post.permalink}', '_blank')">
                    `;
                    container.appendChild(item);
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar fotos do Instagram:', error);
    }
}

/**
 * Alternativa: Usar um widget de terceiros (Elfsight, Behold, etc.)
 * Descomente a função abaixo e adicione o script do widget ao HTML
 */
function carregarWidgetInstagram() {
    // Exemplo com Elfsight (substitua o ID pelo seu)
    // <script src="https://apps.elfsight.com/p/platform.js" defer></script>
    // <div class="elfsight-app-c5f6d8a9-1234-5678-9abc-def012345678"></div>
}

// Exportar para uso em outros arquivos
export { carregarFotosInstagram, carregarWidgetInstagram };
