var mongoose = require("mongoose");

//reference to the Schema constructor
var Schema = mongoose.Schema;

//New Schema
var CuisineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  //This is linked to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

//Creating the model
var Cuisine = mongoose.model("Cuisine", CuisineSchema);

// Export the Cuisine model
module.exports = Cuisine;