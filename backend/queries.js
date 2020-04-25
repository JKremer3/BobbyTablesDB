const Pool = require('pg').Pool
const pSleep = require('pg').sleep
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
    pool.query('SELECT DISTINCT * FROM business WHERE postalcode = $1 ORDER BY busName', [zip], (error, results) => {
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

const putLikeTip = (request, response) => {
    console.log("In putLikeTip");
    //Params from route
    const busid = request.params.busid;
    const userid = request.params.userid;
    const tipdate = request.params.tipdate;
    const tiptime = request.params.tiptime;
    
    //Update the specified tip with an increase in likecount
    pool.query('Update tip set likecount = likecount + 1 where 	busid = $1 and userid = $2 and tipdate = $3 and tiptime = $4', [busid, userid, tipdate, tiptime], (error, results) => {
        if (error) {
            throw error
        }

        response.status(200).send()
    });
}

const getBusinessFilter = (request, response) => {
    console.log(request.body)
    const zip = request.params.zip;
    var category = request.params.category;

    console.log(category)

    var result = category.split(',');
    console.log( "Result: " + result)

    console.log(category)

    filters = ""
    tables = ""
    ids = ""
    for ( c in result ) {
        console.log(c)
        tables = tables + ', buscategory A' + c ;
        filters =  filters + ' AND A' + c + '.category = ' + "'" + result[c] + "'" ;
        ids = ids + ' AND a' + c + '.busid = business.busid';
    }

    console.log("Tables: " + tables)
    console.log("Filters: " + filters)

    query = 'SELECT DISTINCT business.* FROM business ' + tables + ' WHERE business.postalcode = ' + zip + 
    filters + ids + ' ORDER BY business.busName;'

    console.log( "query: " + query)

    pool.query('SELECT DISTINCT business.* FROM business ' + tables + ' WHERE business.postalcode = $1 ' + 
                    filters + ids + '   ORDER BY business.busName;' , [zip], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const postBusinessCheckin = (request, response) => {
    console.log("in postBusinessCheckin")
    console.log(request.body)

    const busid = request.params.busid;
    const {checkyear, checkdate, checkmonth, checktime} = request.body;
    pool.query('INSERT INTO Checkin (busId, checkyear, checkdate, checkmonth, checktime)' +
                ' VALUES ( $1, $2, $3, $4, $5 )', [busid, checkyear, checkdate, checkmonth, checktime], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getBusinessCategories = async (request, response) => {
    const busid = request.params.busid;
    let categoryCollection;
    let ambienceCollection;

    pool.query('SELECT category FROM BusCategory WHERE busId = $1', [busid], (error, results) => {
        if (error) {
            throw error
        }
        categoryCollection = results.rows
        console.log(categoryCollection)
    });

    pool.query('SELECT ambiencetype From BusAmbience Where busid = $1 and ambienceval = true ', [busid], (error, results) => {
        if (error) {
            throw error
        }
        ambienceCollection = results.rows
        console.log(ambienceCollection)
    });

    const retCollection = categoryCollection + ambienceCollection;
    console.log(retCollection)
    response.status(200).json(retCollection);
}

const getBusinessAttributes = (request, response) => {

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
    getBusinessCategories,
    getBusinessAttributes,
    getZipcodes,
    getCatagoriesInZip,
    getTipsforBusiness,
    getChartForBusiness,
    getBusinessFilter,
    insertTip,
    postBusinessCheckin,
    putLikeTip
}
