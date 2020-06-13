const glob = require('glob');
const path = require('path');
const { Router } = require('express');
const controller = require('../services/controller');

let models;

/**
 * Extract entity name from folder
 * @param {string} file filepath
 * @returns {string}
 */
function getEntityName(file) {
  return file.split('/').reverse()[1];
}

/**
 * Load model.js files in directory to register in sequelize instance
 * @param {Object} sequelize
 * @returns {Promise}
 */
function loadModels(sequelize) {
  return glob.sync('app/entities/**/model.js').reduce((prev, file) => {
    const model = require(path.resolve(file))(sequelize);

    prev[getEntityName(file)] = model;
    return prev;
  }, {});
}

/**
 * Load controller.js files in directory to register in app router
 * @param {Object} app
 * @param {Object} models
 */
function loadControllers(app, models) {
  glob.sync('app/entities/**/controller.js').forEach(file => {
    const entity = getEntityName(file);
    const router = require(path.resolve(file))(Router(), models[entity]);

    app.use(`/${entity}`, router);
  });
}

/**
 * Initialize entities
 * @param {Object} app
 * @param {Object} sequelize
 */
module.exports = (app, sequelize) => {
  models = loadModels(sequelize);

  sequelize.sync({ alter: true });

  loadControllers(app, models);
  Object.keys(models).forEach(key => {
    const router = controller.generateDefaultRoutes(Router(), models[key]);

    app.use(`/${key}`, router);
  });
};

/**
 * Returns models instances
 * @returns {Object}
 */
module.exports.getModels = () => models;
