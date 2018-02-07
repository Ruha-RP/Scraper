//Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
//scraping tools
var request = require("request");
var cheerio = require("cheerio");

//Initializing express
var app = express();
var PORT = 8000;

//Requiring models
var db = require("./models");

//Middleware
//For loggin requests
app.use(logger("dev"));

//For handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

//Static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
	//CLI told me to remove the line below
  	// useMongoClient: true
});

//Making the request 
request("http://www.bbc.co.uk/food/cuisines", function(error, response, html) {

	//Loading the html
	var $ = cheerio.load(html);

	//Empty array to save scraped data
	var results = [];
 	
	//targeting the li element
	$("li.cuisine").each(function(i, element) {

		//saving the cuisine-title text in title variable
		var title = $(element).find("h3").find("a").find("span").text();

		//saving the link to the link variable
		var link = $(element).find("h3").find("a").attr("href");

		//saving the summary to the summary variable
		var summary = $(element).find("p").text();

		//saving the results into the array
		results.push({
			title: title,
			link: "www.bbc.co.uk"+link,
			summary: summary
		});

	});

	//Logging the results
	console.log(results);

});

//Starting the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});