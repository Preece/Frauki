Enemy.prototype.types['GUBr'] =  function() {

	this.body.setSize(16, 50, 0, 0);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['GUBr/Stand0000'], 10, false, false);
    this.animations.add('walk', ['GUBr/Walk0000', 'GUBr/Walk0001', 'GUBr/Walk0002', 'GUBr/Walk0003'], 10, true, false);
    this.animations.add('attack', ['GUBr/Attack0000', 'GUBr/Attack0001', 'GUBr/Attack0002', 'GUBr/Attack0003', 'GUBr/Attack0004', 'GUBr/Attack0005'], 10, false, false);
    this.animations.add('hit', ['GUBr/Hit0000'], 10, false, false);
    this.animations.add('cower', ['GUBr/Cower0000', 'GUBr/Cower0001', 'GUBr/Cower0002', 'GUBr/Cower0003'], 16, true, false);

    this.energy = 2;
    this.baseStunDuration = 400;
    this.robotic = true;

    this.flipDir = false;

    this.body.drag.x = 500;
    
	this.updateFunction = function() {

	};

	this.Act = function() {
        if(EnemyBehavior.Player.IsVisible(this)) {

        	if(EnemyBehavior.Player.IsDangerous(this) || !this.CanAttack()) {
        		this.RunAway();

        	} else if(EnemyBehavior.Player.IsVulnerable(this) && EnemyBehavior.Player.IsNear(this, 180) && this.CanAttack() && frauki.body.onFloor()) {
	            this.Attack();

	        } else if(this.state === this.Blocking && !EnemyBehavior.Player.IsNear(this, 180)) {
	        	this.Charge();

        	} else {
        		this.Block();
        	}
        	
        } else {
            this.state = this.Idling;
            this.body.velocity.x = 0;
        }
    };

    this.LandHit = function() {
    	if(this.state === this.Blocking) {
    		this.timers.SetTimer('block_recoil', 200);
    	}
    };

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Attack = function() {
    	EnemyBehavior.FacePlayer(this);
    	this.state = this.Attacking;
    	this.timers.SetTimer('attacking', game.rnd.between(450, 500));

    	if(this.direction === 'left') {
			this.body.velocity.x = -400;
		} else {
			this.body.velocity.x = 400;
		}
    };

    this.RunAway = function() {
    	if(this.state !== this.Fleeing) {
    		this.body.velocity.y = -150;
    	}

    	this.timers.SetTimer('run_away', 1500);
    	this.state = this.Fleeing;
    	this.flipDir = false;

		EnemyBehavior.FaceAwayFromPlayer(this);

    };

    this.Block = function() {
    	this.state = this.Blocking;

    	this.timers.SetTimer('blocking', game.rnd.between(800, 1200));
    };

    this.Charge = function() {
    	this.state = this.Charging;
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		return true;
	};

	this.Fleeing = function() {
		this.PlayAnim('walk');

		//EnemyBehavior.FaceAwayFromPlayer(this);

		if(EnemyBehavior.Player.IsLeft(this)) {
			this.body.velocity.x = 150;
		} else if(EnemyBehavior.Player.IsRight(this)) {
			this.body.velocity.x = -150;
		}


		if(this.body.onWall() && this.timers.TimerUp('wall_timer')) {
			// this.flipDir = !this.flipDir;
			// this.timers.SetTimer('wall_timer', 500);

			this.Block();
		}

		if(this.flipDir) {
			this.body.velocity.x *= -1;
		}

		EnemyBehavior.FaceForward(this);

		if(EnemyBehavior.Player.IsNear(this, 60) && this.CanAttack()) {
			this.Attack();
		}

		if(this.timers.TimerUp('run_away')) {
			return true;
		} else {
			return false;
		}
	};

	this.Blocking = function() {
		this.PlayAnim('cower');

		EnemyBehavior.FacePlayer(this);

		if(EnemyBehavior.Player.IsNear(this, 60) && this.CanAttack()) {
			this.Attack();
		}

		if(this.timers.TimerUp('blocking')) {
			return true;
		} else {
			return false;
		}
	};

	this.Charging = function() {
		this.PlayAnim('walk');

		EnemyBehavior.FacePlayer(this);

		if(this.direction === 'left') {
			this.body.velocity.x = -200;
		} else if(this.direction === 'right') {
			this.body.velocity.x = 200;
		}

		if(this.body.onWall() || EnemyBehavior.Player.IsNear(this, 160) || frauki.body.center.x - this.body.center.x < 10) {
			return true;
		} else {
			return false;
		}
	};

	this.Attacking = function() {
		this.PlayAnim('attack');

		if(this.timers.TimerUp('attacking')) {
    		this.SetAttackTimer(800);
    		return true;
		} else {
			return false;
		}
	};

	this.Hurting = function() {
		this.PlayAnim('hit');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;

			this.RunAway();

			return true;
		}

		return false;
	};

	this.attackFrames = {


		'GUBr/Attack0003': {
			x: 26, y: 20, w: 50, h: 12,
			damage: 2,
			knockback: 0,
			priority: 1,
			juggle: 0
		}

	};

};
