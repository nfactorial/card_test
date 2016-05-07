'use strict';

const http = require('http');
const sockjs = require('sockjs');
const Connection = require('../player/connection');

const DEFAULT_PORT = 2000;

/**
 * Represents the core game server that manages all users and session in progress.
 * This implementation is not intended for heavy load-use, but only during development
 * when there are not many users.
 */
class GameServer {
    constructor() {
        this.port = DEFAULT_PORT;
        this.server = null;
        this.socket = null;
        this.connections = [];
    }

    /**
     * Starts the game server on the specified port.
     * @param port {Number} The port number the server will listen on, if this is not specified the default will be used.
     */
    run(port) {
        this.port = port || DEFAULT_PORT;

        this.app = sockjs.createServer();

        this.app.on('connection', this.onConnection.bind(this));

        this.server = http.createServer();
        this.server.addListener('request', function(req, res) {
            res.end();
        });
        this.server.addListener('upgrade', function(req, res) {
            res.end();
        });
        this.app.installHandlers(this.server, {prefix: '/socket'});
        this.server.listen(this.port, '0.0.0.0');
    }

    /**
     * Called by socket.io when a new real-time connection is made to the server.
     * @param socket {Socket} The socket that has connected to the server.
     */
    onConnection(socket) {
        console.log('client connected.');

        const connection = new Connection(this, socket);
    }
}

module.exports = GameServer;
