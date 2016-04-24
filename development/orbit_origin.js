pc.script.create('orbit_origin', function (app) {
    // Creates a new Orbit_origin instance
    var Orbit_origin = function (entity) {
        this.entity = entity;
        this.origin = new pc.Vec3(0,0,0);
        this.up = new pc.Vec3(0,1,0);
        this.d = 0;
        this.speed = 3;
        this.timer = 0;
        this.counter = 0;
    };

    Orbit_origin.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.distance = this.entity.getPosition().length;
            this.counter = 0;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.timer += dt;

            var x = Math.cos(this.timer * this.speed);
            var y = this.entity.getPosition().y;
            var z = Math.sin(this.timer * this.speed);

            if ( this.counter < 10 ) {
                this.counter++;
                console.log('distance = ' + this.d + ', x = ' + x + ', y = ' + y + ', z = ' + z );
            }

            this.entity.setPosition(x * this.d, y, z * this.d);
            this.entity.lookAt(this.origin, this.up);
        }
    };

    return Orbit_origin;
});