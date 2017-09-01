ProjectileController = function() {
	this.projectiles = game.add.group();
};

ProjectileController.prototype.Mortar = function(e) {
	var xPos = e.body.center.x;
	var yPos = e.body.center.y - 20;

	if(e.direction === 'left') {
		xPos -= 50;
	} else {
		xPos += 50;
	}

	var mortar = game.add.sprite(xPos, yPos, 'EnemySprites');
	game.physics.enable(mortar, Phaser.Physics.ARCADE);

	mortar.body.setSize(18, 20);
	mortar.anchor.setTo(0.5);

	mortar.animations.add('idle', ['SW8T/Mortar0000', 'SW8T/Mortar0001', 'SW8T/Mortar0002', 'SW8T/Mortar0003'], 14, true, false);
	var explode = mortar.animations.add('explode', ['SW8T/Mortar0004', 'SW8T/Mortar0005', 'SW8T/Mortar0006', 'SW8T/Mortar0007'], 16, false, false);
	explode.killOnComplete = true;

	mortar.play('idle');

	//parabolic arc
	var duration = 1.0;
	var xTarget = frauki.body.center.x + game.rnd.between(-50, 50);
	var yTarget = frauki.body.center.y;

	mortar.body.velocity.x = (xTarget - mortar.body.center.x) / duration;
	mortar.body.velocity.y = (yTarget + -0.5 * game.physics.arcade.gravity.y * duration * duration - mortar.body.center.y) / duration;

	mortar.body.velocity.x += frauki.body.velocity.x;

	mortar.body.bounce.set(0.0);

	mortar.projType = 'mortar';
	mortar.owningEnemy = e;
	mortar.spawnTime = game.time.now;
	mortar.lifeTime = 5000;
	mortar.solid = true;

	this.projectiles.add(mortar);
};

ProjectileController.prototype.Tarball = function(e) {
	var tar = game.add.sprite(e.body.center.x, e.body.center.y, 'EnemySprites');
	game.physics.enable(tar, Phaser.Physics.ARCADE);

	tar.body.setSize(18, 20);
	tar.animations.add('idle', ['Haystax/Tarball0000', 'Haystax/Tarball0001'], 14, true, false);
	tar.play('idle');

	//parabolic arc
	var duration = 1.2;
	tar.body.velocity.x = (frauki.body.center.x - tar.body.center.x) / duration;
	tar.body.velocity.y = (frauki.body.center.y + -0.5 * game.physics.arcade.gravity.y * duration * duration - tar.body.center.y) / duration;

	tar.body.bounce.set(0.75);

	tar.projType = 'tar';
	tar.owningEnemy = e;
	tar.spawnTime = game.time.now;
	tar.lifeTime = 5000;
	tar.solid = true;

	this.projectiles.add(tar);
};

ProjectileController.prototype.Spore = function(e) {
	var spore = game.add.sprite(e.body.center.x, e.body.center.y, 'EnemySprites');
	game.physics.enable(spore, Phaser.Physics.ARCADE);

	spore.body.setSize(18, 20);
	spore.body.allowGravity = false;
	spore.animations.add('idle', ['Sporoid/Spore0000', 'Sporoid/Spore0001'], 14, true, false);
	spore.play('idle');

	game.physics.arcade.moveToXY(spore, frauki.body.center.x, frauki.body.center.y, 200);

	spore.body.velocity.x += Math.random() * 50 - 25;
	spore.body.velocity.y += Math.random() * 50 - 25;

	spore.body.bounce.set(0.2);

	spore.projType = 'spore';
	spore.owningEnemy = e;
	spore.spawnTime = game.time.now;
	spore.lifeTime = 5000;
	spore.solid = true;

	this.projectiles.add(spore);
};

ProjectileController.prototype.LaserBolt = function(e, rot, flip) {

	var finalX = Math.cos(rot) * 50;
	var finalY = Math.sin(rot) * 50;

	if(flip === 1) {
		finalY -= 10;
	} else {
		finalY += 7;
	}

	var bolt = game.add.sprite(e.body.center.x + finalX, e.body.center.y + finalY, 'EnemySprites');
	game.physics.enable(bolt, Phaser.Physics.ARCADE);

	bolt.body.setSize(5, 5);
	bolt.body.allowGravity = false;
	bolt.animations.add('idle', ['QL0k/Bolt0000', 'QL0k/Bolt0001'], 14, true, false);
	bolt.play('idle');
	bolt.rotation = rot;

	bolt.body.velocity = game.physics.arcade.velocityFromRotation(rot, 300);

	//game.physics.arcade.moveToXY(bolt, frauki.body.center.x, frauki.body.center.y, 500);

	bolt.projType = 'bolt';
	bolt.owningEnemy = e;
	bolt.spawnTime = game.time.now;
	bolt.lifeTime = 5000;
	bolt.solid = true;

	this.projectiles.add(bolt);
};

ProjectileController.prototype.FallingTile = function(sourceTile) {

	var tileName = Math.random() * 3;

	if(tileName < 1) {
		tileName = 'Tiles0000';
	} else if(tileName < 2) {
		tileName = 'Tiles0001';
	} else {
		tileName = 'Tiles0002';
	}

	var tile = game.add.sprite(sourceTile.worldX, sourceTile.worldY, 'Misc', tileName);
	game.physics.enable(tile, Phaser.Physics.ARCADE);

	tile.body.setSize(16, 16);

	tile.body.bounce.set(0.2);
	tile.rotation = (Math.random() * 1) - 0.5;
	tile.body.velocity.x = Math.random() * 50;
	tile.body.drag.x = 200;

	tile.projType = 'tile';
	tile.spawnTime = game.time.now;
	tile.lifeTime = 3000;

	this.projectiles.add(tile);
};

ProjectileController.prototype.Update = function() {
	var that = this;

	var childrenToRemove = [];

	this.projectiles.forEach(function(p) {

		if(game.time.now - p.spawnTime > p.lifeTime && p.lifeTime !== 0) {
			p.destroy();
			childrenToRemove.push(p);
		} else if(p.solid) {
			game.physics.arcade.collide(p, Frogland.GetCurrentCollisionLayer(), Collision.CollideProjectileWithWorld);
		}

	});

	childrenToRemove.forEach(function(e) {
		e.destroy();
	});
};

ProjectileController.prototype.DestroyAllProjectiles = function() {
	this.projectiles.removeAll(true);
};

function ProjectileHit(f, p) {
	if(p.projType === 'tar' || p.projType === 'spore') {
		p.destroy();
	}
};