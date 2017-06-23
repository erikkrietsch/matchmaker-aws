var Promise = require('bluebird')
var { graphql, buildSchema } = require('graphql')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    what: String
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello from MatchmakerQL!'
  },
  what: () => {
    return 'What did you expect'
  }
}

module.exports.query = (event) => {
	return Promise.resolve(graphql(schema, event.body, root))
}