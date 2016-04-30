pc.script.attribute('frequency', 'number', 64.0);
pc.script.attribute('phaseShift', 'number', 0.0);
pc.script.attribute('camera', 'entity', null, {
    displayName: 'Camera',
    description: 'The camera through which the user interface is being viewed.'
});

pc.script.attribute('texture', 'asset', null, {
    displayName: 'Texture',
    type: 'texture'
});


pc.script.create('crt_ui_element', function (app) {
    var ElementState = {
        NORMAL: 0,
        HIGHLIGHT: 1,
        TO_HIGHLIGHT: 2,
        TO_NORMAL: 3
    };

    var CrtUiElement = function(entity) {
        this.entity = entity;
        this.materialProvider = null;
        this.material = null;
        this.timer = 0.0;
        this.transitionSpeed = 0.25;
        this.state = ElementState.NORMAL;
        this.min = new pc.Vec3();
        this.max = new pc.Vec3();
    };

    CrtUiElement.prototype = {
        initialize: function () {
            this.materialProvider = app.root.getChildren()[0].script.material_provider;

            //entity.model.model.meshInstances[0].material.getParameter('emissiveMap').data[0],

            this.material = this.materialProvider._createCrtMaterial("play_button.png");
            //this.material.setParameter('uTransparency', 1.0);

            //this.entity.setLocalEulerAngles(0.0, 0.0, 0.0);
            this.entity.model.model.meshInstances[0].material = this.material;
        },

        update: function (dt) {
            this.timer += dt;

            //this.updateState();
            //this.applyState();

/*
            switch (this.state) {
                case ElementState.NORMAL:
                    this.material.setParameter('uFrequency', 190.0);
                    this.material.setParameter('uPixelShift', 2.0);
                    this.material.setParameter('uAnimated', 1.0);
                    break;

                case ElementState.HIGHLIGHT:
                    this.material.setParameter('uFrequency', 190.0);
                    this.material.setParameter('uPixelShift', 32.0);
                    this.material.setParameter('uAnimated', 0.5);
                    break;

                case ElementState.TO_NORMAL:
                    if (this.timer >= this.transitionSpeed) {
                        this.setState(ElementState.NORMAL);
                    } else {
                        //
                    }
                    break;

                case ElementState.TO_HIGHLIGHT:
                    break;
            }
            */
            this.material.setParameter('uPhaseShift', this.timer * 6);
        },

        changeState: function(state) {
            if (this.state !== state) {
                this.state = state;
                this.timer = 0;
            }
        },

        onEnable: function() {
            app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
            app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
            app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        },

        onDisable: function() {
            app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
            app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
            app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        },

        onMouseDown: function(e) {
            //
        },

        onMouseUp: function(e) {
            //
        },

        onMouseMove: function(e) {
            var aabb = this.entity.model.model.meshInstances[0].aabb;

            this.camera.camera.worldToScreen(aabb.getMin(), this.min);
            this.camera.camera.worldToScreen(aabb.getMax(), this.max);

            if ((e.x >= this.min.x) && (e.x <= this.max.x) &&
                (e.y >= this.max.y) && (e.y <= this.min.y)) {
                this.material.setParameter('uFrequency', 190.0);
                this.material.setParameter('uPixelShift', 32.0);
                this.material.setParameter('uAnimated', 0.5);
            } else {
                this.material.setParameter('uFrequency', 190.0);
                this.material.setParameter('uPixelShift', 2.0);
                this.material.setParameter('uAnimated', 1.0);
            }
        }
    };

    return CrtUiElement;
});
