const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Article extends Model {}

Article.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE
    },
    review: {
      type: DataTypes.STRING,
    },
    book: {
      type: DataTypes.STRING
    },
    rating: {
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'article'
  }
);

module.exports = Article;