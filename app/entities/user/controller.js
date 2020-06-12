module.exports = (router, User) => {
  router.get('/', async (req, res) => {
    const data = await User.findAll();

    res.send(data);
  });

  return router;
};
