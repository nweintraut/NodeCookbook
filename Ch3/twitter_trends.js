var http = require('http');
var colors = require('colors');
var util = require('util');
var trendingTopics = require('./trending_topics');
function makeCall(urlOpts, cb){
    http.get(urlOpts, function(response){ // make a call to the twitter API
        trendingTopics.jsonHandler(response, cb);
    }).on('error', function(e){
        console.log("Connection Error: " + e.message);
    });
}

makeCall(trendingTopics.trends.urlOpts, function(trendsArr){
    trendingTopics.tweetPath(trendsArr[0].trends[0].query);
    makeCall(trendingTopics.tweets.urlOpts, function(tweetsObj){
       tweetsObj.results.forEach(function(tweet){
          console.log("\n" + tweet.from_user.yellow.bold + ": " + tweet.text); 
       });
    });
});
