pc.script.attribute('phase', 'number', 0);
pc.script.attribute('speed', 'number', 1);
pc.script.attribute('spread', 'number', Math.PI / 32);

pc.script.create('spotlight', function (app) {
    // Creates a new Spotlight instance
    var Spotlight = function (entity) {
        this.entity = entity;
        this.rotation = 0;
        this.timer = 0;
        this.target = new pc.Vec3(0,0,0);
        this.upVector = new pc.Vec3(0,1,0);
        this.position = new pc.Vec3(0,0,0);
        this.rootPosition = new pc.Vec3(0,0,0);
    };

    Spotlight.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.rotation = 0;
            this.timer = 0.0;
            this.rootPosition.set(this.entity.getLocalPosition().x, this.entity.getLocalPosition().y, this.entity.getLocalPosition().z);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.timer += dt;

            var a = (this.phase+this.timer)*this.speed;

            var ta = Math.sin(a) * this.spread;
            this.entity.rotate(ta, 0, 0);

            var t = Math.sin(a) * this.spread * 8;
            this.entity.setLocalPosition(this.rootPosition.x + t, this.rootPosition.y, this.rootPosition.z);

            /*var distance = 3;
             this.position.x = Math.cos(a)*distance;
             this.position.y = Math.abs(Math.sin(a)*distance);
             this.position.z = 0.0;
             this.entity.setPosition(this.position);
             //this.entity.setPosition(Math.cos(a)*distance, Math.sin(a)*distance, 0);
             this.entity.lookAt(this.target, this.upVector);
             */
        }
    };

    return Spotlight;
});