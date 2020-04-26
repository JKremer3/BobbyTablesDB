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
    console.log('in getBusinessCategories()')
    const busid = request.params.busid;

    pool.query('select category as busCat from BusCategory WHERE busId = $1 UNION ALL SELECT ambiencetype as busCat From BusAmbience Where busid = $1 and ambienceval = true', [busid], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows)
        response.status(200).json(results.rows)
    });
}

const getBusinessAttributes = (request, response) => {
    console.log('in getBusinessAttributes()')
    const busid = request.params.busid;

    pool.query('select (attributeName, attributeVal) as busAtt from busAttributes where busid = $1 and attributeVal <> \'False\' UNION ALL select (mealType, mealVal)  as busAtt from busGoodForMeals where busid = $1 and mealval = true UNION ALL select (parkingType, parkVal) from busParking where busid = $1 and parkval = true', [busid], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows)
        response.status(200).json(results.rows)
    });    
}

const getAttributeFilterTF = (request, response) => {
    console.log(request.body)
    const zip = request.params.zip;
    var attribs = request.params.attribs;

    console.log(attribs)

    var result = attribs.split(',');
    console.log( "Result: " + result)

    filters = ""
    tables = ""
    ids = ""
    for ( c in result ) {
        console.log(c)
        tables = tables + ', busattributes A' + c ;
        filters =  filters + ' AND A' + c + '.attributename = ' + "'" + result[c] + "'" ;
        ids = ids + ' AND a' + c + '.busid = business.busid AND (a' + c + '.attributeval = ' + "'True' OR 'yes')";
    }

    console.log("Tables: " + tables)
    console.log("Filters: " + filters)

    query = 'SELECT DISTINCT business.* FROM business ' + tables + ' WHERE business.postalcode = ' + zip + 
    filters + ids + ' ORDER BY business.busName;'

    console.log( "query: " + query)

    pool.query('SELECT DISTINCT business.* FROM business ' + tables + ' WHERE business.postalcode = $1 ' + 
                    filters + ids + ' ORDER BY business.busName;' , [zip], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getAmbienceFilter = (request, response) => {
    const zip = request.params.zip;
    const ambience = request.params.ambience;

    var result = ambience.split(',');
    console.log( "Result: " + result)

    filters = ""
    tables = ""
    ids = ""
    for ( c in result ) {
        console.log(c)
        tables = tables + ', busambience A' + c ;
        filters =  filters + ' AND A' + c + '.ambiencetype = ' + "'" + result[c] + "'" ;
        ids = ids + ' AND a' + c + '.busid = business.busid AND (a' + c + '.ambienceval = ' + "'t')";
    }

    console.log("Tables: " + tables)
    console.log("Filters: " + filters)

    query = 'SELECT DISTINCT business.* FROM business ' + tables + ' WHERE business.postalcode = ' + zip + 
    filters + ids + ' ORDER BY business.busName;'

    console.log( "query: " + query)

    pool.query('SELECT DISTINCT business.* FROM business ' + tables + ' WHERE business.postalcode = $1 ' + 
                    filters + ids + ' ORDER BY business.busName;' , [zip], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

// Returns all user info except id
const getUserInfo = (request, response) => {
    const userid = request.params.userid
    pool.query('select * from users where userid = $1', [userid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

//Returns  {friendid, username, totallikes, avgstars, yelpstartdate} for each friend of a user
const getUserFriends = (request, response) => {
    const userid = request.params.userid
    pool.query('select f1.friendId, u2.userName, u2.totalLikes, u2.avgStars, u2.yelpStartDate from users u1, users u2, friends f1 Where u1.userid = $1 and u1.userid = f1.userid and u2.userid = f1.friendid', [userid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

//Returns one {username, city, busname, tiptext, likecount, tipdate, tiptime} JSON for each friend. Ordered by Friend Name
const getUserFriendTips = (request, response) => {
    const userid = request.params.userid
    pool.query('Select distinct on(u2.userName) u2.userName, b1.City, b1.busName, t1.tiptext, t1.likecount, t1.tipdate, t1.tiptime From users u1, users u2, friends f1, tip t1, business b1 Where u1.userid = $1 And u1.userid = f1.userid And u2.userid = f1.friendid And t1.userid = f1.friendid And b1.busid = t1.busid And t1.tipdate = (select max(t2.tipdate) from tip t2 where t2.userid = t1.userid) order by u2.username, t1.tipdate desc, t1.tiptime desc', [userid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const putUserCoords = (request, response) => {
    const userid = request.params.userid;
    var lat = request.params.lat;
    var long = request.params.long;
    lat = parseFloat(lat);
    long = parseFloat(long);
    pool.query('UPDATE users SET lat = $1, long = $2 WHERE userid = $3', [lat, long, userid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send("Coordinates updated Succesfully")
    });
}

//Returns {username, city, busname, tiptext, likecount, tipdate, tiptime}
const getBusFriendTips = (request, response) => {
    const userid = request.params.userid
    const busid = request.params.busid
    pool.query('Select u2.userName, b1.City, b1.busName, t1.tiptext, t1.likecount, t1.tipdate, t1.tiptime From users u1, users u2, friends f1, tip t1, business b1 Where u1.userid = $1 And u1.userid = f1.userid And u2.userid = f1.friendid And t1.userid = f1.friendid And b1.busid = $2 And b1.busid = t1.busid Order by t1.tipdate Desc, t1.tiptime Desc', [userid, busid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

// Returns {dayofweek, hropen, hrclosed}, expects parameter 'day' as an integer
const getBusOpenClose = (request, response) => {
    const dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesay', 'Thursday', 'Friday', 'Saturday'];
    const busid = request.params.busid;
    const day = dayArray[parseInt(request.params.day)];
    
    pool.query('select dayofweek, hropen, hrclosed from BusHours where busid = $1 and dayofweek = $2', [busid, day], (error, results) => {
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
    getBusinessCategories,
    getBusinessAttributes,
    getZipcodes,
    getCatagoriesInZip,
    getTipsforBusiness,
    getChartForBusiness,
    getBusinessFilter,
    getBusOpenClose,
    getBusFriendTips,
    insertTip,
    postBusinessCheckin,
    putLikeTip,
    getAttributeFilterTF,
    getAmbienceFilter,
    getUserInfo,
    getUserFriends,
    getUserFriendTips,
    putUserCoords
}
