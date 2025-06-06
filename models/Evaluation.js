const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evaluation = sequelize.define('Evaluation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cars',
            key: 'id'
        }
    },
    avaliador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    preco_avaliado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado_geral: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    motor_estado: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    motor_observacao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    carroceria_estado: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    carroceria_observacao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    interior_estado: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    interior_observacao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    documentacao_estado: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    documentacao_observacao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'evaluations',
    timestamps: true,
    createdAt: 'data_avaliacao',
    updatedAt: false
});

module.exports = Evaluation; 