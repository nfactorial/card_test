pc.script.attribute('camera', 'entity', null);

pc.script.create('card_placement', function (app) {
    var EPSILON = 0.00001;

    // Creates a new Card_placement instance
    var Card_placement = function (entity) {
        this.entity = entity;
        this.origin = new pc.Vec3(0,0,0);
        this.normal = new pc.Vec3(0,1,0);
        this.d      = 0;
        this.direction = new pc.Vec3();
        this.touching = false;
        this.mouseAvailable = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cardInfo = null;
        this.playmat = null;
        this.playerHand = null;
        this.buttonPressed = false;
    };

    Card_placement.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);

            if (app.touch) {
                app.touch.on("touchstart", this.onTouchStart, this);
                app.touch.on("touchmove", this.onTouchMove, this);
                app.touch.on("touchend", this.onTouchEnd, this);
            }

            this.cardInfo = null;
            this.playerHand = null;
            this.playmat = app.root.getChildren()[0].script.playmat;

            this.origin = this.entity.getPosition();
            this.d = this.normal.dot(this.entity.getPosition());
        },

        /**
         * Sets the card image that we will use to display to the user.
         * @param playerHand {PlayerHand} Script from which the card has been activated.
         * @param cardInfo {CardInfo} Description of the card which is being placed.
         **/
        setActiveCard: function(playerHand, cardInfo) {
            if (cardInfo !== this.cardInfo) {
                if (cardInfo) {
                    this.entity.enabled = true;

                    this.cardInfo = cardInfo;
                    this.playerHand = playerHand;

                    this.buttonPressed = true;
                    this.entity.model.model.meshInstances[0].material = cardInfo.entity.model.model.meshInstances[0].material;
                } else {
                    this.cardInfo = null;
                    this.playerHand = null;
                    this.buttonPressed = false;
                    this.entity.enabled = false;
                }
            }
        },

        /**
         * Determines whether or not the card placement currently has a card to place.
         * @returns {Boolean} True if there is a card being placed otherwise false.
         **/
        isActive: function() {
            return (null !== this.cardInfo);
        },

        /**
         * Called every frame.
         * @param dt {Number} The time (in seconds) since the last update.
         */
        update: function (dt) {
            if (this.touching) {
                this.buttonPressed = true;
            } else if (!app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
                this.buttonPressed = false;
            }

            if (this.cardInfo && this.mouseAvailable) {
                this.setPositionFromScreen(this.mouseX, this.mouseY);
                this.mouseAvailable = false;
            }

            if (!this.buttonPressed && app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
                // Attempt to play the card, if the user is pointing at
                // an appropriate place on the mat.
                if (!this.playCard(this.mouseX, this.mouseY)) {
                    this.returnCard(null);
                }
            }
        },

        onMouseMove: function(e) {
            this.mouseX = e.x;
            this.mouseY = e.y;
            this.mouseAvailable = true;
        },

        onTouchStart: function(e) {
            this.touching = true;
        },

        onTouchEnd: function(e) {
            this.touching = false;
        },

        onTouchMove: function(e) {
            this.mouseX = e.x;
            this.mouseY = e.y;
            this.mouseAvailable = true;
        },

        /**
         * Given the screen coordinates where the card is to be played, this method determines
         * whether or not the action is valid and, if so, plays the card.
         * @param x {Number} Position along the horizontal axis where the card is to be played.
         * @param y {Number} Position along the vertical axis where the card is to be played.
         * @returns {Boolean} True if the card was played successfully otherwise false.
         **/
        playCard: function(x,y) {
            if (this.playmat) {
                var cameraPos = this.camera.getPosition();
                var rayDirection = this.camera.camera.screenToWorld(x, y, this.camera.camera.nearClip);

                rayDirection.x = rayDirection.x - cameraPos.x;
                rayDirection.y = rayDirection.y - cameraPos.y;
                rayDirection.z = rayDirection.z - cameraPos.z;
                rayDirection.normalize();

                var region = this.playmat.findHitRegion(cameraPos, rayDirection);
                if (region) {
                    if (region.addCard(this, this.cardInfo)) {
                        return true;
                    }
                }
            }

            return false;
        },

        removeCard: function(cardInfo) {
            this.playerHand.removeCard(this.cardInfo);

            app.root.addChild(this.cardInfo.entity);

            this.cardInfo.entity.enabled = true;
            this.cardInfo.entity.setPosition(this.entity.getPosition());
            this.cardInfo.entity.setEulerAngles(180,0,0);

            this.setActiveCard(null, null);
        },

        /**
         * This method returns the card being placed back to the players hand.
         **/
        returnCard: function() {
            console.log('returncard');
            if (this.cardInfo) {
                this.cardInfo.timer = 0.0;
                this.cardInfo.dz = 0.0;
                this.cardInfo.rot = 0.0;
                this.cardInfo.slotSize = 0.0;
                this.cardInfo.state = 7;        // WARN WARN - Should be a named constant
                this.cardInfo.entity.enabled = true;
                this.cardInfo.entity.script.card.fadeIn(1.0);     // WARN - Should not be a magic constant
                this.playerHand.updateCardPositions();
            }

            this.setActiveCard(null, null);
        },

        /**
         * Given the screen coordinates of the mouse cursor, this method moves the active card
         * so that it is centered on that position.
         * @param x {Number} Position along the horizontal axis where the card is to be located.
         * @param y {Number} Position along the vertical axis where the card is to be located.
         **/
        setPositionFromScreen: function(x,y) {
            var cameraPos = this.camera.getPosition();

            // Compute ray direction
            var rayDirection = this.camera.camera.screenToWorld(x, y, this.camera.camera.nearClip);

            rayDirection.x = rayDirection.x - cameraPos.x;
            rayDirection.y = rayDirection.y - cameraPos.y;
            rayDirection.z = rayDirection.z - cameraPos.z;
            rayDirection.normalize();

            var denom = this.normal.dot(rayDirection);
            if (Math.abs(denom) > EPSILON) {
                this.direction.set(this.origin.x - cameraPos.x, this.origin.y - cameraPos.y, this.origin.z - cameraPos.z);

                var t = this.direction.dot(this.normal) / denom;
                if (t >= 0) {
                    // TODO: If we have a card, also detect which zone on the play-mat
                    //       the mouse is hovering over, and apply any 'Available' animation
                    //       if the zone is appropriate for the card being held.

                    this.entity.setLocalEulerAngles(180,0,0);    // TODO: Based on movement speed, adjust the angle of the card
                    this.entity.setLocalPosition(cameraPos.x + rayDirection.x*t, cameraPos.y + rayDirection.y*t, cameraPos.z + rayDirection.z*t);
                }
            } else {
                // TODO: Hide card
            }
        }
    };

    return Card_placement;
});