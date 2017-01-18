Shard = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Misc');
    this.spriteType = 'shard';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 16, 0, 2);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;
    this.body.bounce.x = 0.5;
    this.body.drag.setTo(0);
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Floating;

    this.body.allowGravity = false;

    this.timers = new TimerUtil();

    this.animations.add('floating', [name], 10, false, false);
    this.animations.add('stuff', [name], 10, false, false);

    this.currentLayer = Frogland.shardLayer;
    this.shardFrame = name;

};

Shard.prototype = Object.create(Phaser.Sprite.prototype);
Shard.prototype.constructor = Shard;

Shard.prototype.create = function() {

};

Shard.prototype.update = function() {
    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();

};

function PickUpShard(f, a) {
    GameData.AddShard('Will');
    a.destroy();
};

Shard.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Shard.prototype.Floating = function() {
    this.PlayAnim('floating');

    this.body.velocity.y = Math.sin(game.time.now / 150) * 30;
    this.body.velocity.x = 0;
};
