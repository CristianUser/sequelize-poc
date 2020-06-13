/**
 * @param {import('express').IRouter} router
 * @param {import('sequelize').Model} User
 */
module.exports = (router, User) => {
  router.get('/', async (req, res) => {
    const data = await User.findAll();

    res.send(data);
  });

  router.post('/', async (req, res) => {
    const data = await User.create(req.body);

    res.send(data);
  });

  return router;
};
