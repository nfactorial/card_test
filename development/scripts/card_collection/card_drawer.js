pc.script.attribute('speed', 'number', 2.0, {
    description: 'Time (in seconds) for drawer animation.'
});

pc.script.create('card_drawer', function (app) {
    var DRAWER_STATE = {
        IDLE: 'IDLE',
        SLIDE_IN: 'SLIDE_IN',
        SLIDE_DOWN: 'SLIDE_DOWN',
        SLIDE_OUT: 'SLIDE_OUT'
    };

    blendFunc = function(t) {
        return t*t * (3.0 - 2.0 * t);
    };

    var CardDrawer = function(entity) {
        this.entity = entity;
        this.timer = 0;
        this.state = DRAWER_STATE.IDLE;
        this.distance = 10.5;
        this.yPosition = 2;
        this.dropDistance = 2;
    };

    CardDrawer.prototype = {
        initialize: function () {
        },

        update: function (dt) {
            this.timer += dt;

            switch (this.state) {
                case DRAWER_STATE.IDLE:
                    break;

                case DRAWER_STATE.SLIDE_IN:
                    this.updateSlideIn();
                    break;

                case DRAWER_STATE.SLIDE_OUT:
                    this.updateSlideOut();
                    break;

                case DRAWER_STATE.SLIDE_DOWN:
                    this.updateSlideDown();
                    break;

                case DRAWER_STATE.SLIDE_UP:
                    this.updateSlideUp();
                    break;
            }
        },

        /**
         * Prepares the drawer to execute the 'slide-in' animation.
         * @returns {boolean} True if the animation was prepared successfully otherwise false.
         */
        beginSlideIn: function() {
            if(this.state !== DRAWER_STATE.IDLE) {
                return false;
            }

            this.entity.setPosition(-this.distance,this.yPosition,0);

            this.timer = 0.0;
            this.state = DRAWER_STATE.SLIDE_IN;

            return true;
        },

        /**
         * Prepares the drawer to execute the 'slide-out' animation.
         * @returns {boolean} True if the animation was prepared successfully otherwise false.
         */
        beginSlideOut: function() {
            if(this.state !== DRAWER_STATE.IDLE) {
                return false;
            }

            this.entity.setPosition(0,this.yPosition,0);

            this.timer = 0.0;
            this.state = DRAWER_STATE.SLIDE_OUT;

            return true;
        },

        /**
         * Prepares the drawer to execute the 'slide-down' animation.
         * @returns {boolean} True if the animation was prepared successfully otherwise false.
         */
        beginSlideDown: function() {
            if(this.state !== DRAWER_STATE.IDLE) {
                return false;
            }

            this.entity.setPosition(0,this.yPosition,0);

            this.timer = 0.0;
            this.state = DRAWER_STATE.SLIDE_DOWN;

            return true;
        },

        /**
         * Called each frame while the drawer is processing the 'slide-in' animation.
         */
        updateSlideIn: function() {
            if(this.timer > this.speed) {
                this.state = DRAWER_STATE.IDLE;
                this.entity.setLocalPosition(0,this.yPosition,0);
            } else {
                var t = blendFunc(this.timer / this.speed) * this.distance;
                this.entity.setLocalPosition(-this.distance + t, this.yPosition, 0);
            }
        },

        /**
         * Called each frame while the drawer is processing the 'slide-out' animation.
         */
        updateSlideOut: function() {
            if(this.timer > this.speed) {
                this.state = DRAWER_STATE.IDLE;
                this.entity.setLocalPosition(-this.distance,this.yPosition,0);
            } else {
                var t = blendFunc(this.timer / this.speed) * this.distance;
                this.entity.setLocalPosition(-t, this.yPosition, 0);
            }
        },

        /**
         * Called each frame while the drawer is processing the 'slide-down' animation.
         */
        updateSlideDown: function() {
            if(this.timer > this.speed) {
                this.state = DRAWER_STATE.IDLE;
                this.entity.setLocalPosition(0,this.yPosition - this.dropDistance,0);
            } else {
                var t = blendFunc(this.timer / this.speed) * this.dropDistance;
                this.entity.setLocalPosition(0, this.yPosition - t, 0);
            }
        },

        /**
         * Called each frame while the drawer is processing the 'slide-up' animation.
         */
        updateSlideUp: function() {
            if(this.timer > this.speed) {
                this.state = DRAWER_STATE.IDLE;
                this.entity.setLocalPosition(0,this.yPosition,0);
            } else {
                var t = blendFunc(this.timer / this.speed) * this.dropDistance;
                this.entity.setLocalPosition(0, this.dropDistance - t + this.yPosition , 0);
            }
        },

        onEnable: function() {
        },

        onDisable: function() {
        }
    };

    return CardDrawer;
});
