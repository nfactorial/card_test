/**
 * This script is used to manage the materials for all the card in the game.
 * Eventually, cards will be constructed by individual parts (probably built offline).
 * For now, each card is represented by a single texture.
 **/
pc.script.create('material_provider', function (app) {
    var MaterialProvider = function (entity) {
        this.entity = entity;
        this.invalidMaterial = null;
    };

    MaterialProvider.prototype = {
        /**
         * Prepares the material provider for use by the application.
         **/
        initialize: function () {
            var vertexShader = app.assets.find('card_shader_vert', 'shader').resources;
            var fragmentShader = "precision " + app.graphicsDevice.precision + " float;\n";

            fragmentShader = fragmentShader + app.assets.find('card_shader_frag', 'shader').resources;

            var shaderDefinition = {
                attributes: {
                    aPosition: pc.gfx.SEMANTIC_POSITION,
                    aNormal: pc.gfx.SEMANTIC_NORMAL,
                    aUv0: pc.gfx.SEMANTIC_TEXCOORD0
                },
                vshader: vertexShader,
                fshader: fragmentShader
            };
            this.shader = new pc.gfx.Shader(app.graphicsDevice, shaderDefinition);
        },

        /**
         * Retrieves the material for the specified card.
         * @param cardBack {String} Name of the asset that contains the card back to be used.
         * @param cardDescription {CardDescription} Description of the card whose material is to be retrieved.
         * @returns {Material} Material for the specified card.
         **/
        getMaterial: function(cardBack, cardDescription) {
            // TODO: Store the materials inside a map, so that we don't have to create a material for the
            // same card twice.
            return this._createCardMaterial(cardBack, cardDescription.asset);
        },

        /**
         * Internal method that creates a material using the specified front and back textures.
         * @param cardBack {String} Name of the texture asset for the card back.
         * @param cardFront {String} Name of the texture asset for the card front.
         * @returns {Material} Material that may be used to represent the specified card.
         **/
        _createCardMaterial: function(cardBack, cardFront) {
            var material = new pc.Material();

            material.setShader(this.shader);
            material.blendType = pc.BLEND_NORMAL;

            var frontTexture = app.assets.find(cardFront, 'texture').resources;
            var backTexture = app.assets.find(cardBack, 'texture').resources;

            material.setParameter('uCardBack', backTexture);
            material.setParameter('uCardFront', frontTexture);
            material.setParameter('uTransparency', 1.0);

            return material;
        }
    };

    return MaterialProvider;
});
