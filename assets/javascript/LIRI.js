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
var inputCommand = process.argv[2];
var inputTerm = process.argv.slice(3).join(' ');


runCommand(inputCommand, inputTerm);


// ON INQUIRER BRANCH TO TEST
// to log into a file make a function that console.logs and writes the log to a file and 
// replace each console.log with this function

function runCommand(command, term) {
    switch (command) {

        case 'my-tweets':
            var params = { screen_name: 'Justinc101011' };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    for (var i = 0; i < 20; i++) {
                        console.log('--------------------------------------------------------------------------------------------------');
                        console.log('Tweet Timestamp: ' + tweets[i].created_at);
                        console.log('Tweet: ' + tweets[i].text);
                    }
                    console.log('==================================================================================================');
                }
            });
            break;

        case 'spotify-this-song':
            spotify.search({ type: 'track', query: term }, function(err, data) {
                if (err) {
                    console.log('Error occurred: ' + err);
                    return;
                }
                if (typeof data.tracks.items[0] == 'undefined') {
                    console.log('--------------------------------------------------------------------------------------------------');
                    console.log('Artist: Ace of Bass');
                    console.log('Track Name: The Sign');
                    console.log('Track Preview: https://p.scdn.co/mp3-preview/177e65fc2b8babeaf9266c0ad2a1cb1e18730ae4?cid=null');
                    console.log('Album: The Sign (US Album) [Remastered]');
                    console.log('==================================================================================================');
                } else {
                    for (var i = 0; i < 50; i++) {
                        if (typeof data.tracks.items[i] == 'undefined') {
                            break;
                        }
                        var artists = [];
                        for (var j = 0; j < data.tracks.items[i].artists.length; j++) {
                            artists.push(data.tracks.items[i].artists[j].name);
                        }
                        console.log('--------------------------------------------------------------------------------------------------');
                        console.log('Artist: ' + artists.join(', '));
                        console.log('Track Name: ' + data.tracks.items[i].name);
                        console.log('Track Preview: ' + data.tracks.items[i].preview_url);
                        console.log('Album: ' + data.tracks.items[i].album.name);
                    }
                    console.log('==================================================================================================');
                }
            });
            break;

        case 'movie-this':
            var OMDBLink = 'http://www.omdbapi.com/?t=' + term + '&y=&plot=short&tomatoes=true&r=json';
            request(OMDBLink, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('--------------------------------------------------------------------------------------------------');
                    // Title of the movie
                    console.log('Title: ' + JSON.parse(body).Title);
                    // Year the movie came out
                    console.log('Release Year: ' + JSON.parse(body).Year);
                    // IMDB Rating of the movie
                    console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
                    // Country where the movie was produced
                    console.log('Country of production: ' + JSON.parse(body).Country);
                    // Language of the movie
                    console.log('Language: ' + JSON.parse(body).Language);
                    // Plot of the movie 
                    console.log('Plot: ' + JSON.parse(body).Plot);
                    // Actors in the movie
                    console.log('Actors: ' + JSON.parse(body).Actors);
                    // Rotten Tomatoes Rating
                    console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).tomatoRating);
                    // Rotten Tomatoes URL
                    console.log('Rotten Tomatoes URL: ' + JSON.parse(body).tomatoURL);
                    console.log('==================================================================================================');
                }
            });
            break;

        case 'do-what-it-says':
            fs.readFile('../../random.txt', 'utf8', function(err, data) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    dataArr = data.split(',');
                    var caseCommand = dataArr[0];
                    var caseTerm = dataArr[1];
                    runCommand(caseCommand, caseTerm);
                }
            });
            break;

        default:
            console.log('Please enter a valid command');
    }
}
