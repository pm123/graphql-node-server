const { tweets, authors, stats } = require('./data');

const resolvers = {
    Query: {
        Tweets: () => tweets,
        Tweet: (_, { id }) => tweets.find(tweet => tweet.id == id),
    },
    Mutation: {
        createTweet: (_, { body }) => {
            const nextTweetId = tweets.reduce((id, tweet) => Math.max(id, tweet.id), -1) + 1;
            const newTweet = {
                id: nextTweetId,
                date: new Date(),
                author_id: currentUserId,
                body,
            };
            tweets.push(newTweet);
            return newTweet;
        },
    },
    Tweet: {
        Author: (tweet) => authors.find(author => author.id == tweet.author_id),
        Stats: (tweet) => stats.find(stat => stat.tweet_id == tweet.id),
    },
    User: {
        full_name: (author) => `${author.first_name} ${author.last_name}`,
    },
}

module.exports = resolvers;