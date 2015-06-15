var Loading = new Phaser.State();

Loading.preload = function() {

    game.renderer.renderSession.roundPixels = true;

    game.canvas.style['display'] = 'none';
    pixel.canvas = Phaser.Canvas.create(game.width * pixel.scale, game.height * pixel.scale);
    pixel.context = pixel.canvas.getContext('2d');
    Phaser.Canvas.addToDOM(pixel.canvas);
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
    Phaser.Canvas.setImageRenderingCrisp(pixel.canvas);
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;

    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
    
    
    game.load.tilemap('Frogland', 'Data/World/Frogland.json', null, Phaser.Tilemap.TILED_JSON);

    //load images
    FileMap.Images.forEach(function(img) {
        game.load.image(img.Name, img.File);
    });

    //load atlases
    FileMap.Atlas.forEach(function(atlas) {
        game.load.atlasJSONHash(atlas.Name, atlas.Img, atlas.File);
    });

    //load audio
    FileMap.Audio.forEach(function(audio) {
        game.load.audio(audio.Name, audio.File);
    });
};

Loading.create = function() {

    game.add.plugin(Phaser.Plugin.Debug);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 800;

    game.time.desiredFps = 60;

    game.state.start('Main');
};