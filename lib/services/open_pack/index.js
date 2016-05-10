/**
 * The number of milliseconds the OpenPackService will enforce before opening a pack.
 * This is used to simulate communication with an external micro-service.
 * @type {number}
 */
const DEFAULT_DELAY       = 3 * 1000;
const DEFAULT_TIMEOUT     = 10 * 1000;

const OPEN_PACK_TAG       = 'OPEN_PACK';

const PACK_SIZE           = 5;  // Number of cards in each pack


/**
 * This service provides functionality for opening card packs.
 *
 * Services will generally be run on an external server rather than within
 * the main server code-base. This will allow for load-balancing when many
 * users are active in the service.
 *
 * For now, the code is within the core libary code but it should be
 * extracted into its own micro-service library for production environments.
 */
class OpenPackService {
    constructor() {
        this.delay = DEFAULT_DELAY;
    }

    /**
     * Attempts to open a card pack for a specified player.
     *
     * This method is asynchronous and may take an indeterminate amount of time.
     *
     * @param player {Player} The player who wishes to open a pack.
     * @param cb {function} Callback to be invoked when the pack has been opened.
     */
    openPack(player, cb) {
        if (!player) {
            throw 'OpenPackService.openPack - Method invoked without a player object.';
        }

        if (!cb) {
            throw 'OpenPackService.openPack - Method invoked without a callback.';
        }

        const timeout = setTimeout(function() {
            const tag = player.removeTag(OPEN_PACK_TAG);
            if (tag && player.account) {
                if(player.account.packsAvailable > 0) {
                    player.account.packsAvailable--;
                    player.account.openedPacks++;

                    // TODO: Generate cards in opened pack

                    cb(null, {cards: PACK_SIZE});   // TODO: Supply list of cards
                } else {
                    cb('NoPacksAvailable');
                }
            } else {
                cb('OperatonTimedOut');
            }
        }, this.delay);

        if (!player.addTag(OPEN_PACK_TAG, Date.now(), DEFAULT_TIMEOUT)) {
            clearTimeout(timeout);
        }
    }
}

module.exports = OpenPackService;
