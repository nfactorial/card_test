'use strict';

const CONNECTION_TIMEOUT = 1000 * 5;

/**
 * Manages a players connection between the server and client.
 */
class Connection {
    constructor( socket, player ) {
        if ( !socket ) {
            throw 'Cannot create connection without a valid socket.';
        }

        if ( !player ) {
            throw 'Cannot create connection without a valid player.';
        }

        this.socket = socket;
        this.player = player;
        this.keepAlive = Date.now();

        socket.on( 'disconnect', this.onDisconnect.bind( this ) );
    }

    /**
     * Called by Socket.io when the connection has dropped.
     */
    onDisconnect() {
        this.socket = null;
    }

    /**
     * Determines whether or not the connection should be considered alive.
     * @returns {boolean} True if the connection should be considered alive, otherwise false.
     */
    isAlive() {
        return ((Date.now() - this.keepAlive) < CONNECTION_TIMEOUT );
    }
}