const GameStates = require('../game_states');

const MULLIGAN_TIME     = 60;

/**
 * Handles the session whilst the players are currently performing their
 * initial mulligan.
 */
class MulliganState {
    constructor() {
        this.timer = 0;
        this.session = null;
    }

    /**
     * Prepares the game state for use by the session.
     * @param initArgs
     */
    initialize(initArgs) {
        this.session = initArgs.session;

        // TODO: Bind to mulligan events
    }

    /**
     * Called during each update for any necessary processing.
     * 
     * @param updateArgs {UpdateArgs}
     */
    update(updateArgs) {
        this.timer += updateArgs.deltaTime;

        if (this.timer >= MULLIGAN_TIME) {
            // TODO: Assign cards to player hand
            // TODO: Notify clients mulligan has finished

            updateArgs.changeState(GameStates.GAME_PLAY);
        }
    }
}

module.exports = MulliganState;
