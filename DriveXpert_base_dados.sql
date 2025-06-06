CREATE TABLE CLIENTE (
    id_cliente INT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100),
    conta_ativa BOOLEAN
);

CREATE TABLE PERFIL (
    id_perfil INT PRIMARY KEY,
    id_clienter INT,
    preferencias TEXT,
    data_criacao DATE,
    FOREIGN KEY (id_clienter) REFERENCES CLIENTE(id_cliente)
);

CREATE TABLE VENDEDOR (
    id_vendedor INT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    loja VARCHAR(100)
);

CREATE TABLE VEICULO (
    id_veiculo INT PRIMARY KEY,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    ano INT,
    preco DECIMAL(10,2),
    id_vendedor INT,
    FOREIGN KEY (id_vendedor) REFERENCES VENDEDOR(id_vendedor)
);

CREATE TABLE VENDA (
    id_venda INT PRIMARY KEY,
    id_cliente INT,
    id_veiculo INT,
    data_venda DATE,
    status_venda VARCHAR(50),
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente),
    FOREIGN KEY (id_veiculo) REFERENCES VEICULO(id_veiculo)
);

CREATE TABLE AVALIADOR (
    id_avaliador INT PRIMARY KEY,
    nome VARCHAR(100)
);

CREATE TABLE AVALIACAO (
    id_avaliacao INT PRIMARY KEY,
    id_avallador INT,
    id_veiculo INT,
    nota INT,
    comentarios TEXT,
    data_avaliacao DATE,
    FOREIGN KEY (id_avallador) REFERENCES AVALIADOR(id_avaliador),
    FOREIGN KEY (id_veiculo) REFERENCES VEICULO(id_veiculo)
);

-- INSERINDO DADOS FICTÍCIOS
INSERT INTO CLIENTE VALUES (1, 'Ana Silva', 'ana@email.com', 'senha123', TRUE);
INSERT INTO CLIENTE VALUES (2, 'Carlos Souza', 'carlos@email.com', 'senha456', TRUE);

INSERT INTO PERFIL VALUES (1, 1, 'SUV, Automático', '2024-01-15');
INSERT INTO PERFIL VALUES (2, 2, 'Hatch, Econômico', '2024-02-10');

INSERT INTO VENDEDOR VALUES (1, 'João Vendas', 'joao@loja.com', 'Loja Central');
INSERT INTO VENDEDOR VALUES (2, 'Maria Autos', 'maria@autos.com', 'Autos Top');

INSERT INTO VEICULO VALUES (1, 'Toyota', 'Corolla', 2020, 95000.00, 1);
INSERT INTO VEICULO VALUES (2, 'Ford', 'Ka', 2018, 40000.00, 2);

INSERT INTO VENDA VALUES (1, 1, 1, '2025-01-20', 'concluída');
INSERT INTO VENDA VALUES (2, 2, 2, '2025-02-10', 'pendente');

INSERT INTO AVALIADOR VALUES (1, 'Juliana Lopes');
INSERT INTO AVALIADOR VALUES (2, 'Pedro Ramos');

INSERT INTO AVALIACAO VALUES (1, 1, 1, 5, 'Carro excelente!', '2025-02-01');
INSERT INTO AVALIACAO VALUES (2, 2, 2, 4, 'Bom custo-benefício.', '2025-03-05');

CREATE DATABASE drivexpert;
