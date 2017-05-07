module.exports = {
  fetchPlayers: "select * from players order by id",
  fetchPlayer: "select * from players where id = $1"
}