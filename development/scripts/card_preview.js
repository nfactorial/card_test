pc.script.attribute('speed', 'number', 0.25);

pc.script.create('card_preview', function (app) {
    var PREVIEW_STATE = {
        IDLE:        0,
        SHOW:        1,
        REMOVE:      2
    };

    // Creates a new Card_preview instance
    var Card_preview = function (entity) {
        this.entity = entity;
        this.card = null;
        this.texture = null;
        this.timer = 0;
        this.state = PREVIEW_STATE.IDLE;
        this.baseScale = new pc.Vec3();
        this.material = null;
        this.materialProvider = null;
        this.baseScale.set(this.entity.getLocalScale().x, this.entity.getLocalScale().y, this.entity.getLocalScale().z);
    };

    Card_preview.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.materialProvider = app.root.getChildren()[0].script.material_provider;

            //this.baseScale.set(1, 0, 1.4);

            // TODO: Get card-back texture from player description
            this.material = this.materialProvider._createCardMaterial("netrunner_cardback.jpeg", "netrunner_cardback.jpeg");
            this.material.setParameter('uTransparency', 1.0);

            //this.entity.setLocalEulerAngles(0.0, 0.0, 0.0);
            this.entity.model.model.meshInstances[0].material = this.material;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.timer += dt;

            switch (this.state) {
                case PREVIEW_STATE.IDLE:
                    break;

                case PREVIEW_STATE.SHOW:
                    this.updateShow();
                    break;

                case PREVIEW_STATE.REMOVE:
                    this.updateRemove();
                    break;
            }
        },

        updateShow: function() {
            this.timer = Math.min(this.speed, this.timer);
            var t = this.timer / this.speed;

            var scale = 2*blendFunc(t);

            this.entity.setLocalScale(this.baseScale.x*scale, this.baseScale.y, this.baseScale.z*scale);
        },

        /**
         * Called each frame while the card is being removed from the display.
         **/
        updateRemove: function() {
            if (this.timer >= this.speed) {
                this.state = PREVIEW_STATE.IDLE;
                this.card = null;
                this.entity.enabled = false;
            } else {
                var t = this.timer / this.speed;
                var scale = 2 * (1.0 - blendFunc(t));

                this.entity.setLocalScale(this.baseScale.x*scale, this.baseScale.y, this.baseScale.z*scale);
            }
        },

        /**
         * Changes the card that we currently consider 'previewed'.
         **/
        setActiveCard: function(cardEntity, texture) {
            if (cardEntity != this.card) {
                if (cardEntity) {
                    this.entity.enabled = true;

                    this.material.setParameter('uCardBack', texture);
                    this.material.setParameter('uCardFront', texture);

                    switch (this.state) {
                        case PREVIEW_STATE.IDLE:
                            this.timer = 0.0;
                            this.state = PREVIEW_STATE.SHOW;
                            break;

                        case PREVIEW_STATE.SHOW:
                            break;

                        case PREVIEW_STATE.REMOVE:
                            this.timer = this.speed - this.timer;
                            this.state = PREVIEW_STATE.SHOW;
                            break;
                    }
                } else if (this.state === PREVIEW_STATE.SHOW) {
                    this.timer = 0.0;
                    this.state = PREVIEW_STATE.REMOVE;
                }

                this.card = cardEntity;
                this.texture = texture;
            }
        }
    };

    return Card_preview;
});