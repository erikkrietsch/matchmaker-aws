var Promise = require('bluebird')
var { graphql, buildSchema } = require('graphql')
var db = require('../db')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Player {
    id: ID!
    firstName: String
    lastName: String
    slackHandle: String
  }

  type Availability {
    player: Player,
    date: String,
    available: Boolean
  }

  type Query {
    getPlayer(id: ID!): Player
    getPlayers: [Player]
    setAvailable(id: ID!, available: Boolean): Availability
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
    .map(player => new Player(player.id, player))
  },
  setAvailable: ({id, available}) => {
    return Promise.join(
      db.setPlayerAvailability(id, available),
      db.fetchPlayer(id)
    )
    .spread((availability, player) => {
      return {
        player: new Player(id, player),
        date: availability.day,
        available: availability.available
      }
    })
  }
}

module.exports.query = (event) => {
	return Promise.resolve(graphql(schema, event.body, root))
}