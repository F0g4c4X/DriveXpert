const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1234',
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log('Conexão estabelecida com sucesso!');
        
        const result = await client.query('SELECT version()');
        console.log('Versão do PostgreSQL:', result.rows[0].version);
        
        await client.end();
    } catch (error) {
        console.error('Erro ao conectar:', error);
    }
}

testConnection(); 