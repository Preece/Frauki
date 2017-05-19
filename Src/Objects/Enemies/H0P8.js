Enemy.prototype.types['H0P8'] =  function() {

    this.body.setSize(40, 53, 0, -10);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['H0P8/Idle0000', 'H0P8/Idle0001', 'H0P8/Idle0002', 'H0P8/Idle0003'], 6, true, false);
    this.animations.add('pre_hop', ['H0P8/Attack0001'], 10, false, false);
    this.animations.add('hop', ['H0P8/Attack0002'], 10, false, false);
    this.animations.add('attack', ['H0P8/Attack0003', 'H0P8/Attack0004', 'H0P8/Attack0005', 'H0P8/Attack0006'], 10, false, false);
    this.animations.add('hurt', ['H0P8/Hurt0001'], 10, false, false);

    this.energy = 4;
    this.baseStunDuration = 500;
    this.stunThreshold = 1;
    this.body.bounce.y = 0;
    this.body.drag.x = 600;

    this.robotic = true;

    this.updateFunction = function() {
        if(this.state === this.Hurting)
            return;
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

            //if theyre stunned, seize the opportunity
            if(EnemyBehavior.Player.IsStunned(this)) {
                this.Hop();

            } else if(this.body.onFloor()) {
                if(this.timers.TimerUp('dodge') && (EnemyBehavior.Player.IsDangerous(this) || EnemyBehavior.Player.IsNear(this, 100))) {
                    this.Dodge();
                }
                else if(EnemyBehavior.Player.IsNear(this, 20)) {
                    this.Dodge();
                }
                else if(this.timers.TimerUp('attack_wait') && EnemyBehavior.Player.IsVulnerable(this) && !EnemyBehavior.Player.IsNear(this, 50)) {
                    this.Hop();
                   
                } else {
                    this.state = this.Idling;
                }

            } else {
                this.state = this.Idling;

            }

        } else {
            this.state = this.Idling;
        }
    };

    this.LandHit = function() {
        //this.Dodge();
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {

        EnemyBehavior.FacePlayer(this);

        this.timers.SetTimer('attack', 600);
        this.state = this.PreHopping;
    };

    this.Dodge = function() {
        
        this.timers.SetTimer('attack', 500);

        this.state = this.Dodging;

        if(frauki.body.onFloor()) {
            this.body.velocity.y = -300;

            if(frauki.body.center.x < this.body.center.x) {
                this.body.velocity.x = 600;
            } else {
                this.body.velocity.x = -600;
            }   
        } else {
            if(frauki.body.center.x < this.body.center.x) {
                this.body.velocity.x = -600;
            } else {
                this.body.velocity.x = 600;
            }   
        }

        EnemyBehavior.FaceForward(this);

    };

    this.Slash = function() {
        this.state = this.Slashing;
    };


    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');
        EnemyBehavior.FacePlayer(this);


        return true;
    };

    this.PreHopping = function() {
        this.PlayAnim('pre_hop');

        if(this.timers.TimerUp('attack')) {

            if(EnemyBehavior.Player.IsNear(this, 40)) {
                this.Dodge();
                return false;
            }

            this.state = this.Hopping;

            var ptX = frauki.body.center.x;
            var ptY = frauki.body.y - 20;
            var overDist = game.rnd.between(250, 300);

            if(EnemyBehavior.Player.IsLeft(this)) {
                ptX -= overDist;
            } else {
                ptX += overDist;
            }

            EnemyBehavior.FacePlayer(this);
            EnemyBehavior.JumpToPoint(this, ptX, ptY); 

            if(this.body.velocity.y < -400) {
                this.body.velocity.y = -400;
            }

        }

        return false;
    };

    this.Hopping = function() {
        if(this.body.onFloor()) {
            this.PlayAnim('pre_hop');
        } else {
            this.PlayAnim('hop');
        }

        if(EnemyBehavior.Player.IsNear(this, 100)) {
            this.Slash();
        }

        if(this.body.onFloor()) {
            this.timers.SetTimer('attack_wait', 800);

            return true;
        }

        return false;
    };

    this.Slashing = function() {
        this.PlayAnim('attack');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.timers.SetTimer('attack_wait', 800);
            return true;
        }

        return false;
    };

    this.Dodging = function() {

        if(!this.body.onFloor()) {
            this.PlayAnim('hop');
        } else {
            this.PlayAnim('pre_hop');
        }

        if(this.timers.TimerUp('attack') || this.body.velocity.y > 0 || this.body.onFloor()) {
            this.timers.SetTimer('dodge', 700);
            this.timers.SetTimer('attack_wait', 0);
            return true;
        }

        return false;
    };

    this.Hurting = function() {
        this.PlayAnim('hurt');

        if(this.timers.TimerUp('hit')) {
            return true;
        }

        return false;
    };

    this.attackFrames = {
        'H0P8/Attack0004': {
            x: 0, y: 0, w: 70, h: 70,
            damage: 3,
            knockback: 1,
            priority: 1,
            juggle: 0
        }
    };

};
