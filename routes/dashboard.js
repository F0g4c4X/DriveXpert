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

// Rota do dashboard
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userRole = req.session.userRole;
        const userId = req.session.userId;
        let stats = {};
        let activities = [];

        switch (userRole) {
            case 'seller':
                stats.totalCars = await Car.count({ 
                    where: { vendedor_id: userId }
                });
                stats.pendingEvaluations = await Car.count({ 
                    where: { 
                        vendedor_id: userId,
                        status: 'pendente'
                    }
                });

                // Atividades recentes do vendedor
                const recentCars = await Car.findAll({ 
                    where: { vendedor_id: userId },
                    order: [['created_at', 'DESC']],
                    limit: 5
                });
                
                activities = recentCars.map(car => ({
                    icon: 'bi-car-front',
                    description: `Carro ${car.marca} ${car.modelo} foi ${car.status}`,
                    date: car.created_at.toLocaleDateString()
                }));
                break;

            case 'evaluator':
                stats.pendingEvaluations = await Car.count({ 
                    where: { status: 'pendente' }
                });
                stats.completedEvaluations = await Evaluation.count({ 
                    where: { avaliador_id: userId }
                });

                // Atividades recentes do avaliador
                const recentEvaluations = await Evaluation.findAll({ 
                    where: { avaliador_id: userId },
                    include: [{
                        model: Car,
                        as: 'car'
                    }],
                    order: [['data_avaliacao', 'DESC']],
                    limit: 5
                });
                
                activities = recentEvaluations.map(eval => ({
                    icon: 'bi-clipboard-check',
                    description: `Avaliação do ${eval.car.marca} ${eval.car.modelo} concluída`,
                    date: eval.data_avaliacao.toLocaleDateString()
                }));
                break;

            case 'client':
                stats.availableCars = await Car.count({ 
                    where: { status: 'avaliado' }
                });
                stats.myRequests = await Car.count({ 
                    where: { vendedor_id: userId }
                });

                // Atividades recentes do cliente
                const recentRequests = await Car.findAll({ 
                    where: { vendedor_id: userId },
                    include: [{
                        model: Evaluation,
                        as: 'evaluation'
                    }],
                    order: [['created_at', 'DESC']],
                    limit: 5
                });
                
                activities = recentRequests.map(car => ({
                    icon: 'bi-clipboard',
                    description: `Solicitação para ${car.marca} ${car.modelo} - ${car.status}`,
                    date: car.created_at.toLocaleDateString()
                }));
                break;
        }

        res.render('dashboard', {
            user: { name: req.session.userName },
            userRole,
            stats,
            activities
        });
    } catch (error) {
        console.error('Erro no dashboard:', error);
        res.status(500).send('Erro ao carregar o dashboard');
    }
});

module.exports = router; 