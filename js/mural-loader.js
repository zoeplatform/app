// js/mural-loader.js
// Carregador do Mural de Avisos via Firebase Firestore

import { db, collection, query, where, orderBy, onSnapshot } from './firebase-init.js';

export function inicializarMural(containerId = 'mural-container') {
    const muralContainer = document.getElementById(containerId);
    if (!muralContainer) return;

    console.log("📌 Inicializando Mural de Avisos...");

    // Referência para a coleção de avisos no Firestore
    const avisosRef = collection(db, 'avisos');
    
    /**
     * IMPORTANTE: 
     * Se o Firebase retornar erro de "Index required", use a query simplificada abaixo
     * ou crie o índice no console do Firebase.
     */
    
    // Query simplificada para evitar erros de índice composto inicialmente
    const q = query(
        avisosRef, 
        orderBy('data_criacao', 'desc')
    );

    // Escutar mudanças em tempo real
    onSnapshot(q, (snapshot) => {
        muralContainer.innerHTML = '';
        
        const agora = new Date();
        let avisosExibidos = 0;

        snapshot.forEach((doc) => {
            const aviso = doc.data();
            
            // Filtragem manual para evitar necessidade de índices compostos no Firebase
            if (aviso.ativo !== true) return;

            // Verificar se o aviso expirou
            if (aviso.data_expiracao) {
                const dataExp = new Date(aviso.data_expiracao);
                if (agora > dataExp) return; 
            }

            avisosExibidos++;

            const card = document.createElement('div');
            card.className = 'aviso-card'; 
            card.innerHTML = `
                <span class="aviso-tag">${aviso.categoria || 'Geral'}</span>
                <h4>${aviso.titulo}</h4>
                <p style="font-size: 0.85rem; color:white;">${aviso.descricao}</p>
            `;
            muralContainer.appendChild(card);
        });

        if (avisosExibidos === 0) {
            muralContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Nenhum aviso no momento.</p>';
        }
    }, (error) => {
        console.error("❌ Erro ao carregar mural do Firestore:", error);
        
        if (error.code === 'permission-denied') {
            muralContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #dc3545; font-size: 0.8rem;">
                    <i class="fas fa-exclamation-triangle"></i><br>
                    Acesso negado. Verifique as Regras de Segurança no Console do Firebase.
                </div>`;
        } else {
            muralContainer.innerHTML = '<p style="text-align: center; color: var(--color-error);">Erro ao carregar avisos.</p>';
        }
    });
}

// Inicializar se o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => inicializarMural('mural-container'));
} else {
    inicializarMural('mural-container');
}
