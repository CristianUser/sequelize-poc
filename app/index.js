require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./services/log')({ file: __filename });
const db = require('./config/db');

app.use(require('cors')());
db().then(dbInstance => {
  require('./config/files')(app, dbInstance);

  app.use('**', (req, res) => {
    res.status(404).send('Not Found');
  });

  app.listen(process.env.PORT, () =>
    logger.info(`Server is listening on port ${process.env.PORT}`)
  );
});
