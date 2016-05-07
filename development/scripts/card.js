/**
 * This script manages the location and display of a card-entity on the game board.
 * Cards are generally displayed at their current location, however an animation
 * request to a desired location may also be specified. If an animation has been
 * specified the current location cannot be modified until the animation has
 * completed.
 * Cards also remember their slot position in a players hand until they have been
 * committed to the game board. This allows the application to easily return the
 * card to their owners hand if necessary.
 *
 * Because the rotations for a card are so simple, we're currently using euler
 * angles to represent them. However, if the orientations become more complicated
 * in the future. We can alter the representation to use quaternions.
 **/

pc.script.create( 'card', function( app ) {
    var DEFAULT_FLIP_HEIGHT = 1.5;        // Height of flip animation

    var CARD_STATE = {
        IDLE: 0,
        ANIMATE: 1,
        TELEPORT: 2
    };

    var FADE_STATE = {
        NONE: 0,
        IN: 1,
        OUT: 2
    };

    /**
     * Computes the linearly interpolated value of two numbers.
     * @param a {Number} The start position of the interpolation.
     * @param b {Number} The end position of the interpolation.
     * @param t {Number} The time position of the interpolation, where 0 returns a, 1 returns b. Otherwise the result of the interpolation.
     **/
    var lerp = function( a, b, t ) {
        return a + t * (b - a);
    };


    /**
     * Computes the value of a point on a bezier curve given the time position.
     * @param coeff {Array:Number} Array of coefficients for the bezier curve.
     * @param t {Number} Time index of the point to be computed.
     **/
    var computeBezier = function( coeff, t ) {
        var a = lerp( coeff[ 0 ], coeff[ 1 ], t );
        var b = lerp( coeff[ 1 ], coeff[ 2 ], t );
        var c = lerp( coeff[ 2 ], coeff[ 3 ], t );
        var d = lerp( a, b, t );
        var e = lerp( b, c, t );

        return lerp( d, e, t );
    };

    /**
     * This method performs a bezier quadratic blend, providing
     * ease-in-out animation.
     * @param t {Number} Interpolation value in the range [0...1].
     * @returns {Number} Quadratic interpolation value in the range [0...1]
     **/
    blendFunc = function( t ) {
        return t * t * (3.0 - 2.0 * t);
    };

    var Animations = {
        FLIP: "flip",
        EASE_INOUT: "easeinout"
    };

    // Creates a new Card instance
    var Card = function( entity ) {
        this.entity = entity;
        this.state = CARD_STATE.IDLE;
        this.fadeState = FADE_STATE.NONE;
        this.fadeTimer = 0.0;
        this.fadeDuration = 0.0;
        this.timer = 0;
        this.slotIndex = -1;                    // Slot we originally came from in players hand
        this.player = null;                     // Player entity we belong to
        this.animationTime = -1;                // Negative values mean no animation
        this.startPos = new pc.Vec3();          // Position card was at when animation started
        this.startEuler = new pc.Vec3();        // Euler rotation of card at start of animation
        this.endPos = new pc.Vec3();            // Desired location to be animated to
        this.endEuler = new pc.Vec3();          // Euler angles of desired orientation
        this.currentPos = new pc.Vec3();
        this.currentEuler = new pc.Vec3();

        // Coefficients for bezier cubic spline
        this.bezierX = [ 0, 0, 0, 0 ];
        this.bezierY = [ 0, 0, 0, 0 ];
        this.bezierZ = [ 0, 0, 0, 0 ];
    };

    Card.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function() {
        },

        // Called every frame, dt is time in seconds since last update
        update: function( dt ) {
            this.timer += dt;

            this.updateFade( dt );

            switch ( this.state ) {
                case CARD_STATE.IDLE:
                    break;

                case CARD_STATE.ANIMATE:
                    this.updateAnimation();
                    break;

                case CARD_STATE.TELEPORT:
                    this.updateTeleport();
                    break;
            }
        },

        /**
         * If the card is currently having its transparency animated, this method
         * performs any processing necessary for the animation.
         **/
        updateFade: function( dt ) {
            this.fadeTimer += dt;

            switch ( this.fadeState ) {
                case FADE_STATE.NONE:
                    break;

                case FADE_STATE.IN:
                    if ( this.fadeTimer >= this.fadeDuration ) {
                        this.fadeState = FADE_STATE.NONE;
                        this.entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', 1.0 );
                    } else {
                        this.entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', blendFunc( this.fadeTimer / this.fadeDuration ) );
                    }
                    break;

                case FADE_STATE.OUT:
                    if ( this.fadeTimer >= this.fadeDuration ) {
                        this.fadeState = FADE_STATE.NONE;
                        this.entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', 0.0 );
                    } else {
                        this.entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', 1.0 - blendFunc( this.fadeTimer / this.fadeDuration ) );
                    }
                    break;
            }
        },

        /**
         * Determines whether or not the card is currently performing an animation.
         * @returns {Boolean} <em>True</em> if the card is currently processing an animation otherwise <em>false</em>.
         **/
        isAnimating: function() {
            return (this.state !== CARD_STATE.IDLE);
        },

        /**
         * Called each frame, performs any processing necessary for the currently
         * active animation.
         **/
        updateAnimation: function() {
            if ( this.timer >= this.animationTime ) {
                this.entity.setLocalEulerAngles( this.endEuler );
                this.entity.setLocalPosition( this.endPos );
                this.animationTime = -1;

                // TODO: Raise 'AnimationEnd' event

                this.state = CARD_STATE.IDLE;
            } else {
                var t = blendFunc( this.timer / this.animationTime );
                var timeT = t;//this.timer / this.animationTime;
                //this.currentPos.lerp(this.startPos, this.endPos, t);
                this.currentEuler.lerp( this.startEuler, this.endEuler, t );

                this.currentPos.set( computeBezier( this.bezierX, timeT ), computeBezier( this.bezierY, timeT ), computeBezier( this.bezierZ, timeT ) );

                this.entity.setLocalEulerAngles( this.currentEuler );
                this.entity.setLocalPosition( this.currentPos );
            }
        },

        /**
         * Called each frame, performs any processing necessary for the currently
         * active teleport animation.
         **/
        updateTeleport: function() {
            if ( this.timer >= this.teleportTime ) {
                this.teleportTime = -1;

                entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', 1.0 );

                // TODO: Raise 'AnimationEnd' event

                this.state = CARD_STATE.IDLE;
            } else {
                var t;
                var halfTime = this.teleportTime / 2;

                if ( this.timer < halfTime ) {
                    t = blendFunc( this.timer / halfTime );

                    entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', 1.0 - t );
                } else {
                    t = blendFunc( (this.timer - halfTime) / halfTime );

                    this.entity.setLocalEulerAngles( this.endEuler );
                    this.entity.setLocalPosition( this.endPos );

                    entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', t );
                }
            }
        },

        /**
         * Alters the current animation target for the card.
         * @param time {Number} The duration (in seconds) the animation will take.
         * @param rotationX {Number} The desired rotation around the X axis.
         * @param rotationY {Number} The desired rotation around the Y axis.
         * @param rotationZ {Number} The desired rotation around the Z axis.
         * @param position {pc.Vec3} The desired world position for the card.
         * @param animationType {String} The type of animation to be performed.
         * @returns {Boolean} True if the animation target was set successfully otherwise false.
         **/
        setAnimation: function( time, rotationX, rotationY, rotationZ, position, animationType ) {
            if ( animationType === undefined ) {
                animationType = Animations.FLIP;
            }

            // TODO: Rename this to 'setFlipAnimation'?
            if ( this.state === CARD_STATE.IDLE ) {
                this.startPos.set( this.entity.getPosition().x, this.entity.getPosition().y, this.entity.getPosition().z );
                this.startEuler.set( this.entity.getLocalEulerAngles().x, this.entity.getLocalEulerAngles().y, this.entity.getLocalEulerAngles().z );

                this.endPos.set( position.x, position.y, position.z );
                this.endEuler.set( rotationX, rotationY, rotationZ );

                var dx = this.endPos.x - this.startPos.x;
                var dz = this.endPos.z - this.startPos.z;
                var dy = 0.0;
                var d = dx * dx + dz * dz;
                if ( d > 0.0001 ) {
                    dy = Math.sqrt( d );
                }

                switch ( animationType ) {
                    case Animations.FLIP:
                        this.createFlipAnimation( dy, DEFAULT_FLIP_HEIGHT );
                        break;

                    case Animations.EASE_INOUT:
                        this.createEaseInOutAnimation();
                        break;

                    default:
                        this.createEaseInOutAnimation();
                        console.log( 'Card.setAnimation - Unknown animation type \'' + animationType + '\' specified, using default.' );
                        break;
                }

                this.timer = 0;
                this.animationTime = time;

                this.state = CARD_STATE.ANIMATE;
                return true;
            }

            return false;
        },

        /**
         * Computes the bezier coefficients to perform a card 'flip' animation.
         * @param scale {Number} Scale factor applied to the flip height.
         * @param height {Number} Height of the flip. This will be scaled based on distance.
         **/
        createFlipAnimation: function( scale, height ) {
            this.bezierX[ 0 ] = this.startPos.x;
            this.bezierX[ 1 ] = this.startPos.x;
            this.bezierX[ 2 ] = this.startPos.x;
            this.bezierX[ 3 ] = this.endPos.x;

            this.bezierY[ 0 ] = this.startPos.y;
            this.bezierY[ 1 ] = this.startPos.y;
            this.bezierY[ 2 ] = this.startPos.y + scale * height;
            this.bezierY[ 3 ] = this.endPos.y;

            this.bezierZ[ 0 ] = this.startPos.z;
            this.bezierZ[ 1 ] = this.startPos.z;
            this.bezierZ[ 2 ] = this.startPos.z;
            this.bezierZ[ 3 ] = this.endPos.z;
        },

        /**
         * Computes the bezier coefficients to perform a movement with ease-in-out behaviour.
         **/
        createEaseInOutAnimation: function() {
            this.bezierX[ 0 ] = this.startPos.x;
            this.bezierX[ 1 ] = lerp( this.startPos.x, this.endPos.x, 0.42 );
            this.bezierX[ 2 ] = lerp( this.startPos.x, this.endPos.x, 0.58 );
            this.bezierX[ 3 ] = this.endPos.x;

            this.bezierY[ 0 ] = this.startPos.y;
            this.bezierY[ 1 ] = lerp( this.startPos.y, this.endPos.y, 0.42 );
            this.bezierY[ 2 ] = lerp( this.startPos.y, this.endPos.y, 0.58 );
            this.bezierY[ 3 ] = this.endPos.y;

            this.bezierZ[ 0 ] = this.startPos.z;
            this.bezierZ[ 1 ] = lerp( this.startPos.z, this.endPos.z, 0.42 );
            this.bezierZ[ 2 ] = lerp( this.startPos.z, this.endPos.z, 0.58 );
            this.bezierZ[ 3 ] = this.endPos.z;
        },

        /**
         * Alternative to animating the cards orientation and position. This method
         * causes the card to disappaear at its current location and re-appear
         * at the target location.
         * The animation time is split in half, such that the card fades out in
         * the original location for half the duration. The fades in at the target
         * location for the second half of the duration.
         *
         * @param time {Number} The duration (in seconds) the animation will take.
         * @param rotationY {Number} The desired rotation around the Y axis.
         * @param rotationZ {Number} The desired rotation around the Z axis.
         * @param positino {Vec3} The desired world position for the card.
         * @returns {Boolean} True if the teleport target was set successfully otherwise false.
         **/
        setTeleport: function( time, rotationY, rotationZ, position ) {
            if ( this.state === CARD_STATE.IDLE ) {
                this.endPos.set( position.x, position.y, position.z );
                this.endEuler.set( 0, rotationY, rotationZ );

                this.timer = 0;
                this.teleportTime = time;

                this.state = CARD_STATE.TELEPORT;
                return true;
            }

            return false;
        },

        /**
         * Requests the card to perform a fade-in animation. This causes the card to have
         * its opacity animated from 0 to 1.
         * @param time {Number} Time (in seconds) over which the animation is to be performed, if this value is 0 then the animation is immediate.
         **/
        fadeIn: function( time ) {
            if ( 0 === time ) {
                this.fadeState = FADE_STATE.NONE;
                this.fadeTimer = 0.0;
                this.entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', 1.0 );
            } else {
                var t;

                switch ( this.fadeState ) {
                    case FADE_STATE.NONE:
                        this.fadeTimer = 0.0;
                        this.entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', 0.0 );
                        break;

                    case FADE_STATE.IN:
                        // Remap current fade animation to new animation
                        t = this.fadeTimer / this.fadeDuration;
                        this.fadeTimer = time * t;
                        break;

                    case FADE_STATE.OUT:
                        // Remap fade-out animation to correct point within the fade-in animation.
                        t = 1.0 - this.fadeTimer / this.fadeDuration;
                        this.fadeTimer = time * t;
                        break;
                }

                this.fadeDuration = time;
                this.fadeState = FADE_STATE.IN;
            }
        },

        /**
         * Requests the card to perform a fade-out animation. This causes the card to have
         * its opacity animated from 1 to 0.
         * @param time {Number} Time (in seconds) over which the animation is to be performed, if this value is 0 then the animation is immediate.
         **/
        fadeOut: function( time ) {
            if ( 0 === time ) {
                this.fadeState = FADE_STATE.NONE;
                this.fadeTimer = 0.0;
                this.entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', 1.0 );
            } else {
                var t;

                switch ( this.fadeState ) {
                    case FADE_STATE.NONE:
                        this.fadeTimer = 0.0;
                        this.entity.model.model.meshInstances[ 0 ].material.setParameter( 'uTransparency', 0.0 );
                        break;

                    case FADE_STATE.IN:
                        // Remap current fade animation to new animation
                        t = this.fadeTimer / this.fadeDuration;
                        this.fadeTimer = time * t;
                        break;

                    case FADE_STATE.OUT:
                        // Remap fade-out animation to correct point within the fade-in animation.
                        t = 1.0 - this.fadeTimer / this.fadeDuration;
                        this.fadeTimer = time * t;
                        break;
                }

                this.fadeDuration = time;
                this.fadeState = FADE_STATE.IN;
            }
        }
    };

    return Card;
} );
