Enemy.prototype.types['KR32'] =  function() {

	this.body.setSize(15, 60, 0, -68);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['KR32/Stand0000'], 10, true, false);
    this.animations.add('block', ['KR32/Block0000'], 10, true, false);
    this.animations.add('windup', ['KR32/Attack0000'], 5,  false, false);
    this.animations.add('attack', ['KR32/Attack0001', 'KR32/Attack0002', 'KR32/Attack0003', 'KR32/Attack0004', 'KR32/Attack0005', 'KR32/Attack0006', 'KR32/Attack0007', 'KR32/Attack0008'], 18, false, false);

    this.energy = 50;
    this.weight = 0.8;
    /*
    this.damage = 5;
    this.baseStunDuration = 500;
    this.poise = 10;
    */

    this.body.drag.x = 800;
    
	this.updateFunction = function() {

	};

	this.CanCauseDamage = function() { return false; }
	this.CanChangeDirection = function() { return false; }
	this.Vulnerable = function() { 
		if(this.Attacking())
			return false;
		else 
			return true;
	};


	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}

	    this.timers.SetTimer('hit', 800);

	    this.state = this.Hurting;
	};

	this.Die = function() {
        this.anger = 1;
        this.state = this.Idling;
    };

    this.Attack = function() {
    	if(!this.timers.TimerUp('attack')) {
    		return;
    	}

    	this.state = this.Windup;

    	this.timers.SetTimer('attack', 1000);
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsVisible()) {
			this.state = this.Blocking;
		}
	};

	this.Blocking = function() {
		this.PlayAnim('block');

		if(frauki.body.center.x < this.body.center.x) {
			this.SetDirection('left');
		} else {
			this.SetDirection('right');
		}

		if(!this.PlayerIsVisible()) {
			this.state = this.Idling;
		}

		if(this.PlayerDistance() < 120) {
			this.Attack();
		}

	};

	this.Windup = function() {
		this.PlayAnim('windup');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Slashing;

			if(this.direction === 'left') {
				this.body.velocity.x = -500;
			} else {
				this.body.velocity.x = 500;
			}
		}
	}

	this.Slashing = function() {
		this.PlayAnim('attack');

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Blocking;
		}
	}

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

	this.attackFrames = {
		'KR32/Block0000': {
			x: 18, y: -8, w: 10, h: 40,
			damage: 0,
			knockback: 0,
			priority: 1,
			juggle: 0
		},

		'KR32/Attack0001': {
			x: 40, y: -8, w: 25, h: 60,
			damage: 3,
			knockback: 0.5,
			priority: 1,
			juggle: 0
		},

		'KR32/Attack0002': {
			x: 42, y: -8, w: 25, h: 60,
			damage: 2,
			knockback: 0.3,
			priority: 1,
			juggle: 0
		},

		'KR32/Attack0003': {
			x: 43, y: -8, w: 25, h: 60,
			damage: 2,
			knockback: 0.3,
			priority: 1,
			juggle: 0
		}

	};

};
