'use strict';

var chai = require('chai');
var expect = chai.expect;
var Deck = require('../../../lib/deck');

/**
 * Verify the Deck class behaves as expected.
 */
describe('server/deck', function() {
    it('Should be empty when constructed.', function() {
        let deck = new Deck();

        expect(deck.cardList.length).to.equal(0);
        expect(deck.currentDeck.length).to.equal(0);
    });
});
