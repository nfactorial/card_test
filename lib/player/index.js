'use strict';

const PlayerType = {
    GUEST: 0,
    STANDARD: 1,
    ADMIN: 1000
};

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
        this.playerType = PlayerType.STANDARD;
    }
}

module.exports = Player;