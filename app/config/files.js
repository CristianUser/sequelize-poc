const glob = require('glob');
const path = require('path');
const { Router } = require('express');

function getEntityName(file) {
  return file.split('/').reverse()[1];
}

function loadModels(sequelize) {
  return glob.sync('app/entities/**/model.js').reduce((prev, file) => {
    const model = require(path.resolve(file))(sequelize);

    model.sync({ alter: true });
    prev[getEntityName(file)] = model;
    return prev;
  }, {});
}

function loadControllers(app, models) {
  return glob.sync('app/entities/**/controller.js').forEach(file => {
    const entity = getEntityName(file);
    const router = require(path.resolve(file))(Router(), models[entity]);

    app.use(`/${entity}`, router);
  });
}

module.exports = (app, sequelize) => {
  const models = loadModels(sequelize);

  loadControllers(app, models);
};
