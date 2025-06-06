const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'drivexpert-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using https
}));

// Conexão com o banco de dados
const sequelize = require('./config/database');
const initializeDatabase = require('./config/initDb');

// Sincronizar modelos e inicializar dados
sequelize.authenticate()
    .then(() => {
        console.log('Conectado ao PostgreSQL');
        if (process.env.NODE_ENV === 'development') {
            initializeDatabase();
        }
    })
    .catch(err => {
        console.error('Erro ao conectar ao PostgreSQL:', err);
    });

// Models
const { User, Car, Evaluation } = require('./models');

// Routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const evaluationRoutes = require('./routes/evaluations');
const dashboardRoutes = require('./routes/dashboard');

// Middleware para verificar autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

// Routes
app.use('/cars', isAuthenticated, carRoutes);
app.use('/evaluations', isAuthenticated, evaluationRoutes);
app.use('/dashboard', isAuthenticated, dashboardRoutes);
app.use('/auth', authRoutes);

// Rota principal
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/auth/login');
    }
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Algo deu errado!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 