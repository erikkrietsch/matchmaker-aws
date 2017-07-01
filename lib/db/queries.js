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
  `,
  playerStats: `
    with north_matches as (
            select dmo.doubles_match_id, dmo.north_wins, p.id as player_id, p.first_name
            from
                    teams t,
                    players p,
                    season_league_players slp,
                    doubles_matches dm,
                    doubles_match_outcomes dmo,
                    seasons s
            where slp.player_id = p.id
            and slp.id in (t.season_league_player1_id, t.season_league_player2_id)
            and t.id = dm.north_team_id
            and dm.id = dmo.doubles_match_id
            and s.id = slp.season_id
            and s.active = 't'
            and slp.active = 't'
            group by p.id, p.first_name, dmo.doubles_match_id
    ),
    south_matches as (
            select dmo.doubles_match_id, dmo.south_wins, p.id as player_id, p.first_name
            from
                    teams t,
                    players p,
                    season_league_players slp,
                    doubles_matches dm,
                    doubles_match_outcomes dmo,
                    seasons s
            where slp.player_id = p.id
            and slp.id in (t.season_league_player1_id, t.season_league_player2_id)
            and t.id = dm.south_team_id
            and dm.id = dmo.doubles_match_id
            and s.id = slp.season_id
            and s.active = 't'
            and slp.active = 't'
            group by p.id, p.first_name, dmo.doubles_match_id
    ),
    matches as (
            select player_id, doubles_match_id, north_wins as wins from north_matches
            union all
            select player_id, doubles_match_id, south_wins as wins from south_matches
    )


    select
            p.*,
            sum(coalesce(wins, 0)) as wins,
            count(matches.doubles_match_id) * 3 as total,
            round(sum(coalesce(wins, 0))::numeric / (count(coalesce(matches.doubles_match_id, 0)) * 3), 3) as win_percentage
    from players p
    left join matches on p.id = matches.player_id
    group by 1
    order by 4 desc, 1 asc
  `
}