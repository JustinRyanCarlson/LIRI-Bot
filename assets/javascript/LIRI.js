var twitterKeysFile = require('./keys.js');
var twitterKeysObject = twitterKeysFile.twitterKeys;

if (process.argv[2] === 'my-tweets') {
    client.post('statuses/update', { status: 'I am a tweet' }, function(error, tweet, response) {
        if (!error) {
            console.log(tweet);
        }
    });
}
