var mysql = require("mysql");
var Table = require("cli-table");

var config = require("./sqlConfig.js");
var connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

var selectFrom = "SELECT position, artist, song, year FROM `top5000`";

connection.connect();

var exit = function(message) {
	if(message) {
		console.log(message);
	}
	connection.end();
};

var printResultsTable = function(data) {
	var table = new Table({
		head: ["Position", "Artist", "Song", "Year"],
		colWidths: [10, 50, 50, 6]
	});

	data.forEach(function(row) {
		table.push([row.position, row.artist, row.song, row.year]);
	});

	console.log(table.toString());
};

var queryByArtist = function() {
	var artistName = process.argv.slice(3).join(" ");

	if(!artistName || typeof artistName !== "string") {
		exit("Please enter an artist name.");
		return;
	}

	var wildcardArtist = "%" + artistName + "%";
	connection.query({
		sql: selectFrom + "WHERE `artist` LIKE ? ORDER BY `year` DESC",
		timeout: 40000,
		values: [wildcardArtist],
	}, function(err, results, fields) {
		if(err) {
			exit("Error querying by Artist.");
			throw err;
		}
		printResultsTable(results);

		console.log("Total Results: ", results.length);

		connection.end();
	});
};

var commands = {
	byArtist: queryByArtist
};

/*
	node argv accepts any number of strings past the .js filename as the artist.
	usage: node topSongs.js song name
*/
var command = process.argv[2];
if(!command) {
	exit("Please enter a valid command.");
	return;
}
commands[command]();
