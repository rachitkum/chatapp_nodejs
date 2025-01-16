const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');

//Neo4j 
const uri = 'neo4j+s://59dc480d.databases.neo4j.io'; 
const user = 'neo4j';
const password = '6LA3MbWStfn10e4OWFyQND36mpSd27gszB7Id0_uDSQ';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

// for posting user data
router.post('/push_user', async (req, res) => {
    const { id, name, location, age } = req.body;
      const result = await session.run(
          'CREATE (u:User   {id: $id, name: $name, location: $location, age: $age}) RETURN u',
          { id, name, location, age }
      );
      const user = result.records[0].get('u').properties;
      res.status(201).send(user);
    }
);


// for fetching user data
router.get('/users', async (req, res) => {
      const result = await session.run('MATCH (u:User ) RETURN u');
      const users = result.records.map(record => {
          const user = record.get('u').properties;
          return user; 
      });
      res.json(users);
});
module.exports = router;