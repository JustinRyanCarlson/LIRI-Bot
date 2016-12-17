// Various variable using require
var twitterKeysFile = require('./keys.js');
var twitterKeysObject = twitterKeysFile.twitterKeys;
var spotify = require('spotify');
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: twitterKeysObject.consumer_key,
    consumer_secret: twitterKeysObject.consumer_secret,
    access_token_key: twitterKeysObject.access_token_key,
    access_token_secret: twitterKeysObject.access_token_secret
});
var request = require('request');
var fs = require('fs');
// Declares the inputCommand variable as the 3rd argument passed in from
// the command line
var inputCommand = process.argv[2];
// Declares the inputTerm variable as everything after the index of 2 (stores as an array)
// then joins that array back together with spaces seperating each index
var inputTerm = process.argv.slice(3).join(' ');


// Calls the logger function so the users input is in the log.txt file
logger('User input: ' + inputCommand + ' ' + inputTerm);
// Calls the runCommand function and passes in the users input from the command line
runCommand(inputCommand, inputTerm);


// Function that takes in the command and term variable to determine which case to run and 
// what to pass to the API
function runCommand(command, term) {
    switch (command) {

        // If the command passed in is 'my-tweets' this case is ran and prints/logs the 20
        // most recent tweets from my Twitter with the time they were tweeted
        case 'my-tweets':
            var params = { screen_name: 'Justinc101011' };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    for (var i = 0; i < 20; i++) {
                        logger('--------------------------------------------------------------------------------------------------');
                        logger('Tweet Timestamp: ' + tweets[i].created_at);
                        logger('Tweet: ' + tweets[i].text);
                    }
                    logger('==================================================================================================');
                }
            });
            break;

            // If the command passed in is 'spotify-this-song' this case is ran
        case 'spotify-this-song':
            // Makes a request to the spotify api for the track the user searched
            spotify.search({ type: 'track', query: term }, function(err, data) {
                if (err) {
                    logger('Error occurred: ' + err);
                    return;
                }
                // If there are no items for the search (undefined) default to 'The Sign' by Ace of Bass
                // I hard-coded this because even if i searched 'The Sign' with the spotify API, it didn't
                // return what I was looking for first. I could have pointed to to an index, but this songs
                // index may change when a new song entitled 'The Sign' is uploaded
                if (typeof data.tracks.items[0] == 'undefined') {
                    logger('--------------------------------------------------------------------------------------------------');
                    logger('Artist: Ace of Bass');
                    logger('Track Name: The Sign');
                    logger('Track Preview: https://p.scdn.co/mp3-preview/177e65fc2b8babeaf9266c0ad2a1cb1e18730ae4?cid=null');
                    logger('Album: The Sign (US Album) [Remastered]');
                    logger('==================================================================================================');
                } else {
                    // Lines 70-84 loop over each result returned from the spotify API and call the logger function
                    // for the information we want. If spotify returns less than 20 results, the for loop will break
                    // out so we dont get a undefined type error
                    for (var i = 0; i < 20; i++) {
                        if (typeof data.tracks.items[i] == 'undefined') {
                            break;
                        }
                        var artists = [];
                        // Nested for loop needed to retrieve all the artists for a song since there
                        // can be more than one
                        for (var j = 0; j < data.tracks.items[i].artists.length; j++) {
                            artists.push(data.tracks.items[i].artists[j].name);
                        }
                        logger('--------------------------------------------------------------------------------------------------');
                        logger('Artist: ' + artists.join(', '));
                        logger('Track Name: ' + data.tracks.items[i].name);
                        logger('Track Preview: ' + data.tracks.items[i].preview_url);
                        logger('Album: ' + data.tracks.items[i].album.name);
                    }
                    logger('==================================================================================================');
                }
            });
            break;

            // If the command passed in is 'movie-this' this case is ran and prints/logs information
            // about the movie
            // If no movie information is returned from OMDB the runCommand function is called and
            // passes in the information needed to run movie-this for the movie Mr. Nobody (dafault)
        case 'movie-this':
            var OMDBLink = 'http://www.omdbapi.com/?t=' + term + '&y=&plot=short&tomatoes=true&r=json';
            request(OMDBLink, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (typeof JSON.parse(body).Title == 'undefined') {
                        runCommand('movie-this', 'Mr. Nobody');
                    } else {
                        logger('--------------------------------------------------------------------------------------------------');
                        // Title of the movie
                        logger('Title: ' + JSON.parse(body).Title);
                        // Year the movie came out
                        logger('Release Year: ' + JSON.parse(body).Year);
                        // IMDB Rating of the movie
                        logger('IMDB Rating: ' + JSON.parse(body).imdbRating);
                        // Country where the movie was produced
                        logger('Country of production: ' + JSON.parse(body).Country);
                        // Language of the movie
                        logger('Language: ' + JSON.parse(body).Language);
                        // Plot of the movie 
                        logger('Plot: ' + JSON.parse(body).Plot);
                        // Actors in the movie
                        logger('Actors: ' + JSON.parse(body).Actors);
                        // Rotten Tomatoes Rating
                        logger('Rotten Tomatoes Rating: ' + JSON.parse(body).tomatoRating);
                        // Rotten Tomatoes URL
                        logger('Rotten Tomatoes URL: ' + JSON.parse(body).tomatoURL);
                        logger('==================================================================================================');
                    }
                }
            });
            break;

            // If the command passed in is 'do-what-it-says' this case is ran and reads the file random.txt
            // then runs whatever is in the file as if the user input it from the command line
        case 'do-what-it-says':
            fs.readFile('../../random.txt', 'utf8', function(err, data) {
                if (err) {
                    logger('Error: ' + err);
                } else {
                    dataArr = data.split(',');
                    var caseCommand = dataArr[0];
                    var caseTerm = dataArr[1];
                    runCommand(caseCommand, caseTerm);
                }
            });
            break;

            // If no other case requirements are met, a valid command was not used and this case
            // prints/logs the information needed to use a valid case to the user
        default:
            logger('Please enter a valid command');
            logger('Valid Commands are: my-tweets, spotify-this-song, movie-this, or do-what-it-says');
    }
}


// Function that takes in what was going to be console.logged and still console.logs it then
// appends it to the log.txt file
function logger(stdout) {
    // Gets the current time for the timestamp
    var currentTime = Date.now();
    console.log(stdout);
    fs.appendFile('../../log.txt', currentTime + '           ' + stdout + '\n', function(err) {
        if (err) throw err;
    });
}
