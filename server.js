//Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
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

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Requiring models
var db = require("./models");

//Middleware
//For loggin requests
app.use(logger("dev"));

//For handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

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

//ROUTES
//main page route
app.get("/", function(req, res) {

  //rendering the index page
  res.render("index");
});
//the route that will scrape data
app.get("/scrape", function(req, res) {
	//Making the request 
	request("http://www.bbc.co.uk/food/cuisines", function(error, response, html) {

		//Loading the html
		var $ = cheerio.load(html);

		//Empty array to save scraped data
		// var results = [];
	 	
		//targeting the li element
		$("li.cuisine").each(function(i, element) {

			var results = {};

			//saving the cuisine-title text in title variable
			results.title = $(this).find("h3").find("a").find("span").text();

			//saving the link to the link variable
			results.link = $(this).find("h3").find("a").attr("href");

			//saving the summary to the summary variable
			results.summary = $(this).find("p").text();

			//saving the results into the array
			// results.push({
			// 	title: title,
			// 	link: "www.bbc.co.uk"+link,
			// 	summary: summary
			// });

			// Create a new Cuisine using the `results` object built from scraping
	        db.Cuisine.create(results)
	        .then(function(dbCuisine) {
	          // View the added result in the console
	          console.log(dbCuisine);
	        })
	        .catch(function(err) {
	          // If an error occurred, send it to the client
	          return res.json(err);
	        });


		//Logging the results
		console.log(results);

		});

		res.send("Scrape Complete");
		
	});

});

//====================================

// Route for getting all cuisines from the db
app.get("/cuisines", function(req, res) {
  // Grab every document in the Articles collection
  db.Cuisine.find({})
    .then(function(dbCuisine) {
      // If we were able to successfully find Cuisines, send them back to the client
      res.json(dbCuisine);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Cuisine by id, populate it with it's note
app.get("/cuisines/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Cuisine.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbCuisine) {
      // If we were able to successfully find an Cuisine with the given id, send it back to the client
      res.json(dbCuisine);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Cuisines's associated Note
app.post("/cuisines/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Cuisine.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbCuisine) {
      // If we were able to successfully update an Cuisine, send it back to the client
      res.json(dbCuisine);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
//====================================



//Starting the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});