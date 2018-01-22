var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pollution Levels Tracker', aqiEJStoHtml: globalaqi, barHeight: globalbarHeight });
});


/////////////// API request for website http://aqicn.org/api/ /////////////////////////////////////////
var request = require('request');
var cheerio = require('cheerio');
global.globalaqi = "";
globalbarHeight = "";

request('https://api.waqi.info/search/?token=demo&keyword=bangalore', function(error, response, body){
    if(!error && response.statusCode == 200){
        var $ = cheerio.load(body);
        //console.log(body);

        var json = body;
        console.log(json);
        obj = JSON.parse(json);
        var aqiVar = obj.data[0].aqi; //aqi data is at array 0 of data in JSON
        //console.log(obj.data[0].aqi);
        console.log(aqiVar);
        globalaqi = aqiVar;
        globalbarHeight = Math.round(aqiVar / 3); //divide by 3 since scale is 300% not 100% for bar graph

        // globalbarHeight = globalaqi / 2;
        // console.log("barheight: " + barHeight);
    }
});



////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
