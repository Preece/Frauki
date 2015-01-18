var Frogland = new Phaser.State();

Frogland.preload = function() {
	
    game.load.atlasJSONHash('Frauki', 'Data/Frauki/Frauki.png', 'Data/Frauki/Frauki.json');
    game.load.tilemap('Frogland', 'Data/Frogland/Frogland.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('FrogtownTiles', 'Data/Frogland/FrogtownTiles.png');
    game.load.image('DepthsTiles', 'Data/Frogland/DepthsTiles.png');
    game.load.image('Collision', 'Data/CollisionKey.png');
    game.load.image('Background', 'Data/Frogland/Sky.png');
    game.load.image('parallax1', 'Data/Frogland/Parallax1.png');
    game.load.image('parallax2', 'Data/Frogland/Parallax2.png');
    game.load.image('fluff', 'Data/Fluff.png');
    game.load.image('mace', 'Data/Weapons/Mace.png');

    game.load.image('RedParticles', 'Data/Hit Particles.png');
    game.load.image('YellowParticles', 'Data/Yellow Particles.png');
    game.load.image('Spore', 'Data/Enemies/Sporoid/spore.png');

    game.load.atlasJSONHash('EnemySprites', 'Data/Enemies/Enemies.png', 'Data/Enemies/Enemies.json');

    game.load.atlasJSONHash('Door', 'Data/Doors/Doors.png', 'Data/Doors/Doors.json');
    game.load.atlasJSONHash('Misc', 'Data/Misc/Misc.png', 'Data/Misc/Misc.json');
    game.load.atlasJSONHash('UI', 'Data/UI/UI.png', 'Data/UI/UI.json');

    game.load.audio('attack_1', 'Data/Sfx/attack1.wav');
}

var map;
var tileset;
var bg;
var parallax1, parallax2;
var cameraController;
var inputController;
var effectsController;
var energyController;
var audioController;
var weaponController;
var projectileController;
var frauki;
var fraukiSpawnX, fraukiSpawnY;

var energyText;

var playerX, playerY;

var previousCamX;


Frogland.create = function() {

    //game.add.plugin(Phaser.Plugin.Debug);

    game.canvas.style['display'] = 'none';
    pixel.canvas = Phaser.Canvas.create(game.width * pixel.scale, game.height * pixel.scale);
    pixel.context = pixel.canvas.getContext('2d');
    Phaser.Canvas.addToDOM(pixel.canvas);
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 800;

    game.time.desiredFps = 60;

    bg = game.add.tileSprite(0, 0, 512, 288, 'Background');
    bg.fixedToCamera = true;

    parallaxLayer1 = game.add.tileSprite(0, 0, 512, 288, "parallax1");
    parallaxLayer1.fixedToCamera = true;

    parallaxLayer2 = game.add.tileSprite(0, 0, 512, 288, "parallax2");
    parallaxLayer2.fixedToCamera = true;

    map = game.add.tilemap('Frogland');
    map.addTilesetImage('FrogtownTiles');
    map.addTilesetImage('DepthsTiles');
    map.addTilesetImage('Collision');
   
    this.backgroundLayer_3 = map.createLayer('Background_3');
    this.midgroundLayer_3 = map.createLayer('Midground_3');
    this.collisionLayer_3 = map.createLayer('Collision_3');
    this.collisionLayer_3.visible = false;

    this.backgroundLayer_2 = map.createLayer('Background_2');
    this.midgroundLayer_2 = map.createLayer('Midground_2');
    this.collisionLayer_2 = map.createLayer('Collision_2');
    this.collisionLayer_2.visible = false;
    this.backgroundLayer_2.visible = false;
    this.midgroundLayer_2.visible = false;

    this.currentLayer = 3;
    
    this.midgroundLayer_3.resizeWorld();
    this.midgroundLayer_2.resizeWorld();

    map.setCollision([1, 3, 4, 9, 10], true, 'Collision_3');
    map.setCollision([1, 3, 4, 9, 10], true, 'Collision_2');

    frauki = new Player(game, 100, 100, 'Frauki');
    game.add.existing(frauki);
    CustomCollider(frauki.body, this.collisionLayer_3);

    //create the enemies
    this.objectGroup_3 = game.add.group();
    this.objectGroup_3.enableBody = true;

    this.objectGroup_2 = game.add.group();
    this.objectGroup_2.enableBody = true;

    this.enemyPool = game.add.group();

    this.doorGroup = game.add.group();
    
    for(var i = 2; i <= 3; i++) {
        map.createFromObjects('Objects_' + i, 85, 'Insectoid', null, true, false, this['objectGroup_' + i], Enemy, false);
        map.createFromObjects('Objects_' + i, 86, 'Buzzar', null, true, false, this['objectGroup_' + i], Enemy, false);
        map.createFromObjects('Objects_' + i, 87, 'Sporoid', null, true, false, this['objectGroup_' + i], Enemy, false);
        map.createFromObjects('Objects_' + i, 88, 'Madman', null, true, false, this['objectGroup_' + i], Enemy, false);
        map.createFromObjects('Objects_' + i, 89, 'CreeperThistle', null, true, false, this['objectGroup_' + i], Enemy, false);
        map.createFromObjects('Objects_' + i, 90, 'Incarnate', null, true, false, this['objectGroup_' + i], Enemy, false);
        map.createFromObjects('Objects_' + i, 91, 'Haystax', null, true, false, this['objectGroup_' + i], Enemy, false);
        map.createFromObjects('Objects_' + i, 92, 'Bizarro', null, true, false, this['objectGroup_' + i], Enemy, false);
        map.createFromObjects('Objects_' + i, 93, 'Lancer', null, true, false, this['objectGroup_' + i], Enemy, false);

        map.createFromObjects('Objects_' + i, 66, 'Misc', 'Apple0000', true, false, this['objectGroup_' + i], Apple, false);
    }

    map.createFromObjects('Doors', 67, 'Door', 'Door0000', true, false, this.doorGroup, Door, false);
    
    this.foregroundLayer_3 = map.createLayer('Foreground_3');
    this.foregroundLayer_2 = map.createLayer('Foreground_2');

    cameraController = new CameraController(frauki, map);
    inputController = new InputController(frauki);
    effectsController = new EffectsController();
    energyController = new EnergyController();
    audioController = new AudioController();
    weaponController = new WeaponController();
    projectileController = new ProjectileController();
    timerUtil = new TimerUtil();

    energyController.Create();

    game.camera.focusOnXY(frauki.body.x, frauki.body.y);

    //special procesing for collision tiles
    map.forEach(function(tile) {
        //if the tile is marked as disappearing
        if(tile.index === 2) {
            var water = map.getTileWorldXY(tile.worldX, tile.worldY, 16, 16, 'Foreground_3');
            water.alpha = 0.4;
        } else if(tile.index === 4) {
            tile.collideLeft = false;
            tile.collideRight = false;
            tile.collideUp = true;
            tile.collideDown = false;
            tile.faceUp = true;
            tile.faceDown = false;
            tile.faceLeft = false;
            tile.faceRight = false; 
        }
           
    }, this, 0, 0, map.width, map.height, 'Collision_3');

};

Frogland.update = function() {
    frauki.UpdateAttackGeometry();

    //reset environmental effect flags
    frauki.states.inWater = false;
    
    game.physics.arcade.collide(frauki, this['collisionLayer_' + this.currentLayer], null, this.CheckEnvironmentalCollisions);
    game.physics.arcade.collide(frauki, this['objectGroup_' + this.currentLayer], this.CollideFraukiWithObject, this.OverlapFraukiWithObject);
    //game.physics.arcade.overlap(frauki, this.doorGroup, this.OverlapFraukiWithDoor);
    game.physics.arcade.collide(this['objectGroup_' + this.currentLayer], this['collisionLayer_' + this.currentLayer]);
    game.physics.arcade.collide(frauki, this['foregroundLayer_' + this.currentLayer], null, this.HideForeground);

    game.physics.arcade.overlap(frauki, projectileController.projectiles, this.CollideFraukiWithProjectile);

    cameraController.UpdateCamera();
    inputController.UpdateInput();
    effectsController.UpdateEffects();
    energyController.UpdateEnergy();
    weaponController.Update();
    triggers.Update();

    playerX = frauki.body.x;
    playerY = frauki.body.y;
};

Frogland.render = function() {
    game.debug.body(frauki);
    //game.debug.body(frauki.bodyDouble);
    //game.debug.body(frauki.attackRect);

/*    this.objectGroup.forEach(function(o) {
        game.debug.body(o);
    });*/

    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
};

Frogland.Restart = function() {
    var fadeOutTween = game.add.tween(game.world).to({alpha:0}, 1500, Phaser.Easing.Linear.None, true);
        fadeOutTween.onComplete.add(function() {
            frauki.body.x = fraukiSpawnX;
            frauki.body.y = fraukiSpawnY;
            game.world.alpha = 1;
            energyController.energy = 15;
            energyController.neutralPoint = 15;

            Frogland.objectGroup.forEach(function(e) {
                e.alive = true;
                e.exists = true;
                e.visible = true;
                e.body.center.x = e.initialX;
                e.body.center.y = e.initialY;
                e.body.velocity.x = 0;
                e.body.velocity.y = 0;
                e.energy = e.maxEnergy;

                if(!!e.Reset)
                    e.Reset.apply(e);
            });
        });
};

Frogland.ChangeLayer = function(newLayer) {

    if(this.currentLayer == newLayer) return;

    //get the current layer
    var currentForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    var currentMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    var currentBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    var currentCollisionLayer = this['collisionLayer_' + this.currentLayer];

    //currentForgroundLayer.visible = false;
    //currentMidgroundLayer.visible = false;
    //currentBackgroundLayer.visible = false;
    game.add.tween(currentForgroundLayer).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
    game.add.tween(currentMidgroundLayer).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
    game.add.tween(currentBackgroundLayer).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);

    this.currentLayer = newLayer;

    currentForgroundLayer = this['foregroundLayer_' + this.currentLayer];
    currentMidgroundLayer = this['midgroundLayer_' + this.currentLayer];
    currentBackgroundLayer = this['backgroundLayer_' + this.currentLayer];
    currentCollisionLayer = this['collisionLayer_' + this.currentLayer];

    currentForgroundLayer.visible = true;
    currentForgroundLayer.alpha = 0;
    currentMidgroundLayer.visible = true;
    currentMidgroundLayer.alpha = 0;
    currentBackgroundLayer.visible = true;
    currentBackgroundLayer.alpha = 0;

    game.add.tween(currentForgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
    game.add.tween(currentMidgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
    game.add.tween(currentBackgroundLayer).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);

};

//this is called when a collision happens. if it returns false the two will not be separated
Frogland.OverlapFraukiWithObject = function(f, o) {
    if(o.spriteType == 'apple') {
        EatApple(f, o);
        return false;
    } else if(o.spriteType === 'enemy') {

        if(o.CanCauseDamage()) {
            frauki.Hit(f, o);
        }

        return false;
    }

    return true;
};

Frogland.OverlapFraukiWithDoor = function(f, d) {
    if(d.spriteType === 'door') {
        if(frauki.currentLayer === d.firstLayer || frauki.currentLayer === d.secondLayer) {
            this.standingInDoorway = true;
        }
    }
};

Frogland.CollideFraukiWithProjectile = function(f, p) {

    if(p.projType === 'tar') {
        frauki.Hit(f, p.owningEnemy);
    }

    p.destroy();
};

Frogland.CollideFraukiWithObject = function(f, o) {

    if(!!o && typeof o === 'object') {
        if(o.spriteType === 'door')
            OpenDoor(f, o);
    }
};

Frogland.CheckEnvironmentalCollisions = function(f, tile) {

    if(tile.index === 1) { //solid tile
        return true;
    } else if(tile.index === 2) { //water
        frauki.states.inWater = true;
        effectsController.Splash(tile);
        return false;
    } else if(tile.index === 3) { //trick wall
        if(frauki.state === frauki.Rolling) {
            return false;
        } else {
            return true;
        }
    } else if(tile.index === 4) { //cloud tile
        return true;
    }
}

Frogland.SpawnEnemies = function() {
    //this function will randomly spawn enemies on the map. The farther down you get in the map,
    //the more difficult it should become. There should be a "density" function that considers the
    //max energy of enemies when deciding how to spawn them. For instance, in one area it might 
    //either spawn 5 or 6 sporoids, or one incarnate. Or, two or three insectoids. The difficulty
    //of an enemy is considered parallell to their max energy.

    //the spatial positioning will be the difficult part. there can be no guarntee of the size or
    //type of rooms created. so the spawning should consider the size of the space in which the thing
    //is going to be spawned.

    //perhaps their could be a sort of spawn daemon that traverses through the map and checks if
    //a certain type of enemy could potentially fit where it is by modifying its size, or something
}
