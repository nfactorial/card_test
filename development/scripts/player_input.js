pc.script.create('player_input', function (app) {
    var INPUT_STATE = {
        IDLE:        0,
        PLACING:     1
    };

    // Creates a new Player_input instance
    var PlayerInput = function (entity) {
        this.entity = entity;
        this.state = INPUT_STATE.IDLE;
        this.playerHand = null;    // TODO: Make attribute
        this.controller = null;
    };

    PlayerInput.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
            app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
            app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

            // TODO: Should these events be unregistered? Seems that JavaScript wouldn't do that automatically
            if (app.touch) {
                app.touch.on("touchstart", this.onTouchStart, this);
                app.touch.on("touchmove", this.onTouchMove, this);
                app.touch.on("touchend", this.onTouchEnd, this);
            }
        },

        /**
         * Called every frame, dt is time in seconds since last update
         * @param dt {Number} Time (in seconds) since the last update.
         **/
        update: function (dt) {
            switch (this.state) {
                case INPUT_STATE.IDLE:
                    this.onUpdateIdle(dt);
                    break;

                case INPUT_STATE.PLACING:
                    this.onUpdatePlacing(dt);
                    break;

                default:
                    console.log('PlayerInput - Unknown state ' + this.state + '.');
                    break;
            }
        },

        onUpdateIdle: function(dt) {
            //
        },

        onUpdatePlacing: function(dt) {
            //
        },

        /**
         * Called in response to the user moving the mouse around the game area.
         * @param e {Event} Description of the mouse move event.
         **/
        onMouseMove: function(e) {
            if (this.controller) {
                this.controller.onMouseMove(e);
            }
        },

        /**
         * Called when the user presses a mouse button within the game area.
         * @param e {Event} Description of the mouse down event.
         **/
        onMouseDown: function(e) {
            if (this.controller) {
                this.controller.onMouseDown(e);
            }
        },

        /**
         * Called when the user releases a mouse button within the game area.
         * @param e {Event} Description of the mouse up event.
         **/
        onMouseUp: function(e) {
            if (this.controller) {
                this.controller.onMouseUp(e);
            }
        },

        onTouchStart: function(e) {
            if (this.controller) {
                this.controller.onTouchStart(e);
            }
        },

        onTouchEnd: function(e) {
            if (this.controller) {
                this.controller.onTouchEnd(e);
            }
        },

        onTouchMove: function(e) {
            if (this.controller) {
                this.controller.onTouchMove(e);
            }
        }
    };

    return PlayerInput;
});