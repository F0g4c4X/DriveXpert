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

\c drivexpert;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    ano INTEGER NOT NULL,
    kilometragem INTEGER NOT NULL,
    placa VARCHAR(10) UNIQUE NOT NULL,
    cor VARCHAR(30) NOT NULL,
    combustivel VARCHAR(20) NOT NULL,
    preco DECIMAL(10,2),
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'pendente',
    vendedor_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id),
    avaliador_id INTEGER REFERENCES users(id),
    preco_avaliado DECIMAL(10,2) NOT NULL,
    estado_geral VARCHAR(20) NOT NULL,
    motor_estado VARCHAR(20) NOT NULL,
    motor_observacao TEXT,
    carroceria_estado VARCHAR(20) NOT NULL,
    carroceria_observacao TEXT,
    interior_estado VARCHAR(20) NOT NULL,
    interior_observacao TEXT,
    documentacao_estado VARCHAR(20) NOT NULL,
    documentacao_observacao TEXT,
    observacoes TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cars_vendedor ON cars(vendedor_id);
CREATE INDEX idx_evaluations_car ON evaluations(car_id);
CREATE INDEX idx_evaluations_avaliador ON evaluations(avaliador_id); 