# Poker Ledger

## Problema, público-alvo e proposta

Em partidas recreativas, é comum controlar os stacks dos participantes em anotações ou planilhas que ficam desatualizadas e são difíceis de consultar. O Poker Ledger é voltado a organizadores de mesas e grupos de poker que precisam manter os jogadores e suas quantidades de fichas organizados em um só lugar. Cada conta tem uma lista privada de jogadores, com cadastro, consulta, edição e exclusão de registros.

## Funcionalidades

- Login real validado pela API Spring Boot, com senha armazenada em BCrypt e JWT com expiração de uma hora.
- Rotas Angular protegidas e envio automático do token como `Authorization: Bearer`.
- CRUD de jogadores, incluindo nome, apelido, fichas e observações.
- Resumo da mesa com total de jogadores, fichas e stack médio.
- Validação de formulários, feedback de erros e sucesso e confirmação antes de excluir.
- Persistência relacional local com H2 e Spring Data JPA; os registros são isolados por usuário.

## Executar localmente

Requisitos: Java 17, Maven e Node.js 20.19+, 22.12+ ou 24+.

1. Inicie a API:

   ```powershell
   $bytes = New-Object byte[] 32
   [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
   $env:JWT_SECRET = [Convert]::ToBase64String($bytes)
   cd backend
   mvn spring-boot:run
   ```

2. Em outro terminal, inicie o Angular:

   ```powershell
   cd frontend
   npm install
   npm start
   ```

3. Abra `http://localhost:4200` e entre com a conta inicial:

   - Usuário: `admin`
   - Senha: `Poker123!`

A API fica em `http://localhost:8080`; o H2 salva os dados em `backend/data/`, mantendo-os após reiniciar o serviço. A conta de demonstração é criada automaticamente na primeira inicialização. A variável `JWT_SECRET` é obrigatória e deve conter uma chave Base64 de pelo menos 256 bits.

## Rotas principais

- `POST /api/auth/login` — autenticação e emissão do JWT.
- `GET /api/players` e `GET /api/players/{id}` — listagem e consulta autenticadas.
- `POST /api/players` — cadastro autenticado (retorna `201 Created`).
- `PUT /api/players/{id}` — atualização autenticada.
- `DELETE /api/players/{id}` — exclusão autenticada (retorna `204 No Content`).
