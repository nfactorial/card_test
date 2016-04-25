'use strict';

/**
 * Represents a user who can create and play in game sessions.
 */
class Player {
    constructor( account ) {
        if ( !account ) {
            throw 'Cannot create Player object without a valid account.';
        }

        this.name = null;
        this.account = account;
        this.keepAlive = Date.now();
        this.playerType = Player.PlayerType.STANDARD;
    }
}

Player.PlayerType = {
    GUEST: 0,
    STANDARD: 1,
    ADMIN: 1000
};


module.exports = Player;
