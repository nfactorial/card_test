/**
 * Object that contains variables that describe a single
 * update step within an active session.
 */
class UpdateArgs {
    constructor(session) {
        this.session = session;
        this.deltaTime = 0;
    }

    changeState(stateId) {
        //
    }
}

module.exports = UpdateArgs;
