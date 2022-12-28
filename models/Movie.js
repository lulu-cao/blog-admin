// Line 3 must be from sequelize directly, rather than @adminjs/sequelize
// Otherwise, we will get a TypeError: Class extends value undefined is not a constructor or null
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create a new Sequelize model for movies
class Movie extends Model {}

Movie.init(
  // Define fields/columns on model
  // An `id` is automatically created by Sequelize, though best practice would be to define the primary key ourselves
  {
    title: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE
    },
    review: {
      type: DataTypes.STRING,
    },
    isLiked: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    // Link to database connection
    sequelize,
    // Set to false to remove `created_at` and `updated_at` fields
    timestamps: false,
    underscored: true,
    modelName: 'movie'
  }
);

module.exports = Movie;
