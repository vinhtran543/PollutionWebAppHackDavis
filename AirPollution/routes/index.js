var express = require('express');
var router = express.Router();
myText = "";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pollution Levels Tracker', aqiEJStoHtml: globalaqi, barHeight: globalbarHeight });
});

//Request object from html page (index.ejs)
var app = express();
app.get('/', function(req, res){
    myText = req.query.mytext; //mytext is the name of your input box
    res.send('Your Text:' +myText);
});
console.log(myText);

// const readline = require('readline');
//
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
//
// rl.question('What do you think of Node.js? ', (answer) => {
//     // TODO: Log the answer in a database
//     console.log(`Thank you for your valuable feedback: ${answer}`);
//
// rl.close();
// });

/////////////// API request for website http://aqicn.org/api/ /////////////////////////////////////////
var request = require('request');
var cheerio = require('cheerio');
globalaqi = "";
globalbarHeight = "";
var token = '5e3430ee03115b533faddd23e524e086e4915a74';

//sample url
//https://api.waqi.info/search/?token=5e3430ee03115b533faddd23e524e086e4915a74&keyword=beijing
//request('https://api.waqi.info/search/?token=demo&keyword=beijing', function(error, response, body){
var keyword = "beijing"
request('https://api.waqi.info/search/?token=5e3430ee03115b533faddd23e524e086e4915a74&keyword=' + keyword, function(error, response, body){
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
