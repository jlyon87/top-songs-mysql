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
	console.log("Total Results: ", data.length);
};

var printAggregateTable = function(data) {
	var table = new Table({
		head: ["Artist", "Hits"],
		colWidths: [50, 6]
	});

	data.forEach(function(row) {
		table.push([row.artist, row.hitCount]);
	});

	console.log(table.toString());
	console.log("Total Results: ", data.length);
};

var queryHandler = function(err, results, fields) {
	if(err) {
		exit("Error during query.");
		throw err;
	}
	printResultsTable(results);
	connection.end();
};

var aggregateHandler = function(err, results, fields) {
	if(err) {
		exit("Error during query.");
		throw err;
	}
	printAggregateTable(results);
	connection.end();
};

/*
	Query songs by artist
	enter artist name after command
*/
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
	}, queryHandler);
};

/*
	Query Top Ten Songs
*/
var queryTopTen = function() {
	connection.query({
		sql: selectFrom + "ORDER BY `position` ASC LIMIT 10",
		timeout: 40000
	}, queryHandler);
};

/*
	Query Top Ten contributing Artists by Number of Songs
*/
var queryMostPopular = function() {
	connection.query({
		sql: "SELECT COUNT(position) hitCount, artist FROM `top5000` GROUP BY `artist` HAVING COUNT(`position`) > 9 ORDER BY hitCount DESC LIMIT 10",
		timeout: 40000
	}, aggregateHandler);
};

/*
	available commands
*/
var commands = {
	byArtist: queryByArtist,
	topTen: queryTopTen,
	popular: queryMostPopular
};

var command = process.argv[2];
if(!command || !commands[command]) {
	exit("Please enter a valid command.");
	return;
}
commands[command]();
