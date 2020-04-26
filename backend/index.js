const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;
const db = require('./queries')

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
app.get('/businesses/:zip', db.getBusinessesInZip)
app.get('/businesses/:zip/:name', db.getBusinessInfo)
app.get('/business/attributes/:busid', db.getBusinessAttributes)
app.get('/business/categories/:busid', db.getBusinessCategories)
app.get('/count/state/:state', db.getBusinessSC)
app.get('/count/city/:city', db.getBusinessCC)
app.get('/zip/:city', db.getZipcodes)
app.get('/zip/cat/:zip', db.getCatagoriesInZip)
app.get('/tip/:busid', db.getTipsforBusiness)
app.get('/chart/:busid', db.getChartForBusiness)
app.post('/tip/insert', db.insertTip)
app.put('/tip/:busid/:userid/:tipdate/:tiptime', db.putLikeTip)
app.get('/business/:zip/:category', db.getBusinessFilter)
app.get('/business/friendTips/:busid/:userid', db.getBusFriendTips)
app.post('/business/checkin/:busid', db.postBusinessCheckin)
app.get('/busattrib/:zip/:attribs', db.getAttributeFilterTF)
app.get('/ambience/:zip/:ambience', db.getAmbienceFilter)
app.get('/user/:userid', db.getUserInfo)
app.get('/user/friends/:userid', db.getUserFriends)
app.get('/user/friendTips/:userid', db.getUserFriendTips)
app.put('/user/location/:userid/:lat/:long', db.putUserCoords)
