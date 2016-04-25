'use strict';

var chai = require('chai');
var expect = chai.expect;
var Player = require('../../../lib/player');

/**
 * Verify the Player class behaves as expected.
 */
describe('server/player', function() {
    it('Should fail to create without an account.', function() {
        expect( function() { new Player() } ).to.throw('Cannot create Player object without a valid account.');
    });

    it('Should be empty when constructed.', function() {
        const testAccount = {
            name: 'TestPlayer'
        };
        
        let player = new Player(testAccount);

        expect(player.name).to.equal(null);
        expect(player.playerType).to.equal(Player.PlayerType.STANDARD);
    });
});
