var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pollution Levels Tracker' });
});

/////////////// API request for website http://aqicn.org/api/ /////////////////////////////////////////
var request = require('request');
var cheerio = require('cheerio');
request('https://api.waqi.info/search/?token=demo&keyword=bangalore', function(error, response, body){
    if(!error && response.statusCode == 200){
        var $ = cheerio.load(body);
        //console.log(body);

        var json = body;
        console.log(json);
        obj = JSON.parse(json);
        var apiVar = obj.data[0].aqi; //aqi data is at array 0 of data in JSON
        console.log(obj.data[0].aqi);

    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
