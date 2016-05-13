'use strict';

const CONNECTION_TIMEOUT = 1000 * 5;

/**
 * Manages a players connection between the server and client.
 */
class Connection {
    /**
     * Prepares the Connection object for use by the server.
     * @param gameServer {GameServer} The game server we belong to.
     * @param socket {Socket} The socket we are to communicate with.
     */
    constructor(gameServer, socket) {
        if (!gameServer) {
            throw new Error('Cannot create connection without a valid game server object.');
        }

        if (!socket) {
            throw new Error('Cannot create connection without a valid socket.');
        }

        this.gameServer = gameServer;
        this.socket = socket;
        this.player = null;
        this.keepAlive = Date.now();

        socket.on( 'disconnect', this.onDisconnect.bind(this) );

        console.log('client connected.');
    }

    /**
     * Called by our socket when the connection has dropped.
     */
    onDisconnect() {
        this.socket = null;

        console.log('client disconnected.');

        this.gameServer.removeConnection(this);
    }

    /**
     * Determines whether or not the connection should be considered alive.
     * @returns {boolean} True if the connection should be considered alive, otherwise false.
     */
    isAlive() {
        return ((Date.now() - this.keepAlive) < CONNECTION_TIMEOUT );
    }

    /**
     * Called when the user wishes to log-in to the server.
     * WARNING: This is not secure and only intended for testing!
     */
    onLogin(data) {
        if (this.player) {
            // Player is already logged in, notify client login failed
            return;
        }

        // Find database entry for player, determine if password matches
        console.log('login');
    }
}

module.exports = Connection;