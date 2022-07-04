const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const axios = require('axios');
const history = require('connect-history-api-fallback');
let nosql = require('nosql').load('database/rating.nosql');
const header_validator = require('./middleware/header_validator.js');
require('dotenv').config()

const app = express();

app.use(cors());
app.use(header_validator);
app.use(morgan('tiny'));
app.use(history());
app.use(bodyParser.json());

// Root end for test API
app.get('/', (req, res) => {
    res.json({
        message: 'This is Express REST API.'
    });
});

// Route Post request for adding rating
app.post('/rating/', (req, res) => {
    let id = req.body.id;
    console.log('ID: ', req);
    let rating = req.body.rating;
    let comments = req.body.comments;
    nosql.insert({ id: id, rating: rating, commets: comments });
    res.end('SUCCESS');
});

// Route for presenting beers list
app.get('/beers/:name', (request, responce) => {
    let name = request.params.name;
    let result = [];
    axios
    .get(process.env.PUNK_API_URL + '/beers?beer_name=' + name)
    .then(res => {

        let r_data = res.data;

        if (r_data.length > 0) {

            for (let i = 0; i < r_data.length; i++) {
                let food_pairing = [];

                if (r_data[i].food_pairing.length > 0) {
                    for (let j = 0; j < r_data[i].food_pairing.length; j++) {
                        food_pairing.push(r_data[i].food_pairing[j]);
                    }
                }

                result.push({
                    id: r_data[i].id,
                    name: r_data[i].name,
                    description: r_data[i].description,
                    first_brewed: r_data[i].first_brewed,
                    food_pairing: food_pairing
                });
            }
            responce.json({
                data: result
            });

        } else {
            responce.json({
                message: 'No results.'
            });
        }
    })
    .catch(error => {
        console.error(error);
    });
})

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});