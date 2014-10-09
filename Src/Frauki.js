PLAYER_SPEED = function() { return 150 + (energyController.GetEnergy() * 7); }
PLAYER_ROLL_SPEED = function() { return 600 + (energyController.GetEnergy() * 5); }
PLAYER_RUN_SLASH_SPEED = function() { return  900 + (energyController.GetEnergy() * 10); }
PLAYER_JUMP_VEL = function() { return -370 - (energyController.GetEnergy() * 3); }
PLAYER_DOUBLE_JUMP_VEL = function() { return -350 - (energyController.GetEnergy() * 2); }
PLAYER_HIT_JUMP_VEL = function() { return -250 - (energyController.GetEnergy() * 2); }
PLAYER_JUMP_SLASH_SPEED = function() { return 1000 + (energyController.GetEnergy() * 5); }
PLAYER_KICK_SPEED = 800;

Player = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5, 1);

    this.body.collideWorldBounds = true;
    this.body.setSize(11, 50, 0, -75);
    this.body.maxVelocity.y = 500;

    //movements
    this.animations.add('stand', ['Stand0000'], 10, true, false);
    this.animations.add('run', ['Run0000', 'Run0001', 'Run0002', 'Run0003', 'Run0004', 'Run0005', 'Run0006', 'Run0007'], 15, true, false);
    this.animations.add('jump', ['Jump0000', 'Jump0001', 'Jump0002', 'Jump0003', 'Jump0004'], 10, true, false);
    this.animations.add('peak', ['Peak0000', 'Peak0001'], 14, false, false);
    this.animations.add('fall', ['Fall0000', 'Fall0001', 'Fall0002', 'Fall0003'], 18, true, false);
    this.animations.add('land', ['Standing Jump0006', 'Standing Jump0007', 'Standing Jump0008'], 10, false, false);
    this.animations.add('crouch', ['Crouch0000', 'Crouch0001', 'Crouch0002', 'Crouch0003', 'Crouch0004', 'Crouch0005', 'Crouch0006', 'Crouch0007', 'Crouch0008'], 20, false, false);
    this.animations.add('flip', ['Flip0000', 'Flip0001', 'Flip0002', 'Flip0003', 'Flip0004'], 14, false, false);
    this.animations.add('roll', ['Flip0000', 'Flip0001', 'Flip0002', 'Flip0003', 'Flip0004'], 14, false, false);
    this.animations.add('hit', ['Hit0000', 'Hit0001'], 10, true, false);
    this.animations.add('kick', ['Kick0000', 'Kick0001'], 18, false, false);

    //attacks
    this.animations.add('attack_front', ['Attack Front0001', 'Attack Front0002', 'Attack Front0003', 'Attack Front0004', 'Attack Front0005', 'Attack Front0006', 'Attack Front0007', 'Attack Front0008',], 20, false, false);
    this.animations.add('attack_overhead', ['Attack Overhead0003', 'Attack Overhead0004', 'Attack Overhead0005', 'Attack Overhead0006', 'Attack Overhead0007', 'Attack Overhead0008', 'Attack Overhead0009', 'Attack Overhead0010', 'Attack Overhead0011', 'Attack Overhead0012', 'Attack Overhead0013'], 20, false, false);
    this.animations.add('attack_stab', ['Attack Stab0002', 'Attack Stab0003', 'Attack Stab0004', 'Attack Stab0005', 'Attack Stab0006', 'Attack Stab0007', 'Attack Stab0008', 'Attack Stab0009', 'Attack Stab0010', 'Attack Stab0011', 'Attack Stab0012', 'Attack Stab0013', 'Attack Stab0014', 'Attack Stab0015', 'Attack Stab0016', 'Attack Stab0017', 'Attack Stab0018', 'Attack Stab0019'], 20, false, false);
    this.animations.add('attack_dive_charge', ['Attack Dive0000', 'Attack Dive0001', 'Attack Dive0002', 'Attack Dive0003', 'Attack Dive0004', 'Attack Dive0005', 'Attack Dive0006', 'Attack Dive0007', 'Attack Dive0008', 'Attack Dive0009', 'Attack Dive0010', 'Attack Dive0011'], 20, false, false);
    this.animations.add('attack_dive_fall', ['Attack Dive0012', 'Attack Dive0013', 'Attack Dive0014'], 20, true, false);
    this.animations.add('attack_dive_land', ['Attack Dive0021', 'Attack Dive0022', 'Attack Dive0023', 'Attack Dive0024', 'Attack Dive0025', 'Attack Dive0026', 'Attack Dive0027', 'Attack Dive0028', 'Attack Dive0029'], 20, false, false);

    this.state = this.Standing;
    this.PlayAnim('stand');
    
    this.tweens = {};
    this.tweens.roll = null;
    this.tweens.stopJump = null;
    this.tweens.startRun = null;
    this.tweens.stopRun = null;

    this.states = {};
    this.states.direction = 'right';
    this.states.crouching = false;
    this.states.hasFlipped = false;
    this.states.upPresseed = false;
    this.states.wasAttacking = false;

    this.timers = {};
    this.timers.gracePeriod = 0;
    this.timers.hitTimer = 0;
    this.timers.dashWindow = 0;
    this.timers.kickTimer = 0;

    this.movement = {};
    this.movement.rollVelocity = 0;
    this.movement.diveVelocity = 0;
    this.movement.jumpSlashVelocity = 0;
    this.movement.rollBoost = 0;

    this.currentAttack = {};
    this.attackRect = game.add.sprite(0, 0, null);
    game.physics.enable(this.attackRect, Phaser.Physics.ARCADE);
    this.attackRect.body.setSize(0, 0, 0, 0);

    events.subscribe('player_jump', this.Jump, this);
    events.subscribe('player_crouch', this.Crouch, this);
    events.subscribe('player_slash', this.Slash, this);
    events.subscribe('player_roll', this.Roll, this);
    events.subscribe('player_run', this.StartStopRun, this);
    events.subscribe('control_up', function(params) { 
        this.states.upPressed = params.pressed;
    }, this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function() {
}

Player.prototype.update = function() {

    this.body.maxVelocity.x = PLAYER_SPEED() + this.movement.rollBoost;
    this.body.maxVelocity.y = 500;

    this.state();

    //reset the double jump flag
    if(this.body.onFloor()) {
        this.states.hasFlipped = false;
        this.movement.rollBoost = 0;
    }

    if(this.state === this.Falling) {
        this.body.gravity.y = game.physics.arcade.gravity.y * 2;
    } else {
        this.body.gravity.y = 0;
    }

    if(this.states.wasAttacking && !this.Attacking()) {
        //this.timers.gracePeriod = game.time.now + 100;
    }

    if(this.Attacking()) {
        this.states.wasAttacking = true;
    } else {
        this.states.wasAttacking = false;
    }

    if(this.body.acceleration.x === 0 && this.movement.rollVelocity === 0 && this.state !== this.Hurting)
        this.body.velocity.x = 0;

    if(!inputController.runLeft.isDown && !inputController.runRight.isDown) {
        this.body.acceleration.x = 0;
    }

    /*if(this.state === this.Crouching) {
        this.body.setSize(11, 30, 0, 0);
    } else {
        this.body.setSize(11, 50, 0, 0);
    }*/
};

Player.prototype.SetDirection = function(dir) {
    if(this.states.direction !== dir) {
        this.states.direction = dir;

        dir === 'left' ? this.scale.x = -1 : this.scale.x = 1;
    }
};

Player.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Player.prototype.Grace = function() {
    return (this.game.time.now < this.timers.gracePeriod);
};

Player.prototype.UpdateAttackGeometry = function() {
    //check for a frame mod and apply its mods
    if(this.animations.currentFrame) {
        this.currentAttack = fraukiDamageFrames[this.animations.currentFrame.name];
    } 

    if(!!this.currentAttack) {

        if(this.states.direction === 'right') {
            this.attackRect.body.x = this.currentAttack.x + this.body.x; 
            this.attackRect.body.y = this.currentAttack.y + this.body.y; 
            this.attackRect.body.width = this.currentAttack.w; 
            this.attackRect.body.height = this.currentAttack.h;
        } else {
            this.attackRect.body.x = (this.currentAttack.x * -1) + this.body.x - this.currentAttack.w + this.body.width;
            this.attackRect.body.y = this.currentAttack.y + this.body.y;
            this.attackRect.body.width = this.currentAttack.w;
            this.attackRect.body.height = this.currentAttack.h;
        }
    }
    else {
        this.attackRect.body.x = 0;
        this.attackRect.body.y = 0;
        this.attackRect.body.width = 0;
        this.attackRect.body.height = 0;
    }
};

Player.prototype.Attacking = function() {
    //if(this.state === this.AttackFront || this.state === this.AttackOverhead || this.state === this.AttackStab || this.state === this.AttackDive || this.state === this.AttackJump)
    if(!!this.attackRect && this.attackRect.body.width !== 0)
        return true;
    else
        return false;
};

Player.prototype.LandHit = function() { 
    if(!this.body.onFloor())
        this.body.velocity.y += PLAYER_HIT_JUMP_VEL();
};

////////////////ACTIONS//////////////////
Player.prototype.Run = function(params) {
    if(this.state === this.Hurting || this.state === this.Rolling) 
        return;

    if(params.dir === 'left') {
        this.body.acceleration.x = -1500;
        this.SetDirection('left');
    } else if(params.dir === 'right') {
        this.body.acceleration.x = 1500;
        this.SetDirection('right');
    } else {
        this.body.acceleration.x = 0;
        this.movement.rollBoost = 0;
    }
};

Player.prototype.StartStopRun = function(params) {
    if(params.run) {
        //open the window for dash attcks
        if(game.time.now > this.timers.dashWindow) {
            this.timers.dashWindow = game.time.now + 200;
        //double tap to roll
        } else if(params.dir === this.states.direction) {
            this.Roll();
            this.timers.dashWindow = game.time.now + 200;
        }

    } else {
        if(this.state !== this.Rolling)
            this.body.velocity.x = 0;
            //this.tweens.stopRun = game.add.tween(this.body.velocity).to({x: 0}, 120, Phaser.Easing.Linear.None, true);
    }
};

Player.prototype.Jump = function(params) {
    if(this.state === this.Hurting || this.Attacking()) 
        return;

    if(params.jump) {
        //normal jump
        if(this.body.onFloor() || this.state === this.Standing || this.state === this.Running || this.state === this.Landing) {
            this.body.velocity.y = PLAYER_JUMP_VEL();
        }
        //double jump
        else if(this.states.hasFlipped === false && this.state !== this.Falling && this.state !== this.Rolling && this.state !== this.AttackStab) {
            if(this.tweens.stopJump) { this.tweens.stopJump.stop(); }

            this.body.velocity.y = PLAYER_DOUBLE_JUMP_VEL();
            this.state = this.Flipping;
            this.states.hasFlipped = true;
            this.timers.gracePeriod = game.time.now + 300;
        }
    } else if(this.body.velocity.y < 0 && this.state !== this.Flipping) {
        if(this.body.velocity.y < 0)
            this.tweens.stopJump = game.add.tween(this.body.velocity).to({y: 0}, 100, Phaser.Easing.Exponential.In, true);
    }
};

Player.prototype.Crouch = function(params) {
    this.states.crouching = params.crouch;

    this.timers.dashWindow = game.time.now + 200;
};

Player.prototype.Slash = function(params) {

    //diving dash
    if(game.time.now < this.timers.dashWindow && this.states.crouching && (this.state === this.Jumping || this.state === this.Peaking || this.state === this.Falling)) {
        this.state = this.AttackDiveCharge;
        this.movement.diveVelocity = 1000;
    }
    //running dash
    else if(this.state === this.Rolling || this.state === this.Kicking) {
        this.state = this.AttackStab;

        if(this.states.direction === 'left') {
            //this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: -PLAYER_SPEED()}, 200, Phaser.Easing.Quartic.In, true);
            this.movement.rollVelocity = 0;
            this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: -PLAYER_RUN_SLASH_SPEED()}, 200, Phaser.Easing.Exponential.InOut, true).to({rollVelocity: 0}, 500, Phaser.Easing.Exponential.InOut, true);
        }
        else {
            //this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: PLAYER_SPEED()}, 200, Phaser.Easing.Quartic.In, true);
            this.movement.rollVelocity = 0;
            this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: PLAYER_RUN_SLASH_SPEED()}, 200, Phaser.Easing.Exponential.InOut, true).to({rollVelocity: 0}, 500, Phaser.Easing.Exponential.InOut, true);
        }
    }
    //upwards dash attack
    else if(this.states.upPressed && (this.state === this.Peaking || this.state === this.Jumping) && this.states.hasFlipped === false) {
        this.state = this.AttackJump;
        this.movement.jumpSlashVelocity = -(PLAYER_JUMP_SLASH_SPEED());
        game.add.tween(this.movement).to({jumpSlashVelocity:0}, 400, Phaser.Easing.Quartic.Out, true);
        this.states.hasFlipped = true;
    }
    //normal slashes while standing or running
    else if(this.state === this.Standing || this.state === this.Landing || this.state === this.AttackStab || this.state === this.Running || this.state === this.Jumping || this.state === this.Peaking || this.state === this.Falling) {
        if(this.states.upPressed)
            this.state = this.AttackOverhead;
        else
            this.state = this.AttackFront;
    } else {
        console.log('An attack was attempted in an unresolved state');
    }
};

Player.prototype.Roll = function(params) {

    if(this.game.time.now < this.rollTimer)
        return;

    //kick
    if(this.state === this.Jumping || this.state === this.Peaking || this.state === this.Falling || this.state === this.Flipping) {
        this.state = this.Kicking;
        this.timers.kickTimer = game.time.now + 200;

        if(this.states.direction === 'left') {
            this.movement.rollVelocity = -PLAYER_RUN_SLASH_SPEED();
            this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: -PLAYER_SPEED()}, 100, Phaser.Easing.Quartic.In, true);
        }
        else {
            this.movement.rollVelocity = PLAYER_RUN_SLASH_SPEED();
            this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: PLAYER_SPEED()}, 100, Phaser.Easing.Quartic.In, true);
        }

        return;
    }

    if(!this.body.onFloor())
        return;

    this.state = this.Rolling;

    if(this.states.direction === 'left') {
        this.movement.rollVelocity = -(PLAYER_ROLL_SPEED());
        this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: -(PLAYER_SPEED())}, 300, Phaser.Easing.Quartic.In, true);
    }
    else {
        this.movement.rollVelocity = PLAYER_ROLL_SPEED();
        this.tweens.roll = game.add.tween(this.movement).to({rollVelocity: PLAYER_SPEED()}, 300, Phaser.Easing.Quartic.In, true);
    }

    this.rollTimer = game.time.now + 650;
    this.timers.gracePeriod = game.time.now + 300;
};

Player.prototype.Hit = function(f, e) {
    if(this.state === this.Hurting || e.state === e.Hurting)
        return;

    this.body.velocity.y = -300;

    effectsController.ParticleSpray(this.body.x, this.body.y, this.body.width, this.body.height, 'yellow');

    energyController.RemoveEnergy();

    e.energy += 1;

    this.body.x < e.body.x ? this.body.velocity.x = -200 : this.body.velocity.x = 200;

    this.state = this.Hurting;
    this.timers.gracePeriod = game.time.now + 1000;
    this.timers.hitTimer = game.time.now + 500;
};

//////////////////STATES/////////////////

Player.prototype.Standing = function() {
    this.PlayAnim('stand');

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    } else if(this.body.velocity.y > 10) {
        this.state = this.Falling;
    } else if(this.body.velocity.x !== 0) {
        this.state = this.Running;
    } else if(this.states.crouching) {
        this.state = this.Crouching;
    }
};

Player.prototype.Running = function() {
    this.PlayAnim('run');

    if(this.body.velocity.x === 0 && this.body.onFloor()) {
        this.state = this.Standing;
    } else if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    } else if(this.body.velocity.y > 150) {
        this.state = this.Peaking;
    }
};

Player.prototype.Jumping = function() {
    this.PlayAnim('jump');

    if(this.body.velocity.y > 0) {
        this.state = this.Peaking;
    }

};

Player.prototype.Peaking = function() {
    this.PlayAnim('peak');

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    } else if(this.body.onFloor()) {
        this.state = this.Landing;
    } else if(this.animations.currentAnim.isFinished) {
        this.state = this.Falling;
    }
};

Player.prototype.Falling = function() {
    this.PlayAnim('fall');

    if(this.body.onFloor()) {
        if(this.body.velocity.x === 0) {
            if(this.states.crouching)
                this.state = this.Crouching;
            else
                this.state = this.Landing;
        }
        else {
            this.state = this.Running;
        }
    }

};

Player.prototype.Landing = function() {
    this.PlayAnim('land');

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    }

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.x === 0) {
            this.state = this.Standing;
        } else {
            this.state = this.Running;
        }
    }
};

Player.prototype.Crouching = function() {
    this.PlayAnim('crouch');

    if(!this.states.crouching || this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
        this.state = this.Standing;
    }

};

Player.prototype.Flipping = function() {
    this.PlayAnim('flip');

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.y > 0) {
            this.state = this.Falling;
        } else if(this.body.velocity.y < 0) {
            this.state = this.Jumping;
        } else if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
        } else if(this.body.velocity.x === 0 && this.body.onFloor()) {
            this.state = this.Landing;
        }
    }
};

Player.prototype.Rolling = function() {
    this.PlayAnim('roll');

    this.body.maxVelocity.x = PLAYER_ROLL_SPEED();
    this.body.velocity.x = this.movement.rollVelocity;
    
    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;

        //roll boost is caluclated based on how close they were to the max roll speed
        this.movement.rollBoost = Math.abs(this.movement.rollVelocity) - PLAYER_SPEED(); 
        this.movement.rollBoost /= (PLAYER_ROLL_SPEED() - PLAYER_SPEED());
        this.movement.rollBoost *= 75;

        this.movement.rollVelocity = 0;
    }

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.y > 150) {
            this.state = this.Falling;
            this.movement.rollVelocity = 0;
        } else if(!inputController.runLeft.isDown && !inputController.runRight.isDown && this.body.onFloor()) {
            this.state = this.Standing;
            this.movement.rollVelocity = 0;
        } else if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
            this.movement.rollVelocity = 0;
        }
    }
};

Player.prototype.Hurting = function() {
    this.PlayAnim('hit');

    if(game.time.now > this.timers.hitTimer) {
        if(this.body.velocity.y > 0) {
            this.state = this.Falling;
        } else if(this.body.velocity.x === 0) {
            this.state = this.Standing;
        } else {
            this.state = this.Running;
        }  
    }
};

Player.prototype.AttackFront = function() {
    this.PlayAnim('attack_front');

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Standing;
    }
};

Player.prototype.AttackOverhead = function() {
    this.PlayAnim('attack_overhead');

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Standing;
    }
};

Player.prototype.AttackStab = function() {
    this.PlayAnim('attack_stab');

    //override the max velocity
    this.body.maxVelocity.x = PLAYER_ROLL_SPEED();
    this.body.velocity.x = this.movement.rollVelocity;

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
        this.movement.rollVelocity = 0;
    } else if(this.body.velocity.y > 150 && !this.Attacking()) {
        this.state = this.Peaking;
        this.movement.rollVelocity = 0;
    }


    if(this.animations.currentAnim.isFinished) {
        //this.timers.dashWindow = game.time.now + 200;

        if(this.body.velocity.y > 150) {
            this.state = this.Falling;
            this.movement.rollVelocity = 0;
        } else if(!inputController.runLeft.isDown && !inputController.runRight.isDown && this.body.onFloor()) {
            this.state = this.Standing;
            this.movement.rollVelocity = 0;
        } else if(this.body.acceleration.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
            this.movement.rollVelocity = 0;
        }
    }
};

Player.prototype.AttackDiveCharge = function() {
    this.PlayAnim('attack_dive_charge');
    this.body.velocity.y = 0;

    if(this.animations.currentAnim.isFinished) {
        this.state = this.AttackDiveFall;
    }
};

Player.prototype.AttackDiveFall = function() {
    this.PlayAnim('attack_dive_fall');
    this.body.maxVelocity.y = this.movement.diveVelocity;
    this.body.velocity.y = this.movement.diveVelocity;

    if(this.body.onFloor()) {
        this.movement.diveVelocity = 0;
        //this.timers.dashWindow = game.time.now + 200;

        events.publish('camera_shake', {magnitudeX: 10, magnitudeY: 5, duration: 200});
        this.state = this.AttackDiveLand;
    }
};

Player.prototype.AttackDiveLand = function() {
    this.PlayAnim('attack_dive_land');
    this.body.velocity.y = 0;

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.x === 0) {
            if(this.states.crouching)
                this.state = this.Crouching;
            else
                this.state = this.Landing;
        }
        else {
            this.state = this.Running;
        }
    }

};

Player.prototype.AttackJump = function() {
    this.PlayAnim('attack_overhead');

    if(this.movement.jumpSlashVelocity !== 0)
        this.body.velocity.y = this.movement.jumpSlashVelocity;

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Jumping;
    }
};

Player.prototype.Kicking = function() {
    this.PlayAnim('kick');
    this.body.velocity.x = this.movement.rollVelocity;

    if(this.body.velocity.x !== 0 && this.body.onFloor()) {
            this.state = this.Running;
    } else if(this.body.velocity.x === 0 && this.body.onFloor()) {
        this.state = this.Landing;
    }

    if(game.time.now > this.timers.kickTimer) {
        if(this.body.velocity.y >= 0) {
            this.state = this.Falling;
        } else if(this.body.velocity.y < 0) {
            this.state = this.Jumping;
        }
    }
}
