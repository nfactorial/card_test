/**
 * An account manages a users access privileges and purchases within the title.
 */
class Account {
    constructor() {
        this.packsAvailable = 0;
        this.purchasedPacks = 0;
        this.openedPacks = 0;
    }
}

module.exports = Account;
