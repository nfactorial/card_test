pc.script.create('playmat', function (app) {
    var EPSILON = 0.00001;

    // Creates a new Playmat instance
    var Playmat = function (entity) {
        this.entity = entity;
        this.regionMap = {};
        this.regionList = [];
        this.origin = new pc.Vec3(0,0,0);
        this.normal = new pc.Vec3(0,1,0);
        this.direction = new pc.Vec3(0,0,0);
    };

    Playmat.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.preparePlaymat('basic_playmat');
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },

        /**
         * Determines which region a given ray is intersecting with in the game world.
         * @param rayOrigin {pc.Vec3} Vector containing the starting point of the ray in 3D space.
         * @param rayDirection {pc.Vec3} Vector containing the direction the ray is travelling in.
         * @returns {Region} The region which the ray intersects, if the ray does not intersect a region this method returns null.
         **/
        findHitRegion: function(rayOrigin, rayDirection) {
            var denom = this.normal.dot(rayDirection);
            if (Math.abs(denom) > EPSILON) {
                this.direction.set(this.origin.x - rayOrigin.x, this.origin.y - rayOrigin.y, this.origin.z - rayOrigin.z);

                var t = this.direction.dot(this.normal) / denom;
                if (t >= 0) {
                    var x = rayOrigin.x + rayDirection.x*t;
                    var z = rayOrigin.z + rayDirection.z*t;

                    return this.getRegionFromLocation(x,z);
                }
            }

            return null;
        },

        /**
         * Given a point on the playmat, this method determines which region contains it.
         **/
        getRegionFromLocation: function(x,z) {
            var count = this.regionList.length;

            for ( var loop = 0; loop < count; ++loop ) {
                var region = this.regionList[loop];
                console.log(region);
                if (x >= (region.position[0] - region.size[0]) && x < (region.position[0] + region.size[0])) {
                    if (z >= (region.position[1] - region.size[1]) && z < (region.position[1] + region.size[1])) {
                        return region;
                    }
                }
            }

            return null;
        },

        /**
         * Reads the playmats json definition and fills in the appropriate
         * data for the playmat to be used within the running game.
         **/
        preparePlaymat: function(assetName) {
            // TODO: Get asset from player definition
            var data = app.assets.find(assetName, 'json').resources[0];

            this.createRegions(data);
        },

        /**
         * Given the JSON description of the playmat, this method creates all
         * the region objects that are available on the playmats surface.
         **/
        createRegions: function(data) {
            if (data.regions) {
                var self = this;

                data.regions.forEach(function(item) {
                    var region = new PlaymatRegion(item);

                    self.regionMap[item.name] = region;
                    self.regionList.push(region);
                });
            } else {
                console.log('WARN - No regions found in playmat definition.');
            }
        }
    };

    return Playmat;
});