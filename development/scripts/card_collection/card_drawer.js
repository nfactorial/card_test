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
            }
        },

        updateSlideIn: function() {
            if(this.timer > this.speed) {
                this.state = DRAWER_STATE.IDLE;
                this.entity.setLocalPosition(0,0,0);
            } else {
                var t = blendFunc(this.timer / this.speed) * this.distance;
                this.entity.setLocalPositino(-this.distance + t, 0, 0);
            }
        },

        updateSlideOut: function() {
            if(this.timer > this.speed) {
                this.state = DRAWER_STATE.IDLE;
                this.entity.setLocalPosition(-this.distance,0,0);
            } else {
                var t = blendFunc(this.timer / this.speed) * this.distance;
                this.entity.setLocalPositino(-t, 0, 0);
            }
        },

        updateSlideDown: function() {
            //
        },

        onEnable: function() {
        },

        onDisable: function() {
        }
    };

    return CardDrawer;
});
