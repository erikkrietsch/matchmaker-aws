var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');
var matchmaker = rewire('../lib/matchmaker');


describe('Matchmaker', function() {
	describe('getPlayers', function() {
		beforeEach(function() {
			this.playerData = {
				rows: [
					{
						first_name: "Player",
						last_name: "One"
					},
					{
						first_name: "Player",
						last_name: "Two"
					}
				]
			}
			this.client = {
				query: sinon.stub().yields(null, this.playerData),
				end: sinon.stub().yields(null)
			}

			matchmaker.__set__("client", this.client);
		});

		it('should return players', function(done) {
			var players = this.playerData.rows;
			matchmaker.getPlayers(null, function(err, result) {
				expect(result).to.deep.equal(players);
				done();
			});
		});
	});
});
