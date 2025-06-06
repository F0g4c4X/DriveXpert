const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware para verificar se usuário está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

// Rota de login - página
router.get('/login', (req, res) => {
    res.render('auth/login', { error: null });
});

// Rota de login - processamento
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ 
            where: { email }
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.render('auth/login', { error: 'Email ou senha inválidos' });
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('auth/login', { error: 'Erro ao fazer login' });
    }
});

// Rota de registro - página
router.get('/register', (req, res) => {
    res.render('auth/register', { error: null });
});

// Rota de registro - processamento
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Verificar se usuário já existe
        const existingUser = await User.findOne({ 
            where: { email }
        });

        if (existingUser) {
            return res.render('auth/register', { error: 'Email já cadastrado' });
        }

        // Criar novo usuário
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'client', // Define 'client' como padrão se não especificado
            active: true
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Erro no registro:', error);
        res.render('auth/register', { error: 'Erro ao criar conta' });
    }
});

// Rota de logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router; 