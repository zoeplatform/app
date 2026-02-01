# 📊 Estrutura de Dados - Firebase Zoe Platform

## Visão Geral
Este documento descreve a estrutura de coleções e documentos no Firebase para o Ministério Zoe Maringá.

---

## 1. Coleção: `usuarios`
Armazena informações dos usuários cadastrados na plataforma.

### Estrutura do Documento:
```json
{
  "uid": "user_id_firebase",
  "nome": "Nome Completo",
  "email": "usuario@email.com",
  "foto_perfil": "url_da_imagem",
  "data_cadastro": "2026-01-14T10:00:00Z",
  "ultimo_login": "2026-01-14T15:30:00Z",
  "ativo": true,
  "role": "membro" // membro, lider, admin
}
```

---

## 2. Coleção: `avisos`
Armazena os avisos e comunicados que aparecem no Mural da Home.

### Estrutura do Documento:
```json
{
  "titulo": "Noite de Adoração",
  "descricao": "Venha participar de um tempo profético às 19h.",
  "categoria": "Próximo Domingo", // Próximo Domingo, Inscrições Abertas, Comunicado, Evento
  "data_criacao": "2026-01-14T10:00:00Z",
  "data_expiracao": "2026-01-19T23:59:59Z",
  "ativo": true,
  "criado_por": "uid_do_admin"
}
```

---

## 3. Coleção: `cursos`
Armazena os cursos da Escola Zoe.

### Estrutura do Documento:
```json
{
  "titulo": "Fundamentos da Fé",
  "descricao": "Aprenda os pilares do cristianismo",
  "imagem": "url_da_imagem",
  "status": "ativo", // ativo, inativo, em_construcao
  "data_criacao": "2026-01-01T00:00:00Z",
  "modulos": [
    {
      "id": 1,
      "titulo": "Introdução",
      "descricao": "Bem-vindo ao curso",
      "conteudo": "...",
      "audio": "url_do_audio",
      "ordem": 1
    }
  ],
  "criado_por": "uid_do_admin"
}
```

---

## 4. Coleção: `progresso_usuario`
Rastreia o progresso de cada usuário nos cursos.

### Estrutura do Documento:
```json
{
  "usuario_id": "uid_do_usuario",
  "curso_id": "id_do_curso",
  "modulos_concluidos": [1, 2, 3],
  "percentual_conclusao": 75,
  "data_inicio": "2026-01-10T10:00:00Z",
  "data_conclusao": null,
  "notas_diario": "Texto das anotações do usuário",
  "status": "em_progresso" // em_progresso, concluido, pausado
}
```

---

## 5. Coleção: `materiais_reino_kids`
Armazena os materiais de download do Reino Kids.

### Estrutura do Documento:
```json
{
  "titulo": "Colorir e Aprender",
  "descricao": "Série completa de atividades de colorir com histórias bíblicas",
  "categoria": "Atividades", // Atividades, Manuais para Pais
  "faixa_etaria": "3-7 anos",
  "arquivo_url": "url_do_pdf",
  "arquivo_nome": "colorir-aprender.pdf",
  "paginas": 12,
  "data_criacao": "2026-01-01T00:00:00Z",
  "ativo": true,
  "downloads": 0
}
```

---

## 6. Coleção: `pedidos_oracao`
Armazena os pedidos de oração da comunidade.

### Estrutura do Documento:
```json
{
  "usuario_id": "uid_do_usuario",
  "nome_usuario": "Nome",
  "titulo": "Pedido de Oração",
  "descricao": "Descrição do pedido",
  "data_criacao": "2026-01-14T10:00:00Z",
  "pessoas_orando": 5,
  "ativo": true,
  "privado": false
}
```

---

## 7. Coleção: `eventos`
Armazena os eventos da igreja.

### Estrutura do Documento:
```json
{
  "titulo": "Conferência Zoe 2026",
  "descricao": "Nosso encontro anual de discipulado",
  "data_evento": "2026-03-15T19:00:00Z",
  "local": "Avenida José Alves Nendo, 911",
  "imagem": "url_da_imagem",
  "link_inscricao": "url_do_formulario",
  "data_criacao": "2026-01-01T00:00:00Z",
  "ativo": true
}
```

---

## 8. Coleção: `galeria`
Armazena as fotos da galeria (futura integração com Instagram).

### Estrutura do Documento:
```json
{
  "titulo": "Culto Domingo",
  "descricao": "Momentos do culto de domingo",
  "imagem_url": "url_da_imagem",
  "data_evento": "2026-01-12T19:00:00Z",
  "data_upload": "2026-01-14T10:00:00Z",
  "categoria": "Cultos", // Cultos, Eventos, Atividades
  "ativo": true
}
```

---

## Índices Recomendados

Para melhor performance, crie os seguintes índices no Firebase:

1. **avisos**: `(ativo, data_criacao DESC)`
2. **cursos**: `(status, data_criacao DESC)`
3. **progresso_usuario**: `(usuario_id, curso_id)`
4. **materiais_reino_kids**: `(categoria, ativo, data_criacao DESC)`
5. **pedidos_oracao**: `(ativo, data_criacao DESC)`

---

## Regras de Segurança (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuários podem ler seu próprio documento
    match /usuarios/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Avisos são públicos para leitura
    match /avisos/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid in get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Cursos são públicos para leitura
    match /cursos/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid in get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Progresso é privado
    match /progresso_usuario/{document=**} {
      allow read: if request.auth.uid == resource.data.usuario_id;
      allow write: if request.auth.uid == resource.data.usuario_id;
    }
    
    // Materiais são públicos para leitura
    match /materiais_reino_kids/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid in get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Como Usar

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `zoeplatform-1c4f1`
3. Vá para **Firestore Database**
4. Crie as coleções conforme descrito acima
5. Adicione documentos de exemplo para testar
6. Configure as Regras de Segurança conforme recomendado

---

## Próximas Etapas

- [ ] Implementar autenticação com Google
- [ ] Criar painel administrativo para gerenciar avisos
- [ ] Integrar galeria com Instagram API
- [ ] Criar sistema de notificações push
- [ ] Implementar backup automático de dados
