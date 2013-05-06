module.exports = {
    trends: {
        urlOpts: {
            host: 'api.twitter.com',
            path: '/1/trends/1.json', // 1.json provides global trends,
            headers: {'User-Agent': 'Node Cookbook: Twitter Trends'}
        }      
    },
    tweets: {
        maxResults: 30, //twitter applies this very loosely for the "mixed" type
        resultsType: 'realtime',
        language: 'en', //ISO 639-1 code
        urlOpts: {
            host: 'search.twitter.com',
            headers: {'User-Agent': 'Node Cookbook: Twitter Trends'}
        }
    },
    jsonHandler: function(response, cb){
        var json = '';
        response.setEncoding('utf8');
        if(response.statusCode === 200){
            response.on('data', function(chunk){
                json += chunk;
            }).on('end', function(){
                cb(JSON.parse(json));
            });
        } else {
            throw ("Sever returned statusCode error: " + response.statusCode);
        }
    },
    tweetPath: function(q){
        var p = '/search.json?lang=' + this.tweets.language + '&q=' + q +
            '&rpp=' + this.tweets.maxResults + '&include_entities=true' +
            '&with_twitter_user_id=true&result_type=' + this.tweets.resultsType;
        this.tweets.urlOpts.path = p;
    }
};