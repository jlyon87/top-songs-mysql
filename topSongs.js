var mysql = require("mysql");
var config = require("./sqlConfig.js");
var connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

connection.connect();

var queryByArtist = function(artist) {
	connection.query({
		sql: "SELECT position, artist, song, year FROM `top5000` WHERE `artist` = ? ORDER BY `year` DESC",
		timeout: 40000,
		values: [artist],
	}, function(err, results, fields) {
		if(err) {
			throw err;
		}
		console.log("results", results);
		console.log("how many " + artistName + "?", results.length);
		console.log("fields", fields.length);

		connection.end();
	});
};

var artistName = process.argv.slice(2).join(" ");
queryByArtist(artistName);
