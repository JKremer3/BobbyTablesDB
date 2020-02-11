const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'business',
    password: 'bobby',
    port: 5432,
})

const getState = (request, response) => {
    const state = request.params.state;
    pool.query('SELECT DISTINCT state FROM business WHERE state = $1 ', [state], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getAllStates = (request, response) => {
    pool.query('SELECT DISTINCT state FROM business ORDER BY state', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getCitiesInState = (request, response) => {
    const state = request.params.state;
    pool.query('SELECT DISTINCT city FROM business WHERE state = $1 ORDER BY city', [state], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getAllBusinesses = (request, response) => {
    pool.query('SELECT * FROM business ORDER BY name', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = {
    getState,
    getAllStates,
    getCitiesInState,
    getAllBusinesses,
}