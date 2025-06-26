const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define('Car', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    marca: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    modelo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    ano: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    kilometragem: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    placa: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    cor: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    combustivel: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'pendente'
    },
    vendedor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'cars',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Car; 