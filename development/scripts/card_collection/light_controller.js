pc.script.attribute('speed', 'number', 1);

pc.script.create('light_controller', function (app) {
    // Creates a new Spotlight instance
    var LightController = function (entity) {
        this.entity = entity;
        this.timer = 0;
        this.rotation = new pc.Vec3();
    };

    LightController.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.rotation.set(0,0,0);

            this.rotation = 0;
            this.timer = 0.0;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.timer += dt;

            this.rotation.y += dt * 180;
            this.entity.setLocalEulerAngles(this.rotation);
        }
    };

    return LightController;
});