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
logger('User input: ' + inputCommand + ' ' + inputTerm);



runCommand(inputCommand, inputTerm);



function runCommand(command, term) {
    switch (command) {

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

        case 'spotify-this-song':
            spotify.search({ type: 'track', query: term }, function(err, data) {
                if (err) {
                    logger('Error occurred: ' + err);
                    return;
                }
                if (typeof data.tracks.items[0] == 'undefined') {
                    logger('--------------------------------------------------------------------------------------------------');
                    logger('Artist: Ace of Bass');
                    logger('Track Name: The Sign');
                    logger('Track Preview: https://p.scdn.co/mp3-preview/177e65fc2b8babeaf9266c0ad2a1cb1e18730ae4?cid=null');
                    logger('Album: The Sign (US Album) [Remastered]');
                    logger('==================================================================================================');
                } else {
                    for (var i = 0; i < 20; i++) {
                        if (typeof data.tracks.items[i] == 'undefined') {
                            break;
                        }
                        var artists = [];
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

        default:
            logger('Please enter a valid command');
            logger('Valid Commands are: my-tweets, spotify-this-song, movie-this, or do-what-it-says');
    }
}



function logger(stdout) {
    var currentTime = Date.now();
    console.log(stdout);
    fs.appendFile('../../log.txt', currentTime + '           ' + stdout + '\n', function(err) {
        if (err) throw err;
    });
}
