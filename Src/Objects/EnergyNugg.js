EnergyNugg = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'energyNugg';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(32, 32, 0, 0);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;
    this.rando = Math.floor(Math.random() * 300);

    var frames = ['EnergyBitPos0000', 'EnergyBitPos0001', 'EnergyBitPos0002', 'EnergyBitPos0003', 'EnergyBitPos0004', 'EnergyBitPos0005'];
    var i = Math.floor(Math.random() * 5);
    while(i--) {
        frames.push(frames.shift());
    }


    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Idle;

    this.body.allowGravity = false;

    this.animations.add('idle', ['EnergyBitPos0000', 'EnergyBitPos0001', 'EnergyBitPos0002', 'EnergyBitPos0003', 'EnergyBitPos0004', 'EnergyBitPos0005'], 20, true, false);
    this.animations.add('eaten', ['EnergyNugg0001'], 10, false, false);

};

EnergyNugg.prototype = Object.create(Phaser.Sprite.prototype);
EnergyNugg.prototype.constructor = EnergyNugg;

EnergyNugg.prototype.create = function() {

};

EnergyNugg.prototype.update = function() {
    if(!this.body.enable)
        return;

    if(!!this.state)
        this.state();
};

function EatEnergyNugg(f, a) {
    
    effectsController.SpawnEnergyNuggets(a.body, frauki.body, 'positive', 1);

    a.destroy();
};

EnergyNugg.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

EnergyNugg.prototype.Idle = function() {
    this.PlayAnim('idle');

    this.body.velocity.y = Math.sin((game.time.now / 100) + this.rando) * 15;
};
