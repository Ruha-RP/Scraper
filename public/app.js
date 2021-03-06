function displayResults(cuisines) {
  // First, empty the table
  $("#cuisines").empty();

  // Then, for each entry of that json...
  cuisines.forEach(function(cuisine) {
    // Append each of the cuisine's properties to the table
    // $("#cuisines").append("<p>" + cuisine.title + "</br>" + "www.bbc.co.uk" + 
    //                       cuisine.link + "</br>" +
    //                       cuisine.summary + "</p>" + "<button>" + "Make a Note" + "</button>");

    $("#cuisines").append("<p><strong>" + cuisine.title + "</strong><br />www.bbc.co.uk" + cuisine.link + "<br />" + cuisine.summary + "</p><button class='waves-effect waves-light btn red lighten-2' data-id='" + cuisine._id + "'>Save Note</button> <button class='waves-effect waves-light btn red lighten-2'>Delete Note</button>");
  });
}


// Grab the cuisines as a json
$.getJSON("http://localhost:8000/cuisines", function(data) {
  displayResults(data);
});


// On-click for <p> tag
$(document).on("click", "button", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  //checking
  console.log("thisId is:" + thisId);

  // Now make an ajax call for the Cuisine
  $.ajax({
    method: "GET",
    url: "/cuisines/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // Cuisine name
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/cuisines/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
