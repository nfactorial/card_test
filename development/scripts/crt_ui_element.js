pc.script.attribute('frequency', 'number', 64.0);
pc.script.attribute('phaseShift', 'number', 0.0);
pc.script.attribute('texture', 'asset', [], {
    displayName: 'Texture',
    type: 'texture'
});


pc.script.create('crt_ui_element', function (app) {
    var CrtUiElement = function(entity) {
        this.entity = entity;
        this.materialProvider = null;
        this.material = null;
        this.timer = 0.0;
    };

    CrtUiElement.prototype = {
        initialize: function () {
            this.materialProvider = app.root.getChildren()[0].script.material_provider;

            this.material = this.materialProvider._createCrtMaterial("play_button.png");
            //this.material.setParameter('uTransparency', 1.0);

            //this.entity.setLocalEulerAngles(180.0, 0.0, 0.0);
            this.entity.model.model.meshInstances[0].material = this.material;
        },

        update: function (dt) {
            this.timer += dt;

            this.material.setParameter('uPhaseShift', this.timer * 6);
        }
    };

    return CrtUiElement;
});
