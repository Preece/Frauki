Door = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'door';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 68, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.x += 24;
    
    this.SetDirection('left');

    this.state = this.Closed;

    this.body.allowGravity = false;
    this.body.immovable = true;
    this.visible = false;

    this.animations.add('closed', ['Door0000'], 10, true, false);
    this.animations.add('opening', ['Door0000', 'Door0001', 'Door0002', 'Door0003', 'Door0004', 'Door0005', 'Door0006'], 10, false, false);
};

Door.prototype = Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;

Door.prototype.create = function() {

};

Door.prototype.update = function() {

    if(!!this.state)
        this.state();
};

Door.prototype.SetDirection = function(dir) {
    if(dir === 'left' && this.direction !== 'left') {
        this.direction = 'left';
        this.scale.x = -1;
    }
    else if(dir === 'right' && this.direction !== 'right') {
        this.direction = 'right';
        this.scale.x = 1;
    }
};

function OpenDoor(f, d, override) {
    if(d.state === d.Closed) {
        if((d.facing === 'left' && f.body.center.x > d.body.center.x) || (d.facing === 'right' && f.body.center.x < d.body.center.x) || !!override) {
            var openTween = game.add.tween(d.body).to({y: d.body.y + 70}, 2000, Phaser.Easing.Quintic.InOut, true);

            //disable the body after its opened
            openTween.onComplete.add(function() {
                this.body.enable = false;
            }, d);

            d.state = d.Opening;

            console.log('Opening door ' + d.id);

            if(Frogland.openDoors.indexOf(d.id) === -1) {
                Frogland.openDoors.push(d.id);
                localStorage.setItem('fraukiDoors', JSON.stringify(Frogland.openDoors));
            }
        }
    }
};

Door.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Door.prototype.Closed = function() {
    this.PlayAnim('closed');
};

Door.prototype.Opening = function() {
    this.PlayAnim('closed');

    this.state = this.Open;
};

Door.prototype.Open = function() {
    this.PlayAnim('closed');

};
