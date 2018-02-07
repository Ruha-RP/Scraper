//Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var mongoose = require("morgan");
var request = require("request");
var cheerio = require("cheerio");

//Initiaizing express
var app = express();

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, {
//   useMongoClient: true
// });

//Making the request 
request("http://www.bbc.co.uk/food/cuisines", function(error, response, html) {

	//Loading the html
	var $ = cheerio.load(html);

	//Empty array to save scraped data
	var results = [];

	// //Find each span, with "cuisine-title" class
	// $("span.cuisine-title").each(function(i, element) {

	// 	//saving the cuisine-title text in title variable
	// 	var title = $(element).text();

	// 	//targeting parent element of href
	// 	var link = $(element).parent().attr("href");

	// 	

	$("li.cuisine").each(function(i, element) {

	//saving the cuisine-title text in title variable
	var title = $(element).find("h3").find("a").find("span").text();

	var link = $(element).find("h3").find("a").attr("href");

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