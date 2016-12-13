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
var command = process.argv[2];
var term = process.argv.slice(3).join(' ');


switch (command) {
    case 'my-tweets':
        var params = { screen_name: 'Justinc101011' };
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                for (var i = 0; i < 20; i++) {
                    console.log(tweets);
                }
            }
        });
        break;

    case 'spotify-this-song':
        spotify.search({ type: 'track', query: term }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            for (var i = 0; i < 5; i++) {
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
        });
        break;

    case 'movie-this':
        var OMDBLink = 'http://www.omdbapi.com/?t=' + term + '&y=&plot=short&tomatoes=true&r=json';
        request(OMDBLink, function(error, response, body) {
            console.log(OMDBLink);
            if (!error && response.statusCode == 200) {
                console.log(body);
                //                 * Title of the movie.
                console.log('Title: ' + body.Title);
                // * Year the movie came out.
                console.log('Release Year: ' + body.Year);
                // * IMDB Rating of the movie.
                console.log('IMDB Rating: ' + body.imdbRating);
                // * Country where the movie was produced.
                console.log('Country of production: ' + body.Country);
                // * Language of the movie.
                console.log('Language: ' + body.Language);
                // * Plot of the movie .
                console.log('Plot: ' + body.Plot);
                // * Actors in the movie.
                console.log('Actors: ' + body.Actors);
                // * Rotten Tomatoes Rating.
                console.log('Rotten Tomatoes Rating: ' + body.tomatoRating);
                // * Rotten Tomatoes URL.
                console.log('Rotten Tomatoes URL: ' + body.tomatoURL);
            }
        });
        break;

    case 'do-what-it-says':

        break;

    default:

}
