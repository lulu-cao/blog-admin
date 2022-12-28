// If I write my custom components, I need to add them here and use them in resource files using Components.customComponent
// This file itself needs to be imported at app.js and added in adminOptions
const { ComponentLoader } = require("adminjs");

const componentLoader = new ComponentLoader();

const Components = {
  coverImage: componentLoader.add('coverImage', './public/coverImage.jsx'),
  addReview: componentLoader.add('addReview', './public/review.jsx')
}

module.exports = { componentLoader, Components }