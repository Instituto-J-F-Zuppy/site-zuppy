-- Cria (ou ajusta, se ja existirem com outro formato) as tabelas de pedidos usadas pelo
-- endpoint /pedidos. Idempotente: pode rodar mais de uma vez sem erro, e usa
-- "add column if not exists" para o caso de a tabela ja existir com um schema
-- diferente do esperado pelas entidades JPA (Pedido/ItemPedido).
--
-- Rode este script contra o banco Postgres configurado em DB_URL antes de subir a
-- aplicacao com estas entidades -- o projeto usa ddl-auto: validate, entao o schema
-- precisa existir e bater exatamente com as colunas abaixo (a aplicacao nao cria
-- nem altera tabelas sozinha).

create table if not exists pedidos (
    id serial primary key
);

alter table pedidos add column if not exists usuario_id integer;
alter table pedidos add column if not exists nome_completo varchar(150);
alter table pedidos add column if not exists cep varchar(9);
alter table pedidos add column if not exists numero varchar(20);
alter table pedidos add column if not exists endereco varchar(200);
alter table pedidos add column if not exists complemento varchar(100);
alter table pedidos add column if not exists bairro varchar(100);
alter table pedidos add column if not exists cidade varchar(100);
alter table pedidos add column if not exists uf char(2);
alter table pedidos add column if not exists forma_pagamento varchar(20);
alter table pedidos add column if not exists total numeric(12, 2);
alter table pedidos add column if not exists status varchar(20) default 'CONFIRMADO';
alter table pedidos add column if not exists criado_em timestamp default now();

do $$
begin
    if not exists (
        select 1 from information_schema.table_constraints
        where constraint_name = 'pedidos_usuario_id_fkey'
    ) then
        alter table pedidos
            add constraint pedidos_usuario_id_fkey
            foreign key (usuario_id) references usuarios(id);
    end if;
end $$;

create table if not exists itens_pedido (
    id serial primary key
);

alter table itens_pedido add column if not exists pedido_id integer;
alter table itens_pedido add column if not exists ordem_item integer default 0;
alter table itens_pedido add column if not exists produto_id varchar(100);
alter table itens_pedido add column if not exists nome_produto varchar(200);
alter table itens_pedido add column if not exists preco numeric(12, 2);
alter table itens_pedido add column if not exists quantidade integer;

do $$
begin
    if not exists (
        select 1 from information_schema.table_constraints
        where constraint_name = 'itens_pedido_pedido_id_fkey'
    ) then
        alter table itens_pedido
            add constraint itens_pedido_pedido_id_fkey
            foreign key (pedido_id) references pedidos(id) on delete cascade;
    end if;
end $$;

create index if not exists idx_pedidos_usuario_id on pedidos(usuario_id);
create index if not exists idx_itens_pedido_pedido_id on itens_pedido(pedido_id);

-- Depois de rodar, garanta que as colunas obrigatorias abaixo nao tenham
-- linhas nulas antes de marca-las como NOT NULL (pule este bloco se a tabela
-- ja tinha dados incompativeis e preferir revisar manualmente):
-- alter table pedidos alter column usuario_id set not null;
-- alter table pedidos alter column nome_completo set not null;
-- alter table pedidos alter column cep set not null;
-- alter table pedidos alter column numero set not null;
-- alter table pedidos alter column endereco set not null;
-- alter table pedidos alter column bairro set not null;
-- alter table pedidos alter column cidade set not null;
-- alter table pedidos alter column uf set not null;
-- alter table pedidos alter column forma_pagamento set not null;
-- alter table pedidos alter column total set not null;
-- alter table pedidos alter column status set not null;
-- alter table pedidos alter column criado_em set not null;
-- alter table itens_pedido alter column pedido_id set not null;
-- alter table itens_pedido alter column ordem_item set not null;
-- alter table itens_pedido alter column produto_id set not null;
-- alter table itens_pedido alter column nome_produto set not null;
-- alter table itens_pedido alter column preco set not null;
-- alter table itens_pedido alter column quantidade set not null;
