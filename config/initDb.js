const bcrypt = require('bcryptjs');
const sequelize = require('./database');
const User = require('../models/User');
const Car = require('../models/Car');
const Evaluation = require('../models/Evaluation');

async function initializeDatabase() {
    try {
        // Sincronizar modelos com o banco de dados
        await sequelize.sync({ alter: true });

        // Criar usuários de exemplo
        const users = [
            {
                name: 'Cliente Exemplo',
                email: 'cliente@example.com',
                password: await bcrypt.hash('123456', 10),
                role: 'client'
            },
            {
                name: 'Vendedor Exemplo',
                email: 'vendedor@example.com',
                password: await bcrypt.hash('123456', 10),
                role: 'seller'
            },
            {
                name: 'Avaliador Exemplo',
                email: 'avaliador@example.com',
                password: await bcrypt.hash('123456', 10),
                role: 'evaluator'
            }
        ];

        for (const userData of users) {
            await User.findOrCreate({
                where: { email: userData.email },
                defaults: userData
            });
        }

        // Obter IDs dos usuários criados
        const vendedor = await User.findOne({ where: { role: 'seller' } });
        const avaliador = await User.findOne({ where: { role: 'evaluator' } });

        // Criar carros de exemplo
        const cars = [
            {
                marca: 'Toyota',
                modelo: 'Corolla',
                ano: 2020,
                kilometragem: 45000,
                placa: 'ABC1234',
                cor: 'Prata',
                combustivel: 'Flex',
                preco: 85000.00,
                observacoes: 'Carro em excelente estado',
                status: 'disponível',
                vendedor_id: vendedor.id
            },
            {
                marca: 'Honda',
                modelo: 'Civic',
                ano: 2019,
                kilometragem: 60000,
                placa: 'XYZ5678',
                cor: 'Preto',
                combustivel: 'Flex',
                preco: 78000.00,
                observacoes: 'Único dono',
                status: 'pendente',
                vendedor_id: vendedor.id
            }
        ];

        for (const carData of cars) {
            await Car.findOrCreate({
                where: { placa: carData.placa },
                defaults: carData
            });
        }

        // Criar avaliações de exemplo
        const car = await Car.findOne({ where: { placa: 'ABC1234' } });
        
        if (car) {
            await Evaluation.findOrCreate({
                where: {
                    car_id: car.id,
                    avaliador_id: avaliador.id
                },
                defaults: {
                    car_id: car.id,
                    avaliador_id: avaliador.id,
                    preco_avaliado: 82000.00,
                    estado_geral: 'Bom',
                    motor_estado: 'Ótimo',
                    motor_observacao: 'Motor em perfeito estado',
                    carroceria_estado: 'Bom',
                    carroceria_observacao: 'Pequenos arranhões',
                    interior_estado: 'Ótimo',
                    interior_observacao: 'Interior bem conservado',
                    documentacao_estado: 'Regular',
                    documentacao_observacao: 'Documentação em dia',
                    observacoes: 'Carro bem conservado no geral'
                }
            });
        }

        console.log('Dados de exemplo inseridos com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar dados:', error);
        throw error;
    }
}

module.exports = initializeDatabase; 