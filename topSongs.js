var mysql = require("mysql");
var Table = require("cli-table");

var config = require("./sqlConfig.js");
var connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

var printTable = function(data) {
	var table = new Table({
		head: ["Position", "Artist", "Song", "Year"],
		colWidths: [10, 50, 50, 6]
	});

	data.forEach(function(row) {
		table.push([row.position, row.artist, row.song, row.year]);
	});

	console.log(table.toString());
};

connection.connect();

var queryByArtist = function(artistName) {
	var wildcardArtist = "%" + artistName + "%";
	connection.query({
		sql: "SELECT position, artist, song, year FROM `top5000` WHERE `artist` LIKE ? ORDER BY `year` DESC",
		timeout: 40000,
		values: [wildcardArtist],
	}, function(err, results, fields) {
		if(err) {
			throw err;
		}
		printTable(results);

		console.log("Total Results: ", results.length);

		connection.end();
	});
};


/*
	node argv accepts any number of strings past the .js filename as the artist.
	usage: node topSongs.js song name
*/
var artistName = process.argv.slice(2).join(" ");
queryByArtist(artistName);
