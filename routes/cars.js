const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware para verificar se é vendedor
const isVendedor = (req, res, next) => {
    if (req.session.userRole === 'vendedor') {
        return next();
    }
    res.status(403).send('Acesso negado');
};

// Listar carros do vendedor
router.get('/my', isAuthenticated, isVendedor, async (req, res) => {
    try {
        const cars = await Car.find({ proprietario: req.session.userId })
            .sort({ createdAt: -1 });
        res.render('cars/list', { cars });
    } catch (error) {
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
        const existingCar = await Car.findOne({ placa });
        if (existingCar) {
            return res.render('cars/new', {
                error: 'Já existe um carro cadastrado com esta placa'
            });
        }

        const car = new Car({
            marca,
            modelo,
            ano,
            kilometragem,
            placa,
            cor,
            combustivel,
            observacoes,
            proprietario: req.session.userId,
            status: 'pendente'
        });

        await car.save();
        res.redirect('/cars/my');
    } catch (error) {
        res.render('cars/new', {
            error: 'Erro ao cadastrar carro'
        });
    }
});

// Visualizar detalhes do carro
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
            .populate('proprietario', 'name email')
            .populate('evaluation');
        
        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        res.render('cars/details', { car });
    } catch (error) {
        res.status(500).send('Erro ao carregar detalhes do carro');
    }
});

// Editar carro
router.get('/:id/edit', isAuthenticated, isVendedor, async (req, res) => {
    try {
        const car = await Car.findOne({
            _id: req.params.id,
            proprietario: req.session.userId
        });

        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        res.render('cars/edit', { car });
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de edição');
    }
});

// Atualizar carro
router.post('/:id/edit', isAuthenticated, isVendedor, async (req, res) => {
    try {
        const car = await Car.findOne({
            _id: req.params.id,
            proprietario: req.session.userId
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
            const existingCar = await Car.findOne({ placa });
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
        res.status(500).send('Erro ao atualizar carro');
    }
});

// Excluir carro
router.post('/:id/delete', isAuthenticated, isVendedor, async (req, res) => {
    try {
        const car = await Car.findOne({
            _id: req.params.id,
            proprietario: req.session.userId
        });

        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        // Só permite excluir se ainda não foi avaliado
        if (car.status !== 'pendente') {
            return res.status(400).send('Não é possível excluir um carro que já foi avaliado');
        }

        await car.remove();
        res.redirect('/cars/my');
    } catch (error) {
        res.status(500).send('Erro ao excluir carro');
    }
});

// Listar carros disponíveis (para clientes)
router.get('/available', isAuthenticated, async (req, res) => {
    try {
        const cars = await Car.find({ status: 'avaliado' })
            .populate('evaluation')
            .sort({ createdAt: -1 });
        res.render('cars/available', { cars });
    } catch (error) {
        res.status(500).send('Erro ao listar carros disponíveis');
    }
});

module.exports = router; 