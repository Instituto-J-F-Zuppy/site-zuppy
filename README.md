# Zuppy

Loja virtual acadêmica de brinquedos personalizados (Action Figures), desenvolvida para o Projeto Integrador da disciplina DAD (Desenvolvimento de Aplicações Dinâmicas). MVP com catálogo dinâmico, carrinho, checkout, autenticação e um conjunto completo de recursos de acessibilidade.

## Stack

- **Front-end**: HTML5 semântico, CSS3 puro e JavaScript vanilla (sem frameworks), com DOM manipulado dinamicamente — catálogo, carrinho, favoritos e carrosséis da home são renderizados via JS a partir de `js/produtos-data.js`, sem nenhum bundler.
- **Back-end**: Java 19 + Spring Boot 3.3.7 (Spring Web, Spring Data JPA, Spring Security), autenticação via JWT (`jjwt`).
- **Banco de dados**: PostgreSQL.
- **Persistência no cliente**: carrinho e favoritos usam `localStorage` (`CarrinhoStore` e `FavoritosStore`, em `js/carrinho-store.js` e `js/favoritos-store.js`) — o catálogo exibido no front (`js/produtos-data.js`) ainda é um array próprio, sincronizado manualmente com a tabela `brinquedos`. **Usuário, Endereço e Pedido (com itens, pagamento e histórico de status) têm persistência real no Postgres.**
- **Autenticação**: JWT stateless (`Authorization: Bearer <token>`), senha com hash BCrypt, filtro (`JwtAuthenticationFilter`) valida o token em toda requisição autenticada antes de chegar no controller.

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

   `DB_URL`/`DB_USERNAME`/`DB_PASSWORD` têm valores padrão (banco `zuppy` local); `JWT_SECRET` é obrigatório e não tem valor padrão. O schema do banco precisa existir previamente (`ddl-auto: validate` — a aplicação nunca cria ou altera tabela sozinha, só confere se bate com o que as entidades esperam). As tabelas usadas (`usuarios`, `pedidos`, `pedido_itens`, `enderecos`, `pagamentos`, `pagamento_metodos`, `pedido_status_tipo`, `pedido_historico_status`, `brinquedos`, `cidades`, `estados`, entre outras) já existem no banco compartilhado do grupo.
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

Em conformidade com o item 10.1 do documento da atividade, este projeto teve apoio de IA (Claude, Anthropic) em partes específicas do desenvolvimento. Listamos abaixo o que foi apoiado por IA nas sessões de trabalho que geraram esses commits, para transparência:

- **Correção de bugs de front-end**: exibição de sessão logada em todas as páginas, badge do carrinho, conexão do carrinho entre páginas (`js/sessao.js`, `js/carrinho-store.js`).
- **Catálogo e home dinâmicos**: reescrita de `js/produtos-data.js`, `js/todos-produtos.js`, `js/produto.js` e `js/index-produtos.js` para renderização via JavaScript em vez de HTML fixo.
- **Checkout e histórico de pedidos** (`checkout.html`/`js/checkout.js`, `meus-pedidos.html`/`js/meus-pedidos.js`): funcionalidade que não existia antes.
- **Backend de pedidos** (`model/Pedido.java`, `ItemPedido.java`, `Endereco.java`, `Cidade.java`, `Estado.java`, `Pagamento.java`, `PagamentoMetodo.java`, `PedidoStatusTipo.java`, `PedidoHistoricoStatus.java`, `Brinquedo.java`, e os repositories/service/controller correspondentes): entidades, endpoints (`POST/GET /pedidos`) e a lógica de recalcular preço no servidor a partir do banco.
- **Correção de contraste e nomes acessíveis** apontados pelo Lighthouse (`css/style.css`, `css/login.css`, setas de carrossel em `index.html`).
- **Sincronização de dados**: correção de preços do catálogo divergentes da tabela `brinquedos` no banco.
- **Esta documentação** (README).

Esta lista cobre o que foi apoiado por IA nas sessões registradas nos commits acima — **cada integrante deve complementar esta seção** com qualquer parte anterior do projeto (ex.: login/cadastro, menu de acessibilidade, prototipação) que também tenha tido apoio de IA, para a declaração ficar completa. Todo o código gerado com apoio de IA foi revisado e testado manualmente antes de ser commitado (incluindo verificação em navegador dos fluxos de carrinho, favoritos, checkout e histórico de pedidos), e qualquer integrante do grupo deve ser capaz de explicar essas partes na arguição técnica, independentemente de quem as commitou.
