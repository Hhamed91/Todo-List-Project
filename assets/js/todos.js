// Check Off Specific Todos By Clicking
$("ul").on("click", "li", function () {
	$(this).toggleClass("completed");
});

//Click on X to delete Todo
$("ul").on("click", "span", function (event) {
	$(this).parent().fadeOut(500, function () {
		$(this).remove();
	});
	event.stopPropagation();
});

//DB setup

var firebaseConfig = {
	apiKey: "AIzaSyDqiSwekCV6ZxzRjfYFUO3QGR6rJBp4ifM",
	authDomain: "todo-list-81cb2.firebaseapp.com",
	databaseURL: "https://todo-list-81cb2.firebaseio.com",
	projectId: "todo-list-81cb2",
	storageBucket: "todo-list-81cb2.appspot.com",
	messagingSenderId: "392897560915",
	appId: "1:392897560915:web:0d868128e79ed9ab"
};

$("input[type='text']").keypress(function (event) {
	if (event.which === 13) {
		//grabbing new todo text from input
		var todoText = $(this).val();

		$(this).val("");
		var term = todoText;

		//create a new li and add to ul
		$("ul").append("<li><span><i class='fa fa-trash'></i></span> " + todoText + "</li>")

		var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + term + "&location=sanfrancisco";
		$.ajax({
			url: myurl,
			headers: {
				'Authorization': 'Bearer q4VDsdVQ4XxKVg47BVqJlrfvvphYq2NA5vgRu1Lp39Yi05rt3lvgYK77SNiQQjCtlQoLOtQ9HWWIiW7g-U80V_ygMY0JiB9v6BYLnxt6mjEH9uEUd9DnoGVcb91OXXYx',
			},
			method: 'GET',
			dataType: 'json',
			success: function (data) {
				// Grab the results from the API JSON return
				var totalresults = data.total;
				// console.log(totalresults);
				// If our results are greater than 0, continue
				if (totalresults > 0) {
					// Display a header on the page with the number of results
					$('#results').append('<h5>We discovered ' + totalresults + ' results!</h5>');
					// Itirate through the JSON array of 'businesses' which was returned by the API
					$.each(data.businesses, function (i, item) {
						// Store each business's object in a variable
						var id = item.id;
						// console.log(id);
						var alias = item.alias;
						// console.log(id);
						var phone = item.display_phone;
						// console.log(id);
						var image = item.image_url;
						var name = item.name;
						// console.log(name);


						var rating = item.rating;
						var reviewcount = item.review_count;
						var address = item.location.address1;
						var city = item.location.city;
						var state = item.location.state;
						var zipcode = item.location.zip_code;

						//    Append our result into our page
						// $('#dbResults').append('<div id="' + id + '" style="margin-top:50px;margin-bottom:50px;"><img src="' + image + '" style="width:200px;height:150px;"><br>We found <b>' + name + '</b> (' + alias + ')<br>Business ID: ' + id + '<br> Located at: ' + address + ' ' + city + ', ' + state + ' ' + zipcode + '<br>The phone number for this business is: ' + phone + '<br>This business has a rating of ' + rating + ' with ' + reviewcount + ' reviews.</div>');
						//    $('#results').append('<div id="' + id + "<br></br>" + name);



						{/* // Initialize Firebase  */ }

						firebase.initializeApp(firebaseConfig);

						var db = firebase.database();

						db.ref().on("value", function (snapshot) {
							var data = snapshot.val();

							$('#dbResults').empty();

							for (var results in data) {

								var d = $('<p>');

								var t = {
									name: data.results.placeName,
									// "id" : data.results.item.id,
									// "alias" : data.results.item.alias,
									// "phone" : data.results.item.display_phone,
									// "image" : data.results.item.image_url,
									// "name" : data.results.item.name,
									// "rating" : data.results.item.rating,
									// "reviewcount" : data.results.item.review_count,
									// "address" : data.results.item.location.address1,
									// "city" : data.results.item.location.city,
									// "state" : data.results.item.location.state,
									// "zipcode" : data.results.item.location.zip_code,
								}

								d.append(t)

								//   debugger;
								$('#dbResults').append(d);
							}
						});


						db.ref("results").set({
							placeName: name,
							phoneNum: phone,
							id: id,
							alias: alias,
							rating: rating,
							reviewCount: reviewcount,
							address: address
						});




						// 	db.ref("toDoItems").push({
						// 		todoText: todoText
						// 	})
						// 	db.ref("yelpData").push({
						// 		placeName: name,
						// 		phoneNum: phone,
						// 		id: id,
						// 		alias: alias,
						// 		rating: rating,
						// 		reviewCount: reviewcount,
						// 		address: address

						// })


						// 	db.ref().on("value", () => {

						// 	})

					});
				} else {
					// If our results are 0; no businesses were returned by the JSON therefor we display on the page no results were found
					$('#results').append('<h5>We discovered no results!</h5>');
				}
			}
		});
	}
});

$("#toggle-form").click(function () {
	$("input[type='text']").fadeToggle();
});

{/* Your web app's Firebase configuration */ }