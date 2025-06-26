const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const Evaluation = require('../models/Evaluation');
const User = require('../models/User');

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware para verificar se é avaliador
const isAvaliador = (req, res, next) => {
    if (req.session.userRole === 'evaluator') {
        return next();
    }
    res.status(403).send('Acesso negado');
};

// Listar avaliações pendentes
router.get('/pending', isAuthenticated, isAvaliador, async (req, res) => {
    try {
        const cars = await Car.findAll({ 
            where: { status: 'pendente' },
            include: [{
                model: User,
                as: 'vendedor',
                attributes: ['name', 'email']
            }],
            order: [['created_at', 'ASC']]
        });
        res.render('evaluations/pending', { cars });
    } catch (error) {
        console.error('Erro ao listar avaliações pendentes:', error);
        res.status(500).send('Erro ao listar avaliações pendentes');
    }
});

// Listar minhas avaliações realizadas
router.get('/my', isAuthenticated, isAvaliador, async (req, res) => {
    try {
        const evaluations = await Evaluation.findAll({ 
            where: { avaliador_id: req.session.userId },
            include: [{
                model: Car,
                as: 'car'
            }],
            order: [['data_avaliacao', 'DESC']]
        });
        res.render('evaluations/list', { evaluations });
    } catch (error) {
        console.error('Erro ao listar avaliações:', error);
        res.status(500).send('Erro ao listar avaliações');
    }
});

// Página de nova avaliação
router.get('/new/:carId', isAuthenticated, isAvaliador, async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.carId, {
            include: [{
                model: User,
                as: 'vendedor',
                attributes: ['name', 'email']
            }]
        });
        
        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        if (car.status !== 'pendente') {
            return res.status(400).send('Este carro já foi avaliado');
        }

        res.render('evaluations/new', { car });
    } catch (error) {
        console.error('Erro ao carregar formulário de avaliação:', error);
        res.status(500).send('Erro ao carregar formulário de avaliação');
    }
});

// Criar nova avaliação
router.post('/new/:carId', isAuthenticated, isAvaliador, async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.carId);
        if (!car || car.status !== 'pendente') {
            return res.status(400).send('Carro não disponível para avaliação');
        }

        const {
            preco_avaliado,
            estado_geral,
            motor_estado,
            motor_observacao,
            carroceria_estado,
            carroceria_observacao,
            interior_estado,
            interior_observacao,
            documentacao_estado,
            documentacao_observacao,
            observacoes
        } = req.body;

        const evaluation = await Evaluation.create({
            car_id: car.id,
            avaliador_id: req.session.userId,
            preco_avaliado,
            estado_geral,
            motor_estado,
            motor_observacao,
            carroceria_estado,
            carroceria_observacao,
            interior_estado,
            interior_observacao,
            documentacao_estado,
            documentacao_observacao,
            observacoes
        });

        // Atualizar status do carro
        car.status = 'avaliado';
        car.evaluation_id = evaluation.id;
        await car.save();

        res.redirect('/evaluations/my');
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        res.status(500).send('Erro ao criar avaliação');
    }
});

// Visualizar detalhes da avaliação
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const evaluation = await Evaluation.findByPk(req.params.id, {
            include: [
                {
                    model: Car,
                    as: 'car'
                },
                {
                    model: User,
                    as: 'avaliador',
                    attributes: ['name', 'email']
                }
            ]
        });
        
        if (!evaluation) {
            return res.status(404).send('Avaliação não encontrada');
        }

        res.render('evaluations/details', { evaluation });
    } catch (error) {
        console.error('Erro ao carregar detalhes da avaliação:', error);
        res.status(500).send('Erro ao carregar detalhes da avaliação');
    }
});

module.exports = router; 