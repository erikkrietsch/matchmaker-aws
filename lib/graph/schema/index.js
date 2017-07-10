var {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} = require('graphql/type')

var { Player, PlayerType } = require('./player.js')
var { Availability, AvailabilityType } = require('./availability.js')
var { PlayerStats, PlayerStatsType } = require('./player-stats.js')
var { Team, TeamType } = require('./team.js')

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    player: {
      type: PlayerType,
      args: {
        id: {
          description: `ID for the player`,
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: (root, { id }) => Player.fetch(id)
    },
    players: {
      type: new GraphQLList(PlayerType),
      resolve: () => Player.fetch()
    },
    setAvailability: {
      type: AvailabilityType,
      args: {
        id: {
          description: `ID for the player`,
          type: new GraphQLNonNull(GraphQLInt)
        },
        available: {
          description: `Whether the player is available`,
          type: new GraphQLNonNull(GraphQLBoolean)
        }
      },
      resolve: (root, { id, available }) => Availability.set(id, available)
    },
    stats: {
      type: new GraphQLList(PlayerStatsType),
      resolve: () => PlayerStats.fetch()
    },
    teams: {
      type: new GraphQLList(TeamType),
      resolve: () => Team.fetch()
    }
  })
})

const MatchmakerSchema = new GraphQLSchema({ query: queryType, types: [ PlayerType, AvailabilityType ]});

module.exports.MatchmakerSchema = MatchmakerSchema


// var query = {
//   getPlayer: ({id}) => {
//     return db.fetchPlayer(id)
//     .then(player => new Player(id, player))
//   },
//   getPlayers: () => {
//     return db.fetchPlayers()
//     .map(player => new Player(player.id, player))
//   },
//   setAvailable: ({id, available}) => {
//     return db.setPlayerAvailability(id, available)
//     .then((availability) => {
//       return new Availability(id, availability)
//     })
//   },
//   getPlayerStats: () => {
//     return db.fetchPlayerStats()
//     .map(stats => {
//       return {
//         player: new Player(stats.id, stats),
//         wins: stats.wins,
//         played: stats.total,
//         winPercentage: stats.win_percentage
//       }
//     })
//   }
// }
