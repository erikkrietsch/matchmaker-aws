var db = require('../../db')
var { Player, PlayerType } = require('./player.js')
var {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean
} = require('graphql/type')


const AvailabilityType = new GraphQLObjectType({
  name: 'Avilability',
  fields: () => ({
    player: {
      type: PlayerType,
      description: 'The player',
      resolve: (avail) => Player.fetch(avail.playerId)
    },
    day: {
      type: GraphQLString,
      description: 'The day of availability'
    },
    available: {
      type: GraphQLBoolean,
      description: 'Whether the player is available'
    }
  })
})

class Availability {
  constructor(playerId, {day, available}) {
    this.playerId = playerId
    this.day = day
    this.available = available
  }
  static set(id, available) {
    return db.setPlayerAvailability(id, available)
    .then((availability) => {
      return new Availability(id, availability)
    })
  }
}

module.exports.Availability = Availability
module.exports.AvailabilityType = AvailabilityType