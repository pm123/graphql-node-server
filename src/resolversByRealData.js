const { Client } = require('pg');
const MongoClient = require('mongodb').MongoClient;

const resolvers = {
    Query: {
        Tweets: (_, __, context) => context.pgClient
            .query('SELECT * from tweets')
            .then(res => res.rows),
        Tweet: (_, { id }, context) => context.pgClient
            .query('SELECT * from tweets WHERE id = $1', [id])
            .then(res => res.rows),
        User: (_, { id }, context) => context.pgClient
            .query('SELECT * from users WHERE id = $1', [id])
            .then(res => res.rows),
    },
    Tweet: {
        Author: (tweet, _, context) => context.pgClient
            .query('SELECT * from users WHERE id = $1', [tweet.author_id])
            .then(res => res.rows),
        Stats: (tweet, _, context) => context.mongoClient
            .collection('stats')
            .find({ 'tweet_id': tweet.id })
            .query('SELECT * from stats WHERE tweet_id = $1', [tweet.id])
            .toArray(),
    },
    User: {
        full_name: (author) => `${author.first_name} ${author.last_name}`
    },
}

const schema = makeExecutableSchema({ typeDefs, resolvers });
const start = async () => {
    const pgClient = new Client('postgresql://localhost:3211/foo');
    await pgClient.connect();
    const mongoClient = await MongoClient.connect('mongodb://localhost:27017/bar');

    var app = express();
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true,
        context: { pgClient, mongoClient },
    }));
    app.listen(4000);
};

start();
