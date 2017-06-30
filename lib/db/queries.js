const config = require('../../config')

module.exports = {
  fetchPlayers: "select * from players order by id",
  fetchPlayer: "select * from players where id = $1",
  setPlayerAvailability: `
    insert into player_availability (day, player_id, available)
    values ((now() AT TIME ZONE '${config.timezone}')::date, $1, $2)
    on conflict (player_id, day) do update set available = $2, answered = now()
    returning
      player_id, available, day
  `
}