var pg = require('pg');

var client = new pg.Client();
client.connect(function (err) {
	if (err) throw err;
});

exports.getPlayers = function(event, callback) {
	client.query("select * from players order by id asc", function(err, result) {
		if (err) throw err;
		callback(null, result.rows);
		client.end(function (err) {
			if (err) throw err;
		});
	});
}
