pc.script.attribute('camera', 'entity', null, {
    displayName: 'Camera',
    description: 'Entity that represents the players camera, used to determine where the user is pointing within the scene.'
});
pc.script.attribute('cardTemplate', 'entity', null, {
    displayName: 'Card Template',
    description: 'Entity that defines the implementation of a card on the gameboard.'
});

pc.script.attribute('cardPreview', 'entity', null, {
    displayName: 'Card Preview',
    description: 'Entity that will manage the display of the card preview, which displays a larger version of the highlighted card. Allows the user to easily read the card abilities.'
});
pc.script.attribute('cardPlacement', 'entity', null, {
    displayName: 'Card Placement',
    description: 'The entity that will manage the card placement onto the game board.'
});
pc.script.attribute('maxCards', 'number', 7, {
    min: 0,
    max: 7,
    step: 1,
    decimalPrecision: 0,
    displayName: 'Maximum Cards',
    description: 'The maximum number of cards the player may hold in their hand at one time.'
});
pc.script.attribute('fan', 'number', 20, {
    min: 0,
    max: 90,
    step: 1,
    decimalPrecision: 2,
    displayName: 'Card Fan',
    description: 'The angle range of the cards in the players hand from center to outer area.'
});
pc.script.attribute('handWidth', 'number', 5, {
    min: 1,
    max: 10,
    step: 1,
    decimalPrecision: 2,
    displayName: 'Hand Width',
    description: 'The width of the area consumed by the players hand on the display, in world units.'
});
pc.script.attribute('cardPush', 'number', 3, {
    min: 0,
    max: 10,
    step: 0.5,
    decimalPrecision: 2,
    displayName: 'Card Push',
    description: 'The distance a card will be \'pushed out\' when the user has it highlighted.'
});
pc.script.attribute('testCards', 'number', 7, {
    min: 0,
    max: 7,
    step: 1,
    decimalPrecision: 0,
    displayName: 'Test Cards',
    description: 'Number of cards to fill the hand with, this value is only used during testing.'
});

pc.script.create('player_hand', function (app) {
    var CARD_STATE = {
        COLLECT:            0,
        IDLE:               1,
        HIGHLIGHT:          2,
        ACTIVE:             3,
        RETURN:             4,
        PLACEMENT:          5,
        PLACING:            6,
        PLACEMENT_RETURN:   7
    };

    var COLLECT_SPEED    = 0.5;
    var HIGHLIGHT_SPEED  = 0.25;

    var Y_DELTA          = 0.01;

    blendFunc = function(t) {
        return t*t * (3.0 - 2.0 * t);
    };

    var CARD_TEXTURES = [
        'netrunner_aggressive_secretary.png',
        'netrunner_atman.png',
        'netrunner_beta_test.png',
        'netrunner_bodysuit.png',
        'netrunner_director_haas.png',
        'netrunner_femme_fatale.png',
        'netrunner_frame_job.png',
        'netrunner_femme_fatale.png',
        'netrunner_hostage.png',
        'netrunner_incubator.png',
        'netrunner_retirement.png',
        'netrunner_scavenge.png',
        'netrunner_singularity.png',
        'netrunner_snare.png',
        'netrunner_transaction.png'
    ];

    // Creates a new Player_hand instance
    var Player_hand = function (entity) {
        this.entity = entity;
        this.cards = [];
        this.activeCard = null;
        this.timer = 0;
        this.touching = false;
        this.template = null;
        this.testCard = null;
        this.mouseItem = null;
        this.materialProvider = null;

        app.enableFullscreen();

        app.mouse.disableContextMenu();

        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

        // TEMPORARY - Used to test touch events on PC
        // app.mouse.on(pc.EVENT_MOUSEMOVE, this.onTouchMove, this);
        // app.mouse.on(pc.EVENT_MOUSEDOWN, this.onTouchStart, this);
        // app.mouse.on(pc.EVENT_MOUSEUP, this.onTouchEnd, this);

        if (app.touch) {
            app.touch.on("touchstart", this.onTouchStart, this);
            app.touch.on("touchmove", this.onTouchMove, this);
            app.touch.on("touchend", this.onTouchEnd, this);
        }
    };

    Player_hand.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.materialProvider = app.root.getChildren()[0].script.material_provider;

            this.cardView = this.cardTemplate.clone();
            this.entity.addChild(this.cardView);

            for ( var loop = 0; loop < this.testCards; ++loop ) {
                var newCard = this.cardTemplate.clone();
                this.entity.addChild(newCard);
                this.addCard(newCard);
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            for ( var loop = 0; loop < this.cards.length; ++loop ) {
                this.updateCard(dt, this.cards[loop]);
            }

            this.updateCardPositions();

            //this.updateTest(dt);
        },

        /**
         * Called by PlayCanvas when the user moves the mouse cursor within the game display.
         **/
        onMouseMove: function(e) {
            if (this.cardPlacement && this.cardPlacement.script.card_placement.isActive()) {
                return;
            }

            this.activateCardAtPosition(e.x, e.y);
        },

        /**
         * Called by PlayCanvas when the user presses a mouse button within the game display.
         **/
        onMouseDown: function(e) {
            this.beginCardPlacement(e.x, e.y);
        },

        /**
         * Called by PlayCanvas when the user releases a mouse button within the game display.
         **/
        onMouseUp: function(e) {
            // TODO: Play selected card, if appropriate
        },

        /**
         * Called by PlayCanvas when the user begins a touch event interaction.
         **/
        onTouchStart: function(e) {
            this.touching = true;

            if (this.cardPlacement && this.cardPlacement.script.card_placement.isActive()) {
                // TODO: Cancel placement?
            } else {
                this.activateCardAtPosition(e.x, e.y);
            }
        },

        /**
         * Called by PlayCanvas when the user ends a touch event interaction.
         **/
        onTouchEnd: function(e) {
            this.touching = false;
        },

        /**
         * Called by PlayCanvas when the user performs a move operation using touch.
         **/
        onTouchMove: function(e) {
            if (this.touching) {
                if (this.cardPlacement && this.cardPlacement.script.card_placement.isActive()) {
                    // No need to do anything, card-placement script will handle it.
                    return;
                }

                this.beginCardPlacement(e.x, e.y);
            }
        },

        /**
         * Given a screen location this function determines if a card lies beneath it.
         * If so, the card becomes the 'active' card in the view.
         **/
        activateCardAtPosition: function(x, y) {
            if (!(this.activeCard && this.activeCard.state === CARD_STATE.HIGHLIGHT)) {
                var self = this;

                this.findCard(x, y, function(entity) {
                    for ( var loop = 0; loop < self.cards.length; ++loop ) {
                        if (self.cards[loop].entity === entity) {
                            self.setActiveCard(self.cards[loop]);
                            return;
                        }
                    }

                    self.setActiveCard(null);
                });
            }
        },

        /**
         * Given a card within the players hand, this method makes it 'active'. The
         * active card is displayed to the user in a large preview to allow them to
         * easily read the cards information.
         * If null is specified then the currently active card is deactivated.
         **/
        setActiveCard: function(cardInfo) {
            if (cardInfo !== this.activeCard) {
                if (this.activeCard) {
                    this.activeCard.timer = 0.0;
                    this.activeCard.state = CARD_STATE.RETURN;
                }

                // Switch card to 'highlighted'
                this.activeCard = cardInfo;

                if (cardInfo) {
                    cardInfo.timer = 0.0;
                    cardInfo.state = CARD_STATE.HIGHLIGHT;

                    if (this.cardPreview) {
                        this.cardPreview.script.card_preview.setActiveCard(cardInfo.entity, cardInfo.texture);
                    }
                } else {
                    if (this.cardPreview) {
                        this.cardPreview.script.card_preview.setActiveCard(null, null);
                    }
                }

            }
        },

        /**
         * If there's currently an 'active' card. This function moves it into the
         * placement module for movement around the game area. It's start position
         * will be centered around the supplied screen location.
         * @param x {Number} Position along the horizontal axis of the input cursor.
         * @param y {Number} Position along the vertical axis of the input cursor.
         * @returns {Boolean} <em>True</em> if card placement began successfully otherwise <em>false</em>.
         **/
        beginCardPlacement: function(x, y) {
            if (this.cardPlacement && this.activeCard) {
                var cardInfo = this.activeCard;

                this.setActiveCard(null);

                cardInfo.timer = 0.0;
                cardInfo.dz = 1.0;
                cardInfo.rot = 0.0;
                cardInfo.slotSize = 1.0;
                cardInfo.state = CARD_STATE.PLACEMENT;
                cardInfo.entity.script.card.fadeIn(0);
                cardInfo.entity.enabled = false;

                this.cardPlacement.script.card_placement.setActiveCard(this, cardInfo);
                this.cardPlacement.script.card_placement.setPositionFromScreen(x, y);

                return true;
            }

            return false;
        },

        /**
         * Determines which card (if any) lies beneath the specified screen coordinates.
         * If a card is found, the supplied callback is invoked.
         **/
        findCard: function(x, y, callback) {
            var from = this.camera.camera.screenToWorld(x, y, this.camera.camera.nearClip);
            var to = this.camera.camera.screenToWorld(x, y, this.camera.camera.farClip);

            app.systems.rigidbody.raycastFirst(from, to, function (result) {
                callback(result.entity);
            });

            return null;
        },

        /**
         * Computes the position of each card in the playrs hand.
         **/
        updateCardPositions: function() {
            var self = this;

            var totalSize = 0.0;

            this.cards.forEach( function(item) {
                totalSize += item.slotSize;
            });

            var xStep = this.handWidth / this.maxCards;
            var aStep = ( this.fan * 2 ) / this.maxCards;
            var yStep = Y_DELTA / this.maxCards;    // Avoid z fighting

            var handWidth = this.handWidth * (totalSize/this.maxCards);
            var fan = this.fan * (totalSize/this.maxCards);

            // Apply rotation and position to child objects
            var x = -xStep * (totalSize / 2);// + (xStep*0.5);
            var angle = aStep * (totalSize / 2) - (aStep*0.5);
            var y = 0.0;

            this.cards.forEach( function(item) {
                var itemAngle = angle;// * item.rot;

                var dx = Math.cos((-90 + itemAngle) * (Math.PI / 180));
                var dz = Math.sin((-90 + itemAngle) * (Math.PI / 180));
                //var dz = Math.sin(itemAngle * (Math.PI / 180));

                item.entity.setLocalPosition(x + dx*self.cardPush, y, dz*(self.cardPush+item.dz*0.2));
                item.entity.setLocalEulerAngles(180.0, itemAngle, 0.0);

                x += item.slotSize * xStep;
                angle -= item.slotSize * aStep;
                y += item.slotSize * yStep;
            });
        },

        updateTest: function(dt) {
            this.timer += dt;

            var t = Math.sin(this.timer * 6);

            var a = -45 * t;    // 45 degrees, [-1,+1] = 90 degrees
            var x = 2 * t;     // 2 units, [-1,+1] = 4 units

            var dx = 0.0;
            var dz = Math.sin((-90 + a ) * ( Math.PI / 180 ) );

            this.testCard.setPosition(x+dx,0,dz);
            this.testCard.setLocalEulerAngles(0.0, a, 0.0);
        },

        /**
         * Manages the state of each card within the players hand.
         * Little bit messy like this, should be moved into the card
         * script, and have events/triggers control its own state.
         **/
        updateCard: function(dt, card) {
            card.timer += dt;

            // TODO: Maybe move this into the 'card' script instead
            switch ( card.state ) {
                case CARD_STATE.COLLECT:
                    if ( card.timer >= COLLECT_SPEED ) {
                        card.timer = 0.0;
                        card.dz = 0.0;
                        card.rot = 1.0;
                        card.state = CARD_STATE.IDLE;
                    } else {
                        // Animate position of card
                    }
                    break;

                case CARD_STATE.ACTIVE:
                    card.dz = 1.0;
                    card.rot = 0.0;
                    card.slotSize = 1.5;
                    break;

                case CARD_STATE.IDLE:
                    break;

                case CARD_STATE.RETURN:
                    if (card.timer >= HIGHLIGHT_SPEED) {
                        card.timer = 0.0;
                        card.dz = 0;
                        card.rot = 1.0;
                        card.state = CARD_STATE.IDLE;
                    } else {
                        card.dz = blendFunc(1.0 - card.timer / HIGHLIGHT_SPEED);
                        card.rot = 1.0 - card.dz;
                        card.slotSize = 1 + (card.dz*0.5);
                    }
                    break;

                case CARD_STATE.HIGHLIGHT:
                    if (card.timer >= HIGHLIGHT_SPEED) {
                        card.timer = 0.0;
                        card.dz = 1;
                        card.rot = 0.0;
                        card.state = CARD_STATE.ACTIVE;
                    } else {
                        card.dz = blendFunc(card.timer / HIGHLIGHT_SPEED);
                        card.rot = 1.0 - card.dz;
                        card.slotSize = 1 + (card.dz*0.5);
                    }
                    break;

                case CARD_STATE.PLACEMENT:
                    if (card.timer >= HIGHLIGHT_SPEED) {
                        card.timer = 0.0;
                        card.dz = 1.0;
                        card.rot = 0.0;
                        card.slotSize = 0.0;
                        card.state = CARD_STATE.PLACING;
                    } else {
                        card.dz = blendFunc(card.timer / HIGHLIGHT_SPEED);
                        card.rot = 1.0 - card.dz;
                        card.slotSize = 1.5 - (card.dz*1.5);
                    }
                    break;

                case CARD_STATE.PLACING:
                    card.dz = 0.0;
                    card.rot = 0.0;
                    card.slotSize = 0.0;
                    break;

                case CARD_STATE.PLACEMENT_RETURN:
                    if (card.timer >= HIGHLIGHT_SPEED) {
                        card.timer = 0.0;
                        card.dz = 0;
                        card.rot = 1.0;
                        card.slotSize = 1.0;
                        card.state = CARD_STATE.IDLE;
                        card.entity.enabled = true;
                        //card.entity.model.model.meshInstances[0].material.setParameter('uTransparency', 1.0);
                    } else {
                        var blend = blendFunc(card.timer / HIGHLIGHT_SPEED);

                        card.entity.enabled = true;
                        card.dz = 0.0;
                        card.rot = blend;
                        card.slotSize = blend;
                        //card.entity.model.model.meshInstances[0].material.setParameter('uTransparency', blend);
                    }
                    break;
            }
        },

        /**
         * Removes a card from the players hand.
         * @param cardInfo {CardInfo} Description of the card as represented within the players hand.
         **/
        removeCard: function(cardInfo) {
            var count = this.cards.length;

            for ( var loop = 0; loop < count; ++loop ) {
                if (this.cards[loop] === cardInfo) {
                    this.entity.removeChild(cardInfo.entity);
                    this.cards.splice(loop, 1);
                    console.log('card removed');
                    return;
                }
            }

            console.log('Cannot remove card from hand, could not be located.');
        },

        addCard: function(entity) {
            // Replace the material on the model with our new material
            var textureIndex = Math.floor(Math.random() * CARD_TEXTURES.length);

            // TODO: Get card-back texture from player information
            // TODO: Should not be calling the private method, instead call getMaterial (once we have a card-description object).
            var material = this.materialProvider._createCardMaterial("netrunner_cardback.jpeg", CARD_TEXTURES[textureIndex]);

            entity.model.model.meshInstances[0].material = material;
            entity.enabled = true;

            entity.script.card.slotIndex = this.cards.length;

            this.cards.push({
                entity: entity,
                texture: entity.model.model.meshInstances[0].material.getParameter('uCardFront').data[0],
                state: CARD_STATE.COLLECT,
                timer: 0,
                dz: 0,
                rot: 1.0,
                slotSize: 1        // Used for animation
            });
        }
    };

    return Player_hand;
});