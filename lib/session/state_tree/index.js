/**
 * Manages a tree graph of game states which represents the currently running session.
 * 
 */
class StateTree {
    constructor() {
        this.activeState = -1;
        this.states = [];
    }

    changeState(stateId) {
        this.pendingState = stateId;
    }
}

module.exports = StateTree;
