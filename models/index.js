const User = require('./User');
const Car = require('./Car');
const Evaluation = require('./Evaluation');

// Relações entre User e Car
User.hasMany(Car, { foreignKey: 'vendedor_id' });
Car.belongsTo(User, { foreignKey: 'vendedor_id', as: 'vendedor' });

// Relações entre User e Evaluation
User.hasMany(Evaluation, { foreignKey: 'avaliador_id' });
Evaluation.belongsTo(User, { foreignKey: 'avaliador_id', as: 'avaliador' });

// Relações entre Car e Evaluation
Car.hasOne(Evaluation, { foreignKey: 'car_id', as: 'evaluation' });
Evaluation.belongsTo(Car, { foreignKey: 'car_id', as: 'car' });

module.exports = {
    User,
    Car,
    Evaluation
}; 