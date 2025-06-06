-- Criar o banco de dados se não existir
CREATE DATABASE drivexpert;

-- Conectar ao banco de dados
\c drivexpert;

-- Criar extensão para UUID se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabelas
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

-- Criar índices
CREATE INDEX idx_cars_vendedor ON cars(vendedor_id);
CREATE INDEX idx_evaluations_car ON evaluations(car_id);
CREATE INDEX idx_evaluations_avaliador ON evaluations(avaliador_id); 