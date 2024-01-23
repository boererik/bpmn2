import React from 'react';
import { Button, Box, Typography, Select, MenuItem, Grid } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
const App = () => {
  const [result, setResult] = useState(null);
  const [selectedItem, setSelectedItem] = useState('Cuba Libre');

  const executeSPARQLQuery = async (query) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `http://localhost:3000/sparql-query?query=${encodedQuery}`;

      const response = await axios.get(url, {
        headers: { Accept: 'application/sparql-results+json' },
      });

      const jsonString = JSON.stringify(response.data);
      setResult(jsonString);
      console.log(response.data);
    } catch (error) {
      console.error('Error executing SPARQL query:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  const handleButtonClick = (query, buttonId) => () => {
    console.log('frontend, query: ', query);
    executeSPARQLQuery(query);
    console.log(result);
  };

  const handleDropdown = (event) => {
    setSelectedItem(event.target.value);
  };

  const threeslash = `
    PREFIX ns0: <http://project.com#>
    select ?toolname where { 
    ?a ns0:mixWith ?b .
        ?b ns0:requiresTool ?tool .
        ?tool ns0:Name ?toolname .
    }
  `;

  const optional = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX : <http://project.com/#>
    SELECT ?name (COALESCE(?rating, "no high rating") AS ?formattedRating) WHERE {
      ?x :hasName ?name .
      OPTIONAL {
        ?x :hasRating ?rating .
        FILTER (xsd:integer(?rating) > 8)
      }
    }
  `;

  const construct = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX : <http://project.com/#>
    CONSTRUCT {
      ?x :isliked "many" .
    } WHERE {
      ?x :hasName ?name .
      ?x :hasRating ?rating .
      FILTER (xsd:integer(?rating) > 8)
    }
  `;

  const lucene = `PREFIX :<http://www.ontotext.com/connectors/lucene#>
    PREFIX inst:<http://www.ontotext.com/connectors/lucene/instance#>
    select ?entity {
        ?search a inst:myluceneconnector ; 
        :query "name:${selectedItem}" ;
        :entities ?entity .
    }
  `;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h2">Welcome to Mixologix</Typography>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container>
          <Button variant="contained" onClick={handleButtonClick(threeslash)} style={{ width: '200px' }}>
            Get Tool Name
          </Button>
          <Button variant="contained" onClick={handleButtonClick(optional)} style={{ width: '200px' }}>
            Drink Ratings
          </Button>
          <Button variant="contained" onClick={handleButtonClick(construct)} style={{ width: '200px' }}>
            Liked by Many
          </Button>
          <div style={{ width: '500px' }}>
            <Button
              variant="contained"
              onClick={handleButtonClick(lucene)}
              style={{ marginRight: '10px', width: '200px' }}
            >
              Search for Model Drinks
            </Button>
            <Select value={selectedItem} onChange={handleDropdown} style={{ minWidth: '150px' }}>
              <MenuItem value="Cuba Libre">Cuba Libre</MenuItem>
              <MenuItem value="Virgin Mojito">Virgin Mojito</MenuItem>
              <MenuItem value="Bahama Mama">Bahama Mama</MenuItem>
            </Select>
          </div>
        </Grid>
      </div>
      {result !== null && (
        <Box m={2}>
          <div style={{ width: '200px' }}>
            <Typography variant="body1">Results:</Typography>
            {result && (
              <div style={{ marginTop: '8px' }}>
                <Typography variant="body2">{result}</Typography>
              </div>
            )}
          </div>
        </Box>
      )}
    </div>
  );
  
  
};

export default App;
