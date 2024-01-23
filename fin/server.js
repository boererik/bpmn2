const express = require('express');
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const cors = require('cors'); // Add this line

const app = express();
const port = 3000;

// Enable CORS
app.use(cors()); // Add this line

const GRAPHDB_BASE_URL = 'http://localhost:7200';
const GRAPHDB_REPOSITORY = 'PROJECT';
const GRAPHDB_USERNAME = 'Test';
const GRAPHDB_PASSWORD = 'Test';

const DEFAULT_PREFIXES = [
  EnapsoGraphDBClient.PREFIX_OWL,
  EnapsoGraphDBClient.PREFIX_RDF,
  EnapsoGraphDBClient.PREFIX_RDFS,
  {
    prefix: 'mm',
    iri: 'http://bee-up.omilab.org/rdf/1_6#',
  },
  {
    prefix: 'cv',
    iri: 'http://www.comvantage.eu/mm#',
  },
];

app.get('/sparql-query', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Received SPARQL query:', query);

    const graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
      baseURL: GRAPHDB_BASE_URL,
      repository: GRAPHDB_REPOSITORY,
      prefixes: DEFAULT_PREFIXES,
    });

    await graphDBEndpoint.login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD);

    const result = await graphDBEndpoint.query(query, { transform: 'toJSON' });
    console.log(result);

    res.json(result);
  } catch (error) {
    console.error('Error executing SPARQL query:', error, '\n');
    res.status(500).json({ error: 'Failed to execute SPARQL query' });
  }
});


app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
