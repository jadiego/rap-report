$(document).ready(function(){
    Parse.initialize("TQ13WOPzb6xDWdcbFDiBXz5HJnw1MidFLR73ZEJP", "s6TUi54cVVrpOPbLVvGEDZPMhkWsy1wPdrjaEzrm");

	var RapReport = Parse.Object.extend("RapReport");

	var total = 0;
	var ratingcombined = 0;

	$("#rating").raty({
		score: 3
	});

	$("#overallrating").raty({
		readOnly: true
	});

	// Click event when form is submitted
	$('form').submit(function() {

		// Create a new instance of your Music class 
		var rapreport = new RapReport();

		rapreport.set("rating", $("#rating").raty("score"));
		rapreport.set("title", $("input#title").val());
		rapreport.set("body", $("textarea#body").val());

		// After setting each property, save your new instance back to your database
		rapreport.save(null, {
			success:getData
		});
		return false;
	});


	// Function to get data 
	var getData = function() {
		var query = new Parse.Query(RapReport);

		query.notEqualTo("rating", 0);

		query.find({
			success: function(results) {
				buildReview(results)	
			}
		});
	};


	var buildReview = function(data) {
		//Empty out reviews section
		$("#pastreviews").empty();

		data.forEach(function(i) {
			addItem(i)
		});
	};


	var addItem = function(item) {
		// Get parameters (rating, title, body) from the data item passed to the function
		var score = item.get("rating");
		ratingcombined = ratingcombined + score;
		total = total + 1;
		$("#overallrating").raty("set", { 
			score: Math.round(ratingcombined/total)
		});

		var num = $("<div>").raty({
			score: score,
			readOnly: true
		});
		var title = $("<h4 class='media-heading'>").text(item.get("title"));
		var body = $("<p>").text(item.get("body"));


		//Creates comment box from parameters
		var media = $("<div class='media'>")
		
		var mediaobject = $("<div class='media-left'><img class='media-object' src='img/user.png'></div>").appendTo(media);
		
		var mediabody = $("<div class='media-body'>");
		mediabody.append(title);
		mediabody.append(num);
		mediabody.append(body);


		//Allows interaction for each review
		var div = $("<div>");

		var destroy = $("<i class='delete'>").text("Delete");
		destroy.hover(
			function() {
				$(this).css("font-weight", "bolder")
			}, function() {
				$(this).css("font-weight", "normal")
		});
		destroy.click(function() {
			item.destroy({
				success: getData
			})
		});
		destroy.appendTo(div);

		var like = $("<span class='glyphicon glyphicon-thumbs-up'></span>");
		like.click(function() {
			item.increment("upvotes")
			item.save(null, {
				success:getData
			});
		});
		var likedisplay = $("<span class='num'>").text(item.get("upvotes"));
		like.appendTo(div);
		likedisplay.appendTo(div);

		var dislike = $("<span class='glyphicon glyphicon-thumbs-down'></span>");
		dislike.click(function() {
			item.increment("downvotes")
			item.save(null, {
				success:getData
			});
		});
		var dislikedisplay = $("<span class='num'>").text(item.get("downvotes"));
		dislike.appendTo(div);
		dislikedisplay.appendTo(div);


		mediabody.append(div);

		mediabody.appendTo(media);



		$("#pastreviews").append(media);
	};

	var updateOverallRating = function(ratingcombined, total) {

	};

	getData();

});