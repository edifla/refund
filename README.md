# Refund — front-end

Aplicação de solicitação de reembolsos (desafio Rocketseat, formação React 2025).

Stack: Vite + React + TypeScript, TailwindCSS, Axios, React Query, React Hook Form e React Router.

## Como rodar

1. Suba a API antes (repositório `refund-api`, em `http://localhost:3333`):

   ```bash
   npm i
   npm run db:prepare
   npm run dev
   ```

2. Neste projeto:

   ```bash
   npm i
   npm run dev
   ```

   Abra `http://localhost:5173`.

Se a API estiver em outro endereço, copie `.env.example` para `.env` e ajuste `VITE_API_URL`.

## Telas

- `/` — lista paginada de reembolsos com busca pelo nome.
- `/novo` — modal de nova solicitação (nome, valor, categoria e comprovante JPG/PNG/PDF até 2MB).
- `/refunds/:id` — detalhes, visualização do comprovante e exclusão com confirmação.
- `/sucesso` — confirmação após o envio.

## Pontos da API a conhecer

- **Valor em reais.** A documentação fala em centavos, mas o service da API multiplica por 100 ao salvar e divide ao ler. Por isso o front envia e recebe o valor em reais (ex.: `50.5`).
- **Fluxo de criação.** O comprovante é enviado primeiro (`POST /receipts`), depois o reembolso (`POST /refunds`) com o ID do recibo.
- **Paginação.** A listagem usa `page` e `q`; a resposta traz `meta` e `data`.
