// js/avaliacao.js
// Gerenciamento de avaliações, cálculo de resultados e gamificação

const AVALIACOES_KEY = 'zoe_avaliacoes';
const BADGES_KEY = 'zoe_badges';
const PONTOS_KEY = 'zoe_pontos_gamificacao';

/**
 * Estrutura de dados para armazenar resultados de avaliação
 */
export class ResultadoAvaliacao {
    constructor(cursoId, acertos, total, respostas) {
        this.cursoId = cursoId;
        this.acertos = acertos;
        this.total = total;
        this.percentual = Math.round((acertos / total) * 100);
        this.respostas = respostas;
        this.dataConclusao = new Date().toISOString();
        this.tempoDecorrido = 0; // em segundos
    }

    /**
     * Determina o nível de desempenho
     */
    getNivelDesempenho() {
        if (this.percentual === 100) return 'excelente';
        if (this.percentual >= 80) return 'muito_bom';
        if (this.percentual >= 60) return 'bom';
        if (this.percentual >= 40) return 'regular';
        return 'insuficiente';
    }

    /**
     * Retorna mensagem personalizada baseada no desempenho
     */
    getMensagem() {
        const nivel = this.getNivelDesempenho();
        const mensagens = {
            excelente: 'Você demonstrou excelente compreensão do conteúdo. Parabéns por dominar completamente este curso!',
            muito_bom: 'Você teve um ótimo desempenho! Continue assim e aprofunde ainda mais seu conhecimento.',
            bom: 'Você demonstrou bom conhecimento do conteúdo. Revise os pontos que ficaram dúvidas.',
            regular: 'Você está no caminho certo! Revise o conteúdo e tente novamente para melhorar seu desempenho.',
            insuficiente: 'Recomendamos revisar o conteúdo das aulas antes de fazer uma nova tentativa.'
        };
        return mensagens[nivel];
    }

    /**
     * Retorna ícone e título baseado no desempenho
     */
    getIconeTitulo() {
        const nivel = this.getNivelDesempenho();
        const dados = {
            excelente: { icon: '🏆', titulo: '🎉 Excelente!' },
            muito_bom: { icon: '🎖️', titulo: '👏 Muito Bem!' },
            bom: { icon: '📚', titulo: '✅ Bom Desempenho!' },
            regular: { icon: '📝', titulo: '💪 Continue Estudando!' },
            insuficiente: { icon: '📚', titulo: '🔄 Tente Novamente!' }
        };
        return dados[nivel];
    }

    /**
     * Retorna badges conquistadas
     */
    getBadges() {
        const nivel = this.getNivelDesempenho();
        const badges = {
            excelente: ['🥇 Perfeição', '⭐ Destaque', '🔥 Domínio Total'],
            muito_bom: ['🥈 Excelente', '⭐ Muito Bom'],
            bom: ['📖 Aprendizado'],
            regular: ['🎯 Progresso'],
            insuficiente: ['💡 Aprendizado']
        };
        return badges[nivel];
    }
}

/**
 * Gerencia pontos e recompensas de gamificação
 */
export class GamificacaoManager {
    constructor() {
        this.pontos = this.carregarPontos();
        this.badges = this.carregarBadges();
    }

    /**
     * Carrega pontos do localStorage
     */
    carregarPontos() {
        const data = localStorage.getItem(PONTOS_KEY);
        return data ? JSON.parse(data) : { total: 0, historico: [] };
    }

    /**
     * Carrega badges do localStorage
     */
    carregarBadges() {
        const data = localStorage.getItem(BADGES_KEY);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Salva pontos no localStorage
     */
    salvarPontos() {
        localStorage.setItem(PONTOS_KEY, JSON.stringify(this.pontos));
    }

    /**
     * Salva badges no localStorage
     */
    salvarBadges() {
        localStorage.setItem(BADGES_KEY, JSON.stringify(this.badges));
    }

    /**
     * Calcula pontos baseado no desempenho
     */
    calcularPontos(resultado) {
        let pontos = 0;
        const nivel = resultado.getNivelDesempenho();

        // Pontos base por acerto
        pontos += resultado.acertos * 10;

        // Bônus por desempenho
        const bonusDesempenho = {
            excelente: 100,
            muito_bom: 75,
            bom: 50,
            regular: 25,
            insuficiente: 0
        };
        pontos += bonusDesempenho[nivel];

        // Bônus por velocidade (se tempo foi registrado)
        if (resultado.tempoDecorrido > 0 && resultado.tempoDecorrido < 600) { // menos de 10 minutos
            pontos += 25;
        }

        return pontos;
    }

    /**
     * Adiciona pontos e registra no histórico
     */
    adicionarPontos(cursoId, pontos, motivo = 'avaliacao') {
        this.pontos.total += pontos;
        this.pontos.historico.push({
            cursoId: cursoId,
            pontos: pontos,
            motivo: motivo,
            data: new Date().toISOString()
        });
        this.salvarPontos();
        return this.pontos.total;
    }

    /**
     * Adiciona badge conquistada
     */
    adicionarBadge(badge) {
        if (!this.badges.some(b => b.id === badge.id)) {
            this.badges.push({
                ...badge,
                dataConclusao: new Date().toISOString()
            });
            this.salvarBadges();
            return true;
        }
        return false;
    }

    /**
     * Retorna badges disponíveis baseado no desempenho
     */
    getBadgesDisponiveis(resultado) {
        const badgesDisponiveis = [];
        const nivel = resultado.getNivelDesempenho();

        // Badge de Perfeição
        if (resultado.percentual === 100) {
            badgesDisponiveis.push({
                id: 'perfeicao',
                nome: 'Perfeição',
                descricao: 'Acertou todas as questões',
                icon: '🥇',
                pontos: 50
            });
        }

        // Badge de Excelência
        if (resultado.percentual >= 80) {
            badgesDisponiveis.push({
                id: 'excelencia',
                nome: 'Excelência',
                descricao: 'Desempenho excelente na avaliação',
                icon: '⭐',
                pontos: 30
            });
        }

        // Badge de Aprendizado
        if (resultado.percentual >= 60) {
            badgesDisponiveis.push({
                id: 'aprendizado',
                nome: 'Aprendizado',
                descricao: 'Completou a avaliação com sucesso',
                icon: '📚',
                pontos: 15
            });
        }

        // Badge de Persistência
        if (resultado.percentual >= 40 && resultado.percentual < 60) {
            badgesDisponiveis.push({
                id: 'persistencia',
                nome: 'Persistência',
                descricao: 'Continua estudando e melhorando',
                icon: '💪',
                pontos: 10
            });
        }

        // Badge de Velocidade
        if (resultado.tempoDecorrido > 0 && resultado.tempoDecorrido < 600) {
            badgesDisponiveis.push({
                id: 'velocidade',
                nome: 'Velocidade',
                descricao: 'Completou a avaliação rapidamente',
                icon: '⚡',
                pontos: 20
            });
        }

        return badgesDisponiveis;
    }

    /**
     * Retorna o nível do usuário baseado em pontos totais
     */
    getNivelUsuario() {
        const pontos = this.pontos.total;
        if (pontos >= 1000) return { nivel: 5, nome: 'Mestre', icon: '👑' };
        if (pontos >= 750) return { nivel: 4, nome: 'Avançado', icon: '🏅' };
        if (pontos >= 500) return { nivel: 3, nome: 'Intermediário', icon: '⭐' };
        if (pontos >= 250) return { nivel: 2, nome: 'Iniciante', icon: '🌱' };
        return { nivel: 1, nome: 'Aprendiz', icon: '📚' };
    }

    /**
     * Retorna progresso para próximo nível
     */
    getProgressoProximoNivel() {
        const nivelAtual = this.getNivelUsuario();
        const limites = [0, 250, 500, 750, 1000];
        const proximoLimite = limites[nivelAtual.nivel] || 1000;
        const limiteAtual = limites[nivelAtual.nivel - 1] || 0;
        
        const progresso = ((this.pontos.total - limiteAtual) / (proximoLimite - limiteAtual)) * 100;
        
        return {
            nivel: nivelAtual.nivel,
            proximoNivel: nivelAtual.nivel + 1,
            pontos: this.pontos.total,
            pontosProximos: proximoLimite,
            progresso: Math.min(progresso, 100)
        };
    }
}

/**
 * Gerencia armazenamento de avaliações
 */
export class AvaliacaoManager {
    /**
     * Salva resultado de avaliação
     */
    static salvarResultado(resultado) {
        const avaliacoes = JSON.parse(localStorage.getItem(AVALIACOES_KEY) || '{}');
        
        if (!avaliacoes[resultado.cursoId]) {
            avaliacoes[resultado.cursoId] = [];
        }

        avaliacoes[resultado.cursoId].push({
            acertos: resultado.acertos,
            total: resultado.total,
            percentual: resultado.percentual,
            nivel: resultado.getNivelDesempenho(),
            dataConclusao: resultado.dataConclusao,
            tempoDecorrido: resultado.tempoDecorrido
        });

        localStorage.setItem(AVALIACOES_KEY, JSON.stringify(avaliacoes));
    }

    /**
     * Obtém histórico de avaliações de um curso
     */
    static obterHistorico(cursoId) {
        const avaliacoes = JSON.parse(localStorage.getItem(AVALIACOES_KEY) || '{}');
        const historico = avaliacoes[cursoId] || [];
        // Garantir que o histórico seja sempre um array
        return Array.isArray(historico) ? historico : [historico];
    }

    /**
     * Obtém melhor resultado de um curso
     */
    static obterMelhorResultado(cursoId) {
        const historico = this.obterHistorico(cursoId);
        if (historico.length === 0) return null;
        
        return historico.reduce((melhor, atual) => 
            atual.percentual > melhor.percentual ? atual : melhor
        );
    }

    /**
     * Verifica se avaliação foi concluída com sucesso
     */
    static foiConcluida(cursoId, percentualMinimo = 60) {
        const melhorResultado = this.obterMelhorResultado(cursoId);
        return melhorResultado && melhorResultado.percentual >= percentualMinimo;
    }

    /**
     * Obtém estatísticas gerais de avaliações
     */
    static obterEstatisticas() {
        const avaliacoes = JSON.parse(localStorage.getItem(AVALIACOES_KEY) || '{}');
        let totalAvaliacoes = 0;
        let totalAcertos = 0;
        let totalQuestoes = 0;
        let mediaPercentual = 0;

        Object.values(avaliacoes).forEach(cursosAvaliacoes => {
            cursosAvaliacoes.forEach(aval => {
                totalAvaliacoes++;
                totalAcertos += aval.acertos;
                totalQuestoes += aval.total;
                mediaPercentual += aval.percentual;
            });
        });

        return {
            totalAvaliacoes,
            totalAcertos,
            totalQuestoes,
            mediaPercentual: totalAvaliacoes > 0 ? Math.round(mediaPercentual / totalAvaliacoes) : 0,
            cursosAvaliados: Object.keys(avaliacoes).length
        };
    }
}

/**
 * Valida respostas da avaliação
 */
export class ValidadorAvaliacao {
    /**
     * Valida se todas as questões foram respondidas
     */
    static validarTodasRespondidas(respostas) {
        return respostas.every(r => r !== null && r !== undefined);
    }

    /**
     * Valida se resposta está dentro do intervalo válido
     */
    static validarResposta(resposta, totalOpcoes) {
        return resposta >= 0 && resposta < totalOpcoes;
    }

    /**
     * Valida estrutura completa de respostas
     */
    static validarEstrutura(respostas, questoes) {
        if (!Array.isArray(respostas) || respostas.length !== questoes.length) {
            return false;
        }

        return respostas.every((resposta, index) => {
            return this.validarResposta(resposta, questoes[index].opcoes.length);
        });
    }

    /**
     * Calcula acertos
     */
    static calcularAcertos(respostas, questoes) {
        if (!this.validarEstrutura(respostas, questoes)) {
            throw new Error('Estrutura de respostas inválida');
        }

        return respostas.reduce((acertos, resposta, index) => {
            return resposta === questoes[index].correta ? acertos + 1 : acertos;
        }, 0);
    }

    /**
     * Gera relatório detalhado de desempenho
     */
    static gerarRelatorio(respostas, questoes) {
        const relatorio = {
            totalQuestoes: questoes.length,
            acertos: 0,
            erros: 0,
            detalhes: []
        };

        respostas.forEach((resposta, index) => {
            const questao = questoes[index];
            const acertou = resposta === questao.correta;

            if (acertou) {
                relatorio.acertos++;
            } else {
                relatorio.erros++;
            }

            relatorio.detalhes.push({
                numero: index + 1,
                pergunta: questao.pergunta,
                acertou: acertou,
                respostaUsuario: questao.opcoes[resposta],
                respostaCorreta: questao.opcoes[questao.correta]
            });
        });

        relatorio.percentual = Math.round((relatorio.acertos / relatorio.totalQuestoes) * 100);

        return relatorio;
    }
}

export default {
    ResultadoAvaliacao,
    GamificacaoManager,
    AvaliacaoManager,
    ValidadorAvaliacao
};
