var db = require('../../db')
var { Player, PlayerType } = require('./player.js')
var {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat
} = require('graphql/type')


const PlayerStatsType = new GraphQLObjectType({
  name: 'PlayerStats',
  fields: () => ({
    player: {
      type: PlayerType,
      description: 'The player',
      resolve: (stats) => Player.fetch(stats.playerId)
    },
    wins: {
      type: GraphQLInt,
      description: 'The number of games won'
    },
    played: {
      type: GraphQLInt,
      description: 'The number of games played'
    },
    winPercentage: {
      type: GraphQLFloat,
      description: 'The percentage of games won'
    },
    lastPlayed: {
      type: GraphQLString,
      description: 'The last time the player played'
    }
  })
})

class PlayerStats {
  constructor(id, {wins, total, win_percentage, last_played}) {
    this.playerId = id
    this.wins = wins
    this.played = total
    this.winPercentage = win_percentage
    this.lastPlayed = last_played
  }
  static fetch() {
    return db.fetchPlayerStats()
    .map(stats => new PlayerStats(stats.id, stats))
  }
}

module.exports.PlayerStats = PlayerStats
module.exports.PlayerStatsType = PlayerStatsType
