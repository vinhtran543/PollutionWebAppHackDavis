var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pollution Levels Tracker', aqiEJStoHtml: globalaqi, barHeightEJStoHtml: globalbarHeight, keywordEJStoHtml: globalKeyword });
});

var bodyParser = require('body-parser');
var app = express();

//Submit button was pressed
//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true }));
// app.post('/myaction', function(req, res) {
router.post('/', function(req, res) {
    var searchedKeyword = req.body.search;
    //console.log("In the body of app.post()"); Debugging 
    //console.log("keyword search: " + globalKeyword); Debugging 

    //function call to createbargraph graph and refresh page with changes
    app.get(createbargraph(searchedKeyword, req, res));
});

// app.listen(8000, function() {
//     console.log('Server running at http://127.0.0.1:8000/');
// });

/////////////// API request for website http://aqicn.org/api/ ///////////////////////////////////////
var request = require('request');
var cheerio = require('cheerio');
globalaqi = "";
globalbarHeight = "";
globalKeyword = "beijing";
API_KEY = process.env.API_KEY;

//demo url
//request('https://api.waqi.info/search/?token=demo&keyword=beijing', function(error, response, body){
//var keyword = "beijing";

tempKeyword = "beijing";
createbargraphFirstTime(tempKeyword);

//create bargraph for first time when webpage first starts
function createbargraphFirstTime(tempKeyword)
{
    request('https://api.waqi.info/search/?token=' + API_KEY + '=' + tempKeyword, function(error, response, body){
        if(!error && response.statusCode == 200){
            var $ = cheerio.load(body);
            //console.log(body);

            var json = body;
            //console.log(json); Debugging 
            obj = JSON.parse(json);
            var aqiVar = obj.data[0].aqi; //aqi data is at array 0 of data in JSON
            //console.log(obj.data[0].aqi);
            //console.log(aqiVar); Debugging 
            globalaqi = aqiVar;
            globalbarHeight = Math.round(aqiVar / 3); //divide by 3 since scale is 300% not 100% for bar graph

            // globalbarHeight = globalaqi / 2;
            // console.log("barheight: " + barHeight);
        }
    });
}

function createbargraph(searchedKeyword, req, res)
{
    request('https://api.waqi.info/search/?token=' + API_KEY + '=' + searchedKeyword, function(error, response, body){
        if(!error && response.statusCode == 200){
            var $ = cheerio.load(body);
            //console.log(body);

            var json = body;
            //console.log(json); Debugging 
            obj = JSON.parse(json);

            //console.log(obj.data); Debugging 

            if(obj.data == 0)   //if user search for invalid or empty string name, obj.data should be empty bracket
            {
                //console.log("obj data is null"); Debugging 
                res.redirect("http://webapp.vtranportfolio.me");
            }
            else    //generate bar graph 
            {
                //var json = body;
                //console.log(json); Debugging 
                obj = JSON.parse(json);

                var aqiVar = obj.data[0].aqi; //aqi data is at array 0 of data in JSON
                //console.log(obj.data[0].aqi);
                //console.log(aqiVar); Debugging 
                globalaqi = aqiVar;
                globalbarHeight = Math.round(aqiVar / 3); //divide by 3 since scale is 300% not 100% for bar graph

                // globalbarHeight = globalaqi / 2;
                // console.log("barheight: " + barHeight);

                //redirect call to refresh page
                //res.redirect("http://localhost:3000/");
                globalKeyword = searchedKeyword; //if keyword exists, set keyword so that Html can use it
                res.redirect("http://webapp.vtranportfolio.me");
            }
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
