'use strict';

/**
 * Represents a user who can create and play in game sessions.
 */
class Player {
    /**
     * Prepares the player object for use by the server.
     * @param account {Account} The players account object.
     */
    constructor( account ) {
        if ( !account ) {
            throw 'Cannot create Player object without a valid account.';
        }

        this.name = null;
        this.account = account;
        this.keepAlive = Date.now();
        this.tags = {};
        this.playerType = Player.PlayerType.STANDARD;
    }

    /**
     * Adds a tag to the player object. A tag is a named blob of data, used to
     * remember certain information about operations being processed.
     *
     * @param tag {String} Name of the tag to be added.
     * @param timestamp {Number} Timestamp associated with the tag.
     * @param timeout {Number} Time (in milliseconds) before the tag is considered invalid.
     * @returns {boolean} True if the tag was added successfully otherwise false.
     */
    addTag(tag, timestamp, timeout) {
        if(!this.tags[tag]) {
            this.tags[tag] = {ts: timestamp, to: timeout};
            return true;
        }

        return false;
    }
}

Player.PlayerType = {
    GUEST: 0,
    STANDARD: 1,
    ADMIN: 1000
};


module.exports = Player;
