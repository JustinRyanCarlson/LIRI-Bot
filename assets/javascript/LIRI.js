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
var command = process.argv[2];
var term = process.argv.slice(3).join(' ');


switch (command) {
    case 'my-tweets':
        var params = { screen_name: 'Justinc101011' };
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                for (var i = 0; i < 20; i++) {
                    console.log(tweets[i].text);
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

        break;

    case 'do-what-it-says':

        break;

    default:

}
