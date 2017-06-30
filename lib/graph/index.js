var Promise = require('bluebird')
var { graphql, buildSchema } = require('graphql')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Player {
    id: ID!
    firstName: String
    lastName: String
    slackHandle: String
  }

  type Query {
    getPlayer(id: ID!): Player
    getPlayers: [Player]
  }
`)

class Player {
  constructor(id, {first_name, last_name, slack_handle}) {
    this.id = id,
    this.firstName = first_name,
    this.lastName = last_name,
    this.slackHandle = slack_handle
  }
}

// The root provides a resolver function for each API endpoint
var root = {
  getPlayer: ({id}) => {
    return db.fetchPlayer(id)
    .then(player => new Player(id, player))
  },
  getPlayers: () => {
    return db.fetchPlayers()
    .then(players => players.map(player => new Player(player.id, player)))
  }
}

module.exports.query = (event) => {
	return Promise.resolve(graphql(schema, event.body, root))
}