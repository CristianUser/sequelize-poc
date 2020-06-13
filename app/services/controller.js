function createController(model) {
  return {
    get() {
      return model.findAll();
    },
    getById(id) {
      return model.findAll({ where: { id } }).then(rows => rows[0]);
    },
    post(id, payload) {
      return model.create(payload);
    },
    put(id, payload) {
      return model.update(payload, {
        where: {
          id
        }
      });
    },
    delete(id) {
      return model.destroy({ where: { id } });
    }
  };
}

module.exports = createController;

module.exports.generateDefaultRoutes = (router, model) => {
  const routes = [
    { method: 'get' },
    { method: 'post' },
    { method: 'get', param: 'id', func: 'getById' },
    { method: 'put', param: 'id' },
    { method: 'delete', param: 'id' }
  ];

  const controller = createController(model);

  routes.forEach(route => {
    router[route.method](route.param ? '/:id' : '/', async (req, res) => {
      const data = await controller[route.func || route.method](req.params.id, req.body);

      return res.json(data);
    });
  });

  return router;
};
