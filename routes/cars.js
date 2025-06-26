const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const User = require('../models/User');
const Evaluation = require('../models/Evaluation');

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware para verificar se é vendedor
const isVendedor = (req, res, next) => {
    if (req.session.userRole === 'seller') {
        return next();
    }
    res.status(403).send('Acesso negado');
};

// Listar carros do vendedor
router.get('/my', isAuthenticated, isVendedor, async (req, res) => {
    try {
        const cars = await Car.findAll({ 
            where: { vendedor_id: req.session.userId },
            order: [['created_at', 'DESC']]
        });
        res.render('cars/list', { cars });
    } catch (error) {
        console.error('Erro ao listar carros:', error);
        res.status(500).send('Erro ao listar carros');
    }
});

// Página de novo carro
router.get('/new', isAuthenticated, isVendedor, (req, res) => {
    res.render('cars/new');
});

// Cadastrar novo carro
router.post('/new', isAuthenticated, isVendedor, async (req, res) => {
    try {
        const {
            marca,
            modelo,
            ano,
            kilometragem,
            placa,
            cor,
            combustivel,
            observacoes
        } = req.body;

        // Verificar se já existe um carro com esta placa
        const existingCar = await Car.findOne({ where: { placa } });
        if (existingCar) {
            return res.render('cars/new', {
                error: 'Já existe um carro cadastrado com esta placa'
            });
        }

        await Car.create({
            marca,
            modelo,
            ano,
            kilometragem: parseInt(String(kilometragem).replace(/\D/g, ''), 10),
            placa,
            cor,
            combustivel,
            observacoes,
            vendedor_id: req.session.userId,
            status: 'pendente'
        });

        res.redirect('/cars/my');
    } catch (error) {
        console.error('Erro ao cadastrar carro:', error);
        res.render('cars/new', {
            error: 'Erro ao cadastrar carro'
        });
    }
});

// Visualizar detalhes do carro
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'vendedor',
                    attributes: ['name', 'email']
                },
                {
                    model: Evaluation,
                    as: 'evaluation'
                }
            ]
        });
        
        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        res.render('cars/details', { car });
    } catch (error) {
        console.error('Erro ao carregar detalhes do carro:', error);
        res.status(500).send('Erro ao carregar detalhes do carro');
    }
});

// Editar carro
router.get('/:id/edit', isAuthenticated, isVendedor, async (req, res) => {
    try {
        const car = await Car.findOne({
            where: {
                id: req.params.id,
                vendedor_id: req.session.userId
            }
        });

        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        res.render('cars/edit', { car });
    } catch (error) {
        console.error('Erro ao carregar formulário de edição:', error);
        res.status(500).send('Erro ao carregar formulário de edição');
    }
});

// Atualizar carro
router.post('/:id/edit', isAuthenticated, isVendedor, async (req, res) => {
    try {
        const car = await Car.findOne({
            where: {
                id: req.params.id,
                vendedor_id: req.session.userId
            }
        });

        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        const {
            marca,
            modelo,
            ano,
            kilometragem,
            placa,
            cor,
            combustivel,
            observacoes
        } = req.body;

        // Verificar se a nova placa já existe em outro carro
        if (placa !== car.placa) {
            const existingCar = await Car.findOne({ where: { placa } });
            if (existingCar) {
                return res.render('cars/edit', {
                    car,
                    error: 'Já existe um carro cadastrado com esta placa'
                });
            }
        }

        car.marca = marca;
        car.modelo = modelo;
        car.ano = ano;
        car.kilometragem = kilometragem;
        car.placa = placa;
        car.cor = cor;
        car.combustivel = combustivel;
        car.observacoes = observacoes;

        await car.save();
        res.redirect('/cars/my');
    } catch (error) {
        console.error('Erro ao atualizar carro:', error);
        res.status(500).send('Erro ao atualizar carro');
    }
});

// Excluir carro
router.post('/:id/delete', isAuthenticated, isVendedor, async (req, res) => {
    try {
        const car = await Car.findOne({
            where: {
                id: req.params.id,
                vendedor_id: req.session.userId
            }
        });

        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        // Só permite excluir se ainda não foi avaliado
        if (car.status !== 'pendente') {
            return res.status(400).send('Não é possível excluir um carro que já foi avaliado');
        }

        await car.destroy();
        res.redirect('/cars/my');
    } catch (error) {
        console.error('Erro ao excluir carro:', error);
        res.status(500).send('Erro ao excluir carro');
    }
});

// Listar carros disponíveis (para clientes)
router.get('/available', isAuthenticated, async (req, res) => {
    try {
        const cars = await Car.findAll({ 
            where: { status: 'avaliado' },
            include: [{
                model: Evaluation,
                as: 'evaluation'
            }],
            order: [['created_at', 'DESC']]
        });
        res.render('cars/available', { cars });
    } catch (error) {
        console.error('Erro ao listar carros disponíveis:', error);
        res.status(500).send('Erro ao listar carros disponíveis');
    }
});

// Solicitar avaliação (para clientes)
router.post('/:id/request-evaluation', isAuthenticated, async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        
        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        if (car.status !== 'avaliado') {
            return res.status(400).send('Este carro não está disponível para solicitação');
        }

        // Aqui você pode implementar a lógica de solicitação
        // Por exemplo, criar uma tabela de solicitações ou marcar o carro como solicitado
        
        res.redirect('/cars/available');
    } catch (error) {
        console.error('Erro ao solicitar avaliação:', error);
        res.status(500).send('Erro ao solicitar avaliação');
    }
});

module.exports = router; 