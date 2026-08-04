# Zuppy

Loja virtual acadêmica de brinquedos personalizados (Action Figures), desenvolvida para o Projeto Integrador da disciplina DAD (Desenvolvimento de Aplicações Dinâmicas). MVP com catálogo dinâmico, carrinho, checkout, autenticação e um conjunto completo de recursos de acessibilidade.

## Stack

- **Front-end**: HTML5 semântico, CSS3 puro e JavaScript vanilla (sem frameworks), com DOM manipulado dinamicamente — catálogo, carrinho, favoritos e carrosséis da home são renderizados via JS a partir de `js/produtos-data.js`, sem nenhum bundler.
- **Back-end**: Java 19 + Spring Boot 3.3.7 (Spring Web, Spring Data JPA, Spring Security), autenticação via JWT (`jjwt`).
- **Banco de dados**: PostgreSQL.
- **Persistência no cliente**: carrinho e favoritos usam `localStorage` (`CarrinhoStore` e `FavoritosStore`, em `js/carrinho-store.js` e `js/favoritos-store.js`) — o catálogo de produtos ainda é só front-end (`js/produtos-data.js`). Usuário e Pedido têm persistência real no Postgres.

## Integrantes e responsabilidades

| Área | Responsável(is) |
|---|---|
| Prototipação UI/UX no Figma | Pedro & Julio |
| Desenvolvimento Frontend (HTML, CSS, JS Vanilla + A11y) | Pedro & Julio |
| Modelagem do banco de dados | Emanuelly & Anna |
| Desenvolvimento Backend | Emanuelly, Anna & Heitor |
| Documentação contínua | Toda a equipe |

### Detalhamento por integrante (Etapa 2)

- **Pedro** — Protótipos no Figma · Implementação HTML/CSS/JS · Recursos de A11y no frontend.
- **Julio** — Design system e componentes no Figma · Implementação HTML/CSS/JS · Testes com Lighthouse e axe DevTools · Recursos de A11y no frontend.
- **Emanuelly** — Rotas do backend · Arquitetura do backend (controllers, services, middleware) · Integração com o banco de dados.
- **Anna** — Arquitetura do backend (controllers, services, middleware) · Integração com o banco de dados · Atributos, tipos e restrições do banco de dados · Apoio nas rotas do backend.
- **Heitor** — Diagrama ER · Modelagem das entidades (Produto, Usuário, Pedido, Carrinho) · Script para popular o banco de dados.

## Execução

1. Crie um arquivo `.env` na raiz do projeto com as variáveis usadas em `application.yml`:

   ```
   DB_URL=jdbc:postgresql://localhost:5432/zuppy
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=uma-chave-secreta-longa
   JWT_EXPIRATION_MS=86400000
   ```

   `DB_URL`/`DB_USERNAME`/`DB_PASSWORD` têm valores padrão (banco `zuppy` local); `JWT_SECRET` é obrigatório e não tem valor padrão. O schema do banco precisa existir previamente (`ddl-auto: validate`) — rode `db/pedidos.sql` contra o banco antes de subir a aplicação, caso as tabelas `pedidos`/`itens_pedido` ainda não existam.
2. Execute o projeto com Maven e Java 19 (ex.: `mvn spring-boot:run`, ou `./mvnw spring-boot:run` se o wrapper estiver presente).
3. Acesse `http://localhost:8081` (porta configurável via `SERVER_PORT`).

## Acessibilidade

O projeto possui um menu de recursos assistivos disponível em todas as páginas, integração com VLibras, navegação por teclado, indicador de foco personalizado, preferências persistentes no navegador e uma página dedicada à documentação dos recursos.

### Atalhos

- `Shift + A`: abre ou fecha o menu de recursos assistivos
- `Shift + L`: abre ou fecha o VLibras
- `Shift + P`: seleciona o campo de pesquisa
- `Tab`: avança entre elementos interativos
- `Shift + Tab`: volta ao elemento anterior
- `Esc`: fecha o painel ou a janela aberta

## Declaração de uso de IA

Em conformidade com o item 10.1 do documento da atividade: partes deste projeto foram desenvolvidas com apoio de IA (Claude, Anthropic), incluindo trechos de front-end , análise de backend e esta documentação. Todo o código gerado foi revisado e testado manualmente antes de ser commitado, e qualquer integrante do grupo deve ser capaz de explicar essas partes na arguição técnica, independentemente de quem as commitou.
