const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Email extends Model {}

Email.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING
    },
    body: {
      type: DataTypes.STRING
    },
  },
  {
    sequelize,
    modelName: 'email'
  }
);

module.exports = Email;