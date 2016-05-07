'use strict';

const express = require('express');
const http = require('http');
const io = require('socket.io');

const DEFAULT_PORT = 2000;

/**
 * Represents the core game server that manages all users and session in progress.
 * This implementation is not intended for heavy load-use, but only during development
 * when there are not many users.
 */
class GameServer {
    constructor() {
        this.io = null;
        this.app = null;
        this.http = null;
        this.port = DEFAULT_PORT;
        this.connections = [];
    }

    /**
     * Starts the game server on the specified port.
     * @param port {Number} The port number the server will listen on, if this is not specified the default will be used.
     */
    run(port) {
        this.port = port || DEFAULT_PORT;

        const self = this;

        this.app = express();
        this.http = http.Server(this.app);
        this.io = io(this.http);

        this.io.on('connection', this.onConnection.bind(this));

        this.app.get('/page', function(req, res) {
            var x = req.query.N1;
            console.log('x = ' + x);
        });

        this.http.listen(this.port, function() {
            console.log('Game Server listening on port ' + self.port);
        });
    }

    /**
     * Called by socket.io when a new real-time connection is made to the server.
     * @param socket {Socket} The socket that has connected to the server.
     */
    onConnection(socket) {
        console.log('client connected.');

        socket.on('disconnect', function() {
            // TODO: Disconnect handling goes here
            console.log('client disconnected.');
        });
    }
}

module.exports = GameServer;
