-- Cria as tabelas de pedidos, necessarias para o endpoint /pedidos.
-- Rode este script contra o banco Postgres configurado em DB_URL antes de subir a aplicacao
-- com as novas entidades (o projeto usa ddl-auto: validate, entao o schema precisa existir
-- previamente -- a aplicacao nao cria tabelas sozinha).

create table if not exists pedidos (
    id serial primary key,
    usuario_id integer not null references usuarios(id),
    nome_completo varchar(150) not null,
    cep varchar(9) not null,
    numero varchar(20) not null,
    endereco varchar(200) not null,
    complemento varchar(100),
    bairro varchar(100) not null,
    cidade varchar(100) not null,
    uf char(2) not null,
    forma_pagamento varchar(20) not null,
    total numeric(12, 2) not null,
    status varchar(20) not null default 'CONFIRMADO',
    criado_em timestamp not null default now()
);

create table if not exists itens_pedido (
    id serial primary key,
    pedido_id integer not null references pedidos(id) on delete cascade,
    ordem_item integer not null default 0,
    produto_id varchar(100) not null,
    nome_produto varchar(200) not null,
    preco numeric(12, 2) not null,
    quantidade integer not null
);

create index if not exists idx_pedidos_usuario_id on pedidos(usuario_id);
create index if not exists idx_itens_pedido_pedido_id on itens_pedido(pedido_id);
