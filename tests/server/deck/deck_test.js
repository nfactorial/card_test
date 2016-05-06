'use strict';

var chai = require('chai');
var expect = chai.expect;
var Deck = require('../../../lib/deck');
var Card = require('../../../lib/card');

/**
 * Verify the Deck class behaves as expected.
 */
describe('server/deck', function() {
    const card1 = new Card();
    const card2 = new Card();

    it('Should be empty when constructed.', function() {
        const deck = new Deck();

        expect(deck.cardList.length).to.equal(0);
        expect(deck.currentDeck.length).to.equal(0);
        expect(deck.peekCard()).to.equal(null);
        expect(deck.peekCard(0)).to.equal(null);
        expect(deck.peekCard(1)).to.equal(null);
        expect(deck.nextCard()).to.equal(undefined);
    });

    it('Should remain empty until reset is called.', function() {
        const deck = new Deck();

        const cardCount = 2;

        deck.cardList.push(card1);
        deck.cardList.push(card2);

        expect(deck.cardList.length).to.equal(cardCount);
        expect(deck.currentDeck.length).to.equal(0);
        expect(deck.nextCard()).to.equal(undefined);

        deck.reset();

        expect(deck.cardList.length).to.equal(cardCount);
        expect(deck.currentDeck.length).to.equal(cardCount);
    });

    it('Should allow peek to obtain a card.', function() {
        const deck = new Deck();

        deck.cardList.push(card1);
        deck.cardList.push(card2);

        deck.reset();

        expect(deck.peekCard()).to.equal(card1);
        expect(deck.peekCard(0)).to.equal(card1);
        expect(deck.peekCard(1)).to.equal(card2);
    });

    it('Should allow the next card to be removed.', function() {
        const deck = new Deck();

        deck.cardList.push(card1);
        deck.cardList.push(card2);

        deck.reset();

        expect(deck.nextCard()).to.equal(card1);
        expect(deck.nextCard()).to.equal(card2);
        expect(deck.nextCard()).to.equal(undefined);
    });

    it('Should allow us to shuffle the deck.', function() {
        const deck = new Deck();

        deck.reset();

        // TODO: Store old list of cards

        deck.shuffle();

        // TODO: Expect new list !== old list
    });

    it('Should allow us to insert new cards.', function() {
        const deck = new Deck();

        expect(deck.currentDeck.length).to.equal(0);

        deck.insertCard(card1);
        expect(deck.currentDeck.length).to.equal(1);

        deck.insertCard(card2);
        expect(deck.currentDeck.length).to.equal(2);
    });
});
