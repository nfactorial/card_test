'use strict';

/**
 * Manages a single instance of a game session.
 *
 * Game sessions may be public or private.
 * A public session allows other users to observe a session in play.
 * A private session cannot be observed.
 */
class Session {
    constructor() {
        this.isPrivate = true;
        this.startTime = Date.now();
        this.players = [];
        this.observers = [];
    }

    /**
     * Attempts to add a player to the session.
     *
     * To join a session, a player must supply a token that allows
     * them access to the session.
     *
     * @param player {Player} The player who wishes to join the session.
     * @param accessToken {Number} Security key that identifies the user to the session.
     * @returns {boolean} True if the player joined the session successfully otherwise false.
     */
    addPlayer(player, accessToken) {
        return false;
    }

    /**
     * Attempts to add a player who wishes to observe the session.
     * @param player {Player} The player who wishes to join the session.
     * @param accessToken {Number} Security key that identifies the user to the session.
     * @returns {boolean} True if the player joined the session successfully otherwise false.
     */
    addObserver(player, accessToken) {
        if (!this.isPrivate) {
            //
        }

        return false;
    }
}

module.exports = Session;
