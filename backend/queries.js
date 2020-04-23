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
    pool.query('SELECT DISTINCT busState FROM business WHERE busState = $1 ', [state], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getAllStates = (request, response) => {
    pool.query('SELECT DISTINCT busState FROM business ORDER BY busState', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getCitiesInState = (request, response) => {
    const state = request.params.state;
    pool.query('SELECT DISTINCT city FROM business WHERE busState = $1 ORDER BY city', [state], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getAllBusinesses = (request, response) => {
    pool.query('SELECT * FROM business ORDER BY busName', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getBusinessesInZip = (request, response) => {
    const zip = request.params.zip;
    pool.query('SELECT DISTINCT busName FROM business WHERE postalcode = $1 ORDER BY busName', [zip], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getBusinessInfo = (request, response) => {
    const name = request.params.name;
    const zip = request.params.zip;
    pool.query('SELECT DISTINCT * FROM business WHERE name = $1 AND postalcode = $2 ORDER BY name', [name, zip], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getBusinessSC = (request, response) => {
    const state = request.params.state;

    pool.query('SELECT COUNT (DISTINCT busName) FROM business WHERE busState = $1', [state],  (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getBusinessCC = (request, response) => {
    const city = request.params.city;
    pool.query('SELECT COUNT (DISTINCT busName) FROM business WHERE city = $1', [city], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getZipcodes = (request, response) => {
    const city = request.params.city;
    pool.query('SELECT DISTINCT postalCode FROM business WHERE city = $1 ORDER BY postalCode', [city], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getCatagoriesInZip = (request, response) => {
    const zip = request.params.zip;
    pool.query('SELECT DISTINCT category FROM BusCategory,Business WHERE BusCategory.busId = Business.busId AND postalCode = $1', [zip], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getTipsforBusiness = (request, response) => {
    const busid = request.params.busid;
    pool.query('SELECT * FROM Tip WHERE busId = $1', [busid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

//returns a json containing 12 subdivisions of {checkmonth: "", monthcount ""}
const getChartForBusiness = (request, response) => {
    const busid = request.params.busid;
    pool.query('select c1.checkmonth, sum(c1.checkcount) as monthcount from (select busId, checkmonth, count(busId) as checkCount from checkin where busId = $1 group by busId, checkmonth, checkyear) c1 group by checkmonth order by checkmonth', [busid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const insertTip = (request, response) => {
    console.log("in insertTip")
    console.log(request.body)
    const {busid, userid, tiptext, tipdate, tiptime} = request.body;
    pool.query('INSERT INTO Tip (busId, userId, likeCount, tipText, tipDate, tipTime)' +
                ' VALUES ( $1, $2, 0, $3, $4, $5 )', [busid, userid, tiptext, tipdate, tiptime], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

module.exports = {
    getState,
    getAllStates,
    getCitiesInState,
    getAllBusinesses,
    getBusinessesInZip,
    getBusinessInfo,
    getBusinessSC,
    getBusinessCC,
    getZipcodes,
    getCatagoriesInZip,
    getTipsforBusiness,
    getChartForBusiness,
    insertTip,
}
