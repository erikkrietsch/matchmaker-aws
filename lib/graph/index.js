var Promise = require('bluebird')
var { graphql, buildSchema } = require('graphql')
var { MatchmakerSchema } = require('./schema')
var db = require('../db')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Player {
    id: ID!
    firstName: String
    lastName: String
    slackHandle: String
    availability: Availability
  }

  type Availability {
    player: Player,
    day: String,
    available: Boolean
  }

  type PlayerStats {
    player: Player,
    wins: Int,
    played: Int,
    winPercentage: Float
  }

  type Query {
    getPlayer(id: ID!): Player
    getPlayers: [Player]
    setAvailable(id: ID!, available: Boolean!): Availability
    getPlayerStats: [PlayerStats]
  }
`)

module.exports.query = (event) => {
  return Promise.resolve(graphql({schema: MatchmakerSchema, source: event.body}))
}