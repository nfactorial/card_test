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
    var CrtUiElement = function(entity) {
        this.entity = entity;
        this.materialProvider = null;
        this.material = null;
        this.timer = 0.0;
        this.min = new pc.Vec3();
        this.max = new pc.Vec3();
    };

    CrtUiElement.prototype = {
        initialize: function () {
            this.materialProvider = app.root.getChildren()[0].script.material_provider;

            //entity.model.model.meshInstances[0].material.getParameter('emissiveMap').data[0],

            this.material = this.materialProvider._createCrtMaterial("play_button.png");
            //this.material.setParameter('uTransparency', 1.0);

            //this.entity.setLocalEulerAngles(180.0, 0.0, 0.0);
            this.entity.model.model.meshInstances[0].material = this.material;
        },

        update: function (dt) {
            this.timer += dt;

            this.material.setParameter('uPhaseShift', this.timer * 6);
        },

        onEnable: function() {
            app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
            app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        },

        onDisable: function() {
            app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
            app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
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
            if ((e.clientX >= this.min.x) && (e.clientX <= this.max.x) &&
                (e.clientY >= this.max.y) && (e.clientY <= this.min.y)) {
                this.naterial.setParameter('uFrequency', 32.0);
            } else {
                this.material.setParameter('uFrequency', 190.0);
            }
        }
    };

    return CrtUiElement;
});
