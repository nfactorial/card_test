var GAME_EVENTS = {
    CONNECTED: 'CONNECTED',     // Connection to server has been established
    DISCONNECT: 'DISCONNECT',   // Disconnected from server
    TURN_START: 'TURN_START',   // Players turn has begun
    TURN_HURRY: 'TURN_HURRY',   // Player has 15 seconds to finish their turn
    TURN_END: 'TURN_END'        // Players turn has ended
};


/**
 * The GameController object manages the state of the currently running game.
 * It also provides a central point for objects to subscribe to game related events.
 * @constructor
 */
var GameController = function() {
    if(!(this instanceof GameController)) {
        throw 'GameController called as function rather than constructor.';
    }

    this.listeners = {};
    this.server = null;
};

/**
 * Attempts to connect to the remote server.
 * @param url {String} Address of game server to connect to.
 */
GameController.prototype.connect = function(url) {
    if (!this.server) {
        // TODO: Take constructor function as parameter, to allow for mocking
        this.server = new ServerConnection( this, url );
    } else {
        console.log('WARN: GameController.connect - Method called multiple times.');
    }
};


/**
 * Attaches a callback to an event emitted by the GameController object.
 * @param event {String} The event which the callback is subscribing to.
 * @param callback {Function} The callback to be invoked in response to the event.
 * @param obj {Object} The object to which the callback belongs.
 */
GameController.prototype.subscribe = function(event, callback, obj) {
    if(!this.listeners[event]) {
        this.listeners[event] = [];
    }

    this.listeners[event].push({cb: callback, o: obj});
};

/**
 * Detaches a previously registered callback from the specified event.
 * @param event {String} The event from which the callback wishes to unsubscribe.
 * @param callback {Function} The callback which was previously registered.
 * @param obj {Object} The object which was previously registered.
 */
GameController.prototype.unsubscribe = function(event, callback, obj) {
    if(this.listeners[event]) {
        this.listeners = this.listeners.filter(function(item) {
            return (item.cb !== callback || item.o !== obj);
        });
    }
};

/**
 * Sends an event to all objects that are currently watching for it.
 * @param event {String} Name of the event to be emitted.
 * @param data {Object} Data associated with the event.
 */
GameController.prototype.emit = function(event, data) {
    if(this.listeners[event]) {
        this.listeners[event].forEach(function(e) {
            e.cb.call(e.o, data);
        });
    }
};

var CARD_GAME = new GameController();
