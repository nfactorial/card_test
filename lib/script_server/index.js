'use strict';

var express = require('express');

const DEFAULT_PORT = 51000;

/**
 * Implements a simple server that supplies script files to the PlayCanvas client.
 * By default the server listens on port 51000 however, this can be changed by
 * passing the desired port number to the run method.
 *
 * To run the server, create an instance of the object and call the run() method.
 */
class ScriptServer {
    constructor() {
        this.port = DEFAULT_PORT;
        this.app = null;
    }
    
    run(appRoot, port) {
        if (!appRoot) {
            throw 'Cannot serve script files without an application root.';
        }

        var self = this;

        this.port = port || DEFAULT_PORT;

        this.app = express();
        this.app.use('/', express.static(appRoot + '/development'));

        this.app.listen(this.port, function() {
            console.log('Script server listening on port ' + self.port);
        });
    }
}

module.exports = ScriptServer;
