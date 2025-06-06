const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const Evaluation = require('../models/Evaluation');

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware para verificar se é avaliador
const isAvaliador = (req, res, next) => {
    if (req.session.userRole === 'avaliador') {
        return next();
    }
    res.status(403).send('Acesso negado');
};

// Listar avaliações pendentes
router.get('/pending', isAuthenticated, isAvaliador, async (req, res) => {
    try {
        const cars = await Car.find({ status: 'pendente' })
            .populate('proprietario', 'name email')
            .sort({ createdAt: 1 });
        res.render('evaluations/pending', { cars });
    } catch (error) {
        res.status(500).send('Erro ao listar avaliações pendentes');
    }
});

// Listar minhas avaliações realizadas
router.get('/my', isAuthenticated, isAvaliador, async (req, res) => {
    try {
        const evaluations = await Evaluation.find({ avaliador: req.session.userId })
            .populate('car')
            .sort({ dataAvaliacao: -1 });
        res.render('evaluations/list', { evaluations });
    } catch (error) {
        res.status(500).send('Erro ao listar avaliações');
    }
});

// Página de nova avaliação
router.get('/new/:carId', isAuthenticated, isAvaliador, async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId)
            .populate('proprietario', 'name email');
        
        if (!car) {
            return res.status(404).send('Carro não encontrado');
        }

        if (car.status !== 'pendente') {
            return res.status(400).send('Este carro já foi avaliado');
        }

        res.render('evaluations/new', { car });
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de avaliação');
    }
});

// Criar nova avaliação
router.post('/new/:carId', isAuthenticated, isAvaliador, async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId);
        if (!car || car.status !== 'pendente') {
            return res.status(400).send('Carro não disponível para avaliação');
        }

        const {
            precoAvaliado,
            estadoGeral,
            motor,
            motorObs,
            carroceria,
            carroceriaObs,
            interior,
            interiorObs,
            documentacao,
            documentacaoObs,
            observacoes
        } = req.body;

        const evaluation = new Evaluation({
            car: car._id,
            avaliador: req.session.userId,
            precoAvaliado,
            estadoGeral,
            itensAvaliados: {
                motor: { estado: motor, observacao: motorObs },
                carroceria: { estado: carroceria, observacao: carroceriaObs },
                interior: { estado: interior, observacao: interiorObs },
                documentacao: { estado: documentacao, observacao: documentacaoObs }
            },
            observacoes
        });

        await evaluation.save();

        // Atualizar status do carro
        car.status = 'avaliado';
        car.evaluation = evaluation._id;
        await car.save();

        res.redirect('/evaluations/my');
    } catch (error) {
        res.status(500).send('Erro ao criar avaliação');
    }
});

// Visualizar detalhes da avaliação
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id)
            .populate('car')
            .populate('avaliador', 'name email');
        
        if (!evaluation) {
            return res.status(404).send('Avaliação não encontrada');
        }

        res.render('evaluations/details', { evaluation });
    } catch (error) {
        res.status(500).send('Erro ao carregar detalhes da avaliação');
    }
});

module.exports = router; 