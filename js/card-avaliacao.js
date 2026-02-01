// js/card-avaliacao.js
// Componente para renderizar o card de avaliação

import { AvaliacaoManager } from './avaliacao.js';

/**
 * Cria e retorna o elemento HTML do card de avaliação
 */
export function criarCardAvaliacao(cursoId, cursoTitulo) {
    const container = document.createElement('div');
    container.className = 'card-avaliacao-container';
    
    // Verificar se todas as aulas foram concluídas
    const todasConcluidas = verificarAulasConcluidas(cursoId);
    const avaliacaoConcluida = AvaliacaoManager.foiConcluida(cursoId);
    const melhorResultado = AvaliacaoManager.obterMelhorResultado(cursoId);

    if (todasConcluidas) {
        if (avaliacaoConcluida) {
            // Avaliação já foi concluída
            container.innerHTML = `
                <div class="card-avaliacao card-avaliacao-concluida">
                    <div class="card-avaliacao-header">
                        <div class="card-avaliacao-icon">✅</div>
                        <h3>Avaliação Concluída</h3>
                    </div>
                    <div class="card-avaliacao-content">
                        <p class="card-avaliacao-resultado">
                            Você acertou <strong>${melhorResultado.acertos}/${melhorResultado.total}</strong> questões
                        </p>
                        <p class="card-avaliacao-percentual">${melhorResultado.percentual}%</p>
                        <p class="card-avaliacao-descricao">
                            ${getNivelDesempenho(melhorResultado.percentual)}
                        </p>
                    </div>
                    <div class="card-avaliacao-actions">
                        <button class="btn-avaliacao btn-refazer" onclick="refazerAvaliacao('${cursoId}')">
                            <i class="fas fa-redo"></i> Refazer Avaliação
                        </button>
                        <button class="btn-avaliacao btn-detalhes" onclick="verDetalhes('${cursoId}')">
                            <i class="fas fa-chart-bar"></i> Ver Detalhes
                        </button>
                    </div>
                </div>
            `;
        } else {
            // Avaliação liberada mas não concluída
            container.innerHTML = `
                <div class="card-avaliacao card-avaliacao-liberada">
                    <div class="card-avaliacao-header">
                        <div class="card-avaliacao-icon">🎯</div>
                        <h3>Avaliação Liberada!</h3>
                    </div>
                    <div class="card-avaliacao-content">
                        <p class="card-avaliacao-descricao">
                            Parabéns! Você completou todas as aulas. Agora teste seus conhecimentos com a avaliação final.
                        </p>
                        <div class="card-avaliacao-info">
                            <div class="info-item">
                                <span class="info-label">Questões:</span>
                                <span class="info-valor">10</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Tipo:</span>
                                <span class="info-valor">Múltipla Escolha</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-avaliacao-actions">
                        <button class="btn-avaliacao btn-iniciar" onclick="iniciarAvaliacao('${cursoId}')">
                            <i class="fas fa-play"></i> Iniciar Avaliação
                        </button>
                    </div>
                </div>
            `;
        }
    } else {
        // Avaliação bloqueada - aulas não concluídas
        const progresso = calcularProgressoCurso(cursoId);
        container.innerHTML = `
            <div class="card-avaliacao card-avaliacao-bloqueada">
                <div class="card-avaliacao-header">
                    <div class="card-avaliacao-icon">🔒</div>
                    <h3>Avaliação Bloqueada</h3>
                </div>
                <div class="card-avaliacao-content">
                    <p class="card-avaliacao-descricao">
                        Complete todas as aulas para liberar a avaliação final.
                    </p>
                    <div class="card-avaliacao-progress">
                        <div class="progress-bar-avaliacao">
                            <div class="progress-fill-avaliacao" style="width: ${progresso}%;"></div>
                        </div>
                        <span class="progress-text-avaliacao">${progresso}% das aulas concluídas</span>
                    </div>
                </div>
            </div>
        `;
    }

    return container;
}

/**
 * Verifica se todas as aulas de um curso foram concluídas
 */
function verificarAulasConcluidas(cursoId) {
     return true;
    const progresso = localStorage.getItem('zoe_escola_progresso');
    if (!progresso) return false;

    const dados = JSON.parse(progresso);
    if (!dados[cursoId]) return false;

    let totalAulas = 0;
    let aulasConcluidas = 0;

    // Iterar sobre os módulos e aulas para contar o progresso
    for (const moduloId in dados[cursoId]) {
        const modulo = dados[cursoId][moduloId];
        for (const aulaId in modulo) {
            totalAulas++;
            if (modulo[aulaId] === true) {
                aulasConcluidas++;
            }
        }
    }

    // Consideramos concluído se houver aulas e todas estiverem marcadas como true
    return totalAulas > 0 && totalAulas === aulasConcluidas;
}

/**
 * Calcula o progresso geral do curso
 */
function calcularProgressoCurso(cursoId) {
    const progresso = localStorage.getItem('zoe_escola_progresso');
    if (!progresso) return 0;

    const dados = JSON.parse(progresso);
    if (!dados[cursoId]) return 0;

    let totalAulas = 0;
    let aulasConcluidas = 0;

    Object.values(dados[cursoId]).forEach(modulo => {
        Object.values(modulo).forEach(aula => {
            totalAulas++;
            if (aula) aulasConcluidas++;
        });
    });

    return totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;
}

/**
 * Retorna mensagem de desempenho
 */
function getNivelDesempenho(percentual) {
    if (percentual === 100) return 'Desempenho Excelente!';
    if (percentual >= 80) return 'Muito Bom!';
    if (percentual >= 60) return 'Bom desempenho.';
    if (percentual >= 40) return 'Continue estudando.';
    return 'Revise o conteúdo e tente novamente.';
}

/**
 * Funções globais para os botões
 */
window.iniciarAvaliacao = (cursoId) => {
    window.location.href = `avaliacao.html?cursoId=${cursoId}`;
};

window.refazerAvaliacao = (cursoId) => {
    if (confirm('Deseja refazer a avaliação? Seu progresso anterior será mantido.')) {
        window.location.href = `avaliacao.html?cursoId=${cursoId}`;
    }
};

window.verDetalhes = (cursoId) => {
    window.location.href = `gamificacao.html`;
};

/**
 * Estilos CSS para o card de avaliação
 */
export const estilosCardAvaliacao = `
    .card-avaliacao-container {
        margin-top: 30px;
        margin-bottom: 40px;
    }

    .card-avaliacao {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 30px;
        transition: all 0.3s ease;
        max-width: 800px;
        margin: 0 auto;
    }

    .card-avaliacao:hover {
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .card-avaliacao-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
    }

    .card-avaliacao-icon {
        font-size: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-avaliacao-header h3 {
        color: white;
        margin: 0;
        font-size: 1.3rem;
        font-weight: 700;
        letter-spacing: 0.5px;
    }

    .card-avaliacao-content {
        margin-bottom: 25px;
    }

    .card-avaliacao-descricao {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0 0 15px 0;
    }

    .card-avaliacao-resultado {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1rem;
        margin: 0 0 10px 0;
    }

    .card-avaliacao-percentual {
        color: #4ade80;
        font-size: 1.8rem;
        font-weight: 800;
        margin: 0 0 10px 0;
    }

    .card-avaliacao-info {
        display: flex;
        gap: 20px;
        margin-top: 15px;
    }

    .info-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .info-label {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
    }

    .info-valor {
        color: white;
        font-size: 1rem;
        font-weight: 700;
    }

    .card-avaliacao-progress {
        margin-top: 15px;
    }

    .progress-bar-avaliacao {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 10px;
    }

    .progress-fill-avaliacao {
        height: 100%;
        background: linear-gradient(90deg, #348941, #4ade80);
        transition: width 0.6s ease;
        box-shadow: 0 0 10px rgba(52, 137, 65, 0.4);
    }

    .progress-text-avaliacao {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.8rem;
        display: block;
    }

    .card-avaliacao-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .btn-avaliacao {
        flex: 1;
        min-width: 150px;
        padding: 14px 20px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        color: white;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.85rem;
    }

    .btn-avaliacao:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }

    .btn-iniciar {
        background: linear-gradient(135deg, #4ade80, #22c55e);
        border: none;
        color: white;
    }

    .btn-iniciar:hover {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
    }

    .btn-refazer {
        background: linear-gradient(135deg, #4E6813 0%, #A3B18A 100%);
        border: none;
        color: white;
    }

    .btn-refazer:hover {
        background: linear-gradient(135deg, #4E6813 0%, #A3B18A 100%);
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .btn-detalhes {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .card-avaliacao-bloqueada {
        opacity: 0.7;
    }

    .card-avaliacao-bloqueada .card-avaliacao-icon {
        color: rgba(255, 255, 255, 0.5);
    }

    .card-avaliacao-liberada {
        border-color: rgba(74, 222, 128, 0.3);
        background: rgba(74, 222, 128, 0.05);
    }

    .card-avaliacao-concluida {
        border-color: rgba(102, 126, 234, 0.3);
        background: rgba(102, 126, 234, 0.05);
    }

    @media (max-width: 768px) {
        .card-avaliacao {
            padding: 20px;
        }

        .card-avaliacao-header {
            flex-direction: column;
            text-align: center;
        }

        .card-avaliacao-actions {
            flex-direction: column;
        }

        .btn-avaliacao {
            width: 100%;
        }

        .card-avaliacao-info {
            flex-direction: column;
        }
    }
`;

export default {
    criarCardAvaliacao,
    estilosCardAvaliacao
};
