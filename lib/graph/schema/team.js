var db = require('../../db')
var {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLSchema,
  GraphQLString
} = require('graphql/type')
var { Player, PlayerType } = require('./player.js')

const TeamType = new GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    player1: {
      type: PlayerType,
      resolve: (team) => Player.fetch(team.player1Id)
    },
    player2: {
      type: PlayerType,
      resolve: (team) => Player.fetch(team.player2Id)
    }
  })
})

class Team {
  constructor(id, { player1_id, player2_id }) {
    this.id = id
    this.player1Id = player1_id
    this.player2Id = player2_id
  }
  static fetch() {
    return db.fetchTeams()
    .map(t => new Team(t.id, t))
  }
}

module.exports.Team = Team
module.exports.TeamType = TeamType