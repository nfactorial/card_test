'use strict';

var chai = require('chai');
var expect = chai.expect;
var CardSet = require('../../../lib/card_set');

/**
 * Verify the CardSet class behaves as expected.
 */
describe('server/card_set', function() {
    it('Should fail to create without a name.', function() {
        expect( function() { new CardSet() } ).to.throw('CardSet cannot be created without a valid name.');
    });

    it('Should be empty when constructed.', function() {
        const setName = 'Test';

        let cardSet = new CardSet(setName);

        expect(cardSet.name).to.equal(setName);
        expect(cardSet.cards.size).to.equal(0);
    });
});
