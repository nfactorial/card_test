var TurnController = function(gameController) {
    if(!(this instanceof TurnController)) {
        throw 'TurnController called as function rather than constructor.';
    }

    if(!gameController) {
        throw 'TurnController must be constructed with a valid game controller.';
    }

    this.gameController = gameController;
    this.activePlayer = null;
    this.timer = 0;
    this.duration = 60; // Number of seconds per-round
};

TurnController.prototype.update = function(dt) {
    // TODO: Turns are not actually timed on the client, the server will let us know
    this.timer += dt;
    if (this.timer >= this.duration) {
        this.end();
    }
};


TurnController.prototype.begin = function(player) {
    if(!player) {
        throw 'TurnController.begin - A valid player must be supplied.';
    }

    this.timer = 0;
    this.activePlayer = player;
};

TurnController.prototype.end = function() {
    this.timer = 0;
    this.activePlayer = null;

    this.gameController.emit(GAME_EVENTS.TURN_END);
};
