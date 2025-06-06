const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    // Primeiro cliente para criar o banco de dados
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1234',
        database: 'postgres' // Conecta ao banco padrão primeiro
    });

    try {
        await client.connect();
        
        // Verifica se o banco de dados já existe
        const checkDb = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'drivexpert'"
        );

        if (checkDb.rows.length === 0) {
            // Criar o banco de dados se não existir
            await client.query('CREATE DATABASE drivexpert');
            console.log('Banco de dados criado com sucesso!');
        } else {
            console.log('Banco de dados já existe.');
        }

        await client.end();

        // Segundo cliente para criar as tabelas
        const dbClient = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '1234',
            database: 'drivexpert'
        });

        await dbClient.connect();

        // Primeiro, dropar as tabelas existentes se existirem
        try {
            await dbClient.query('DROP TABLE IF EXISTS evaluations CASCADE');
            await dbClient.query('DROP TABLE IF EXISTS cars CASCADE');
            await dbClient.query('DROP TABLE IF EXISTS users CASCADE');
            console.log('Tabelas antigas removidas com sucesso.');
        } catch (error) {
            console.error('Erro ao remover tabelas antigas:', error);
        }

        // Ler e executar o script SQL
        const sqlScript = fs.readFileSync(
            path.join(__dirname, 'init-db.sql'),
            'utf8'
        );

        // Remove a parte de criação do banco de dados do script
        const modifiedScript = sqlScript
            .replace(/CREATE DATABASE.*?;/g, '')
            .replace(/\\c.*?;/g, '')
            .trim();

        await dbClient.query(modifiedScript);
        console.log('Tabelas criadas com sucesso!');

        await dbClient.end();
        
        // Inicializar dados através do Sequelize
        const initializeDatabase = require('../config/initDb');
        await initializeDatabase();
        
        console.log('Setup do banco de dados concluído com sucesso!');
    } catch (error) {
        console.error('Erro durante o setup do banco de dados:', error);
        process.exit(1);
    }
}

setupDatabase(); 