const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./queries')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

app.get('/state', db.getAllStates)
app.get('/state/:state', db.getState)
app.get('/city/:state', db.getCitiesInState)
app.get('/businesses/', db.getAllBusinesses)