# top-songs-mysql

This repository is an academic run through of using the mysql npm package.

This is a CLI only node project. Commands are entered in the CLI to perform queries against a mysql database.

---
### Setup

 1. Clone this repository
 2. npm init
 3. npm install
 4. Create Database from [sqlSchema/schema.sql](sqlSchema/schema.sql)
  * [mysql workbench](https://www.mysql.com/products/workbench/) recommended
 5. Import data to top5000 from [sqlSchema/TopSongs.csv](sqlSchema/TopSongs.csv)
 6. Set connection config in topSongs.js with your database credentials

---
### Commands

> Commands follow this format: `node topSongs.js [command] [optional param]`

 1. Query by Artist, ex: `node topSongs.js byArtist Katy Perry`
 2. Query Top Ten Songs, `node topSongs.js topTen`
 3. Query Top Ten Artists, `node topSongs.js popular`
