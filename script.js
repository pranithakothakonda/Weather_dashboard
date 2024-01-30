//  set up varialbles using boilerplate
const oneDayCity = $(".city"),
	oneDayWind = $(".wind"),
	oneDayHumidity = $(".humidity"),
	oneDayTemp = $(".temp"),
	oneDayUvindex = $(".UVindex"),
	oneDayWeather = $(".weather"),
	oneDayLatitude = $(".lat"),
	oneDayLongitude = $(".lon"),
	oneDayIcon = $(".icon"),
	citiesContainer = $("#cities"),
	searchButton = $("#search"),
	apiKey = "f7beb73a262bbf898ba7bef91aaf85e4";

let city = ["Austin", "Houston", "Dallas", "San Marcos"];

// document ready as a startup function to set everything once document loaded correctly
$(document).ready(() => {
	// First let's get the data stored at Local Storage
	let getData = JSON.parse(localStorage.getItem("myCityKey"));
	console.log(getData);

	// If there is nothing in Local Storage then you need to add city array as a starting cities to generate buttons
	if (getData === null) {
		localStorage.setItem("myCityKey", JSON.stringify(city));
		getData = JSON.parse(localStorage.getItem("myCityKey"));
	}

	// If  search button Onclick, get the value out of input and add in Local Storage
	$(document).on("click", "#search", function () {
		// value of the search input
		let newCity = $(".form-control").val(); //you can use .toLower() to convert whatever value to lower case dEnver
		// pushing this value into Local Storage array
		//check if newCity is already in the array if it is => alert esle getData.push(newCity);
		console.log(getData);
		if (getData.indexOf(newCity) != -1) {
			alert("This city is already listed.");
		} else {
			getData.push(newCity);
		}
		// adding that into local storage
		localStorage.setItem("myCityKey", JSON.stringify(getData));
		// run create button to create that button
		createButton();
	});

	// Generate button through the Local Storage
	const createButton = function () {
		citiesContainer.empty();
		for (let i = 0; i < getData.length; i++) {
			let phrase = getData[i];
			const capitalStr = phrase.charAt(0).toUpperCase() + phrase.slice(1);
			let cityName = $("<button>")
				.addClass("searchWeather btn btn-dark btn-block")
				.text(capitalStr) //presentation on the page
				.val(getData[i]); //not sure if you want to change that
			citiesContainer.append(cityName);
		}
	};
	// run create button function to genrate buttons
	createButton();

	// click any city button to generate name that needs to put into api
	$(document).on("click", ".searchWeather", function () {
		let x = $(this).val();
		console.log(x);
		getWeather(x);
	});

	// get weather through ajax
	let getWeather = function (x) {
		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				x +
				"&appid=" +
				apiKey,
			method: "GET",
		}).then(function (res) {
			console.log(res);
			oneDayCity.text(res.name).addClass("text-danger");
			oneDayWind.text("Wind: " + res.wind.speed);
			oneDayHumidity.text("Humidity: " + res.main.humidity);
			oneDayTemp.text(
				"Current Temprature: " + Math.round((res.main.temp - 273.17) * 1.8 + 32)
			);
			oneDayWeather.text("Weather: " + res.weather[0].description);
			oneDayLatitude.text("Latitude: " + res.coord.lat);
			oneDayLongitude.text("Longitude:" + res.coord.lon);
			let img = $("<img>")
				.attr(
					"src",
					"https://openweathermap.org/img/w/" + res.weather[0].icon + ".png"
				)
				.attr("width", 100);
			oneDayIcon.empty().append(img);

			// getting UV info througu Lon and Let
			$.ajax({
				url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${res.coord.lat}&lon=${res.coord.lon}`,
				method: "GET",
			}).then(function (res) {
				oneDayUvindex.text("UV Index: " + res.value);
				console.log(res);
			});

			// getting Five days forcast
			$.ajax({
				url:
					"https://api.openweathermap.org/data/2.5/forecast?q=" +
					x +
					"&appid=" +
					apiKey,
				method: "GET",
			}).then(function (res) {
				console.log(res);
				$("#fivedayforecast").empty();
				// weather dates are we want to show
				//weatherDates[3] = 24
				// we are going to pass this value as x in next function
				const weatherDates = [0, 8, 16, 24, 32];

				let dateBlock = function (x) {
					let a = $("<div>")
						.addClass("bg-info p-3 mr-3 text-dark")
						.text(res.list[x].dt_txt.substring(0, 10));

					let b = $("<img>")
						.attr(
							"src",
							"https://openweathermap.org/img/w/" +
								//passing x value
								res.list[x].weather[0].icon +
								".png"
						)
						.attr("width", 100);

					let c = $("<p></p>")
						.text(
							// passing x value
							Math.round((res.list[x].main.temp - 273.17) * 1.8 + 32) + "˚F"
						)
						.addClass("h3");

					let d = $("<p></p>").text("Humidity: " + res.list[x].main.humidity);
					// e is the empty div
					let e = $("<div>");
					e.append(a, b, c, d);
					$("#fivedayforecast").append(e);
				};

				for (let index = 0; index < weatherDates.length; index++) {
					//x = 24
					//dateBlock(x) = dateBlock(24)
					dateBlock(weatherDates[index]);
				} //our date block is similar to our x we aenrt going to repeat
			});
		});
	};

	// default weather Austin if no button clicked
	getWeather("Austin");

	// End of document ready
});