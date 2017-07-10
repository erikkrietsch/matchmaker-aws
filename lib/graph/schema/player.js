var db = require('../../db')
var {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLSchema,
  GraphQLString
} = require('graphql/type')


const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the player'
    },
    firstName: {
      type: GraphQLString,
      description: 'The player\'s first name'
    },
    lastName: {
      type: GraphQLString,
      description: 'The player\'s last name'
    },
    slackHandle: {
      type: GraphQLString,
      description: 'The player\'s Slack handle'
    }
  })
})

class Player {
  constructor(id, {first_name, last_name, slack_handle}) {
    this.id = id
    this.firstName = first_name
    this.lastName = last_name
    this.slackHandle = slack_handle
  }
  static fetch(id) {
    if (id) {
      return db.fetchPlayer(id)
      .then(player => new Player(id, player))
    }
    return db.fetchPlayers()
    .map(p => new Player(p.id, p))
  }
}

module.exports.Player = Player
module.exports.PlayerType = PlayerType
