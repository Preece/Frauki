var Frogland = new Phaser.State();

Frogland.preload = function() {
	
    game.load.atlasJSONHash('Frauki', '../Data/Frauki/Frauki.png', '../Data/Frauki/Frauki.json');
    game.load.tilemap('Frogland', '../Data/Locations/Frogland/Frogland.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('Frogland', '../Data/Locations/Frogland/Frogland.png');
    game.load.image('Background', '../Data/Locations/Frogland/Sky.png');
    game.load.image('parallax1', '../Data/Locations/Frogland/Parallax1.png');
    game.load.image('parallax2', '../Data/Locations/Frogland/Parallax2.png');
}

var map;
var tileset;
var layer;
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var parallax1, parallax2;

Frogland.create = function() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 320, 240, 'Background');
    bg.fixedToCamera = true;

    parallaxLayer1 = game.add.tileSprite(0, 0, 320, 240, "parallax1");
    parallaxLayer1.fixedToCamera = true;

    parallaxLayer2 = game.add.tileSprite(0, 0, 320, 240, "parallax2");
    parallaxLayer2.fixedToCamera = true;

    map = game.add.tilemap('Frogland');

    map.addTilesetImage('Frogland');

    map.setCollisionByExclusion([82, 83, 84, 87, 88, 89, 149, 127, 129, 108, 147, 109, 103, 104, 183, 184, 128, 107]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 500;

    frauki = new Player(game, 0, 0, 'Frauki');
    game.add.existing(frauki);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

Frogland.update = function() {
	game.physics.arcade.collide(frauki, layer);

    frauki.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        frauki.body.velocity.x = -250;

        frauki.SetDirection('left');
    }
    else if (cursors.right.isDown)
    {
        frauki.body.velocity.x = 250;

        frauki.SetDirection('right');
    }
    
    if (jumpButton.isDown && frauki.body.onFloor() && game.time.now > jumpTimer)
    {
        frauki.body.velocity.y = -500;
        jumpTimer = game.time.now + 750;
    }
}

Frogland.render = function() {
    /*var stateName = (function functionName(fun) {
        var ret = fun.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    })(frauki.state);

    game.debug.text(stateName, 0, 30);*/
}