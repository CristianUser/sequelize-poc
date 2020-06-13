const path = require('path');
const fs = require('fs'),
  YAML = require('yaml');
const glob = require('glob');
const { Client } = require('@elastic/elasticsearch');
const files = require('./files');
const elastic = require('../services/elastic');

/**
 * Load mapping files
 * @param {import('@elastic/elasticsearch').Client} client
 */
function loadMappings(client) {
  return glob.sync('app/search/mappings/*.yml').map(file => {
    const mapping = YAML.parse(fs.readFileSync(file, 'utf8'));
    const indexName = `${elastic.getIndexName(file)}_v1`;

    return client.indices.exists({ index: indexName }).then(({ body }) => {
      if (!body) {
        return client.indices.create({
          index: indexName,
          body: mapping
        });
      }
      return Promise.resolve({});
    });
  });
}

function loadHandlers() {
  return glob.sync('app/search/handlers/*.js').forEach(file => {
    require(path.resolve(file));
  });
}

module.exports = () => {
  const client = new Client({ node: 'http://localhost:9200' });

  Promise.all(loadMappings(client))
    .then(responses => {
      console.log('response', responses);
    })
    .catch(responses => {
      console.log('errors', responses);
    });

  elastic.setModels(files.getModels());
  elastic.setClient(client);
  loadHandlers();
};
