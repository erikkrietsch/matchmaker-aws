var pg = require('pg');

exports.getPlayers = function(event, callback) {
	var client = new pg.Client();
	client.connect(function (err) {
		client.query("select * from players order by id asc", function(err, result) {
			client.end();
			if (err) {
				callback(err, null);
				return;
			} else {
				callback(null, result.rows);
				return;
			}
		});
	});
}
