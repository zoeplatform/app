// js/progresso.js
// Gerenciamento de progresso do aluno usando localStorage

const PROGRESSO_KEY = 'zoe_escola_progresso';

export function getProgresso() {
    const data = localStorage.getItem(PROGRESSO_KEY);
    return data ? JSON.parse(data) : {};
}

export function salvarProgresso(cursoId, moduloId, aulaId, concluida = true) {
    const progresso = getProgresso();
    
    if (!progresso[cursoId]) progresso[cursoId] = {};
    if (!progresso[cursoId][moduloId]) progresso[cursoId][moduloId] = {};
    
    progresso[cursoId][moduloId][aulaId] = concluida;
    
    localStorage.setItem(PROGRESSO_KEY, JSON.stringify(progresso));
    return progresso;
}

export function isAulaConcluida(cursoId, moduloId, aulaId) {
    const progresso = getProgresso();
    return !!(progresso[cursoId] && progresso[cursoId][moduloId] && progresso[cursoId][moduloId][aulaId]);
}

export function calcularProgressoModulo(cursoId, modulo, progressoGlobal = null) {
    const progresso = progressoGlobal || getProgresso();
    const aulas = modulo.conteudos || [];
    if (aulas.length === 0) return 0;
    
    const concluidas = aulas.filter(aula => 
        progresso[cursoId] && 
        progresso[cursoId][modulo.id] && 
        progresso[cursoId][modulo.id][aula.id]
    ).length;
    
    return Math.round((concluidas / aulas.length) * 100);
}

export function calcularProgressoCurso(curso, progressoGlobal = null) {
    const progresso = progressoGlobal || getProgresso();
    let totalAulas = 0;
    let totalConcluidas = 0;
    
    curso.modulos.forEach(modulo => {
        const aulas = modulo.conteudos || [];
        totalAulas += aulas.length;
        
        aulas.forEach(aula => {
            if (progresso[curso.id] && progresso[curso.id][modulo.id] && progresso[curso.id][modulo.id][aula.id]) {
                totalConcluidas++;
            }
        });
    });
    
    if (totalAulas === 0) return 0;
    return Math.round((totalConcluidas / totalAulas) * 100);
}
