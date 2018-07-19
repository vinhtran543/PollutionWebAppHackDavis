var express = require('express');
var router = express.Router();

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
app.post('/myaction', function(req, res) {
    globalKeyword = req.body.username;
    console.log("In the body of app.post()");
    console.log("keyword search: " + globalKeyword);

    //function call to createbargraph graph and refresh page with changes
    app.get(createbargraph(globalKeyword, req, res));
});

app.listen(8080, function() {
    console.log('Server running at http://127.0.0.1:8080/');
});

/////////////// API request for website http://aqicn.org/api/ /////////////////////////////////////////
var request = require('request');
var cheerio = require('cheerio');
globalaqi = "";
globalbarHeight = "";

//sample url
//https://api.waqi.info/search/?token=***REMOVED***=beijing
//demo url
//request('https://api.waqi.info/search/?token=demo&keyword=beijing', function(error, response, body){
//var keyword = "beijing";
globalKeyword = "beijing";
createbargraphFirstTime(globalKeyword);

function createbargraphFirstTime(globalKeyword)
{
    request('https://api.waqi.info/search/?token=***REMOVED***=' + globalKeyword, function(error, response, body){
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
}

function createbargraph(globalKeyword, req, res)
{
    request('https://api.waqi.info/search/?token=***REMOVED***=' + globalKeyword, function(error, response, body){
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

            //redirect call to refresh page
            res.redirect("http://localhost:3000/");
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
