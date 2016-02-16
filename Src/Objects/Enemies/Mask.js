Enemy.prototype.types['Mask'] =  function() {

	this.body.setSize(20, 40, 0, -12);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Mask/Mask0000'], 10, true, false);
    this.animations.add('shit', ['Hop0000'], 10, true, false);

    this.energy = 2;
    this.damage = 1;
    /*
    this.baseStunDuration = 500;
    this.poise = 10;
    */
    
	this.updateFunction = function() {

	};

	this.CanCauseDamage = function() { return true; }

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

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(EnemyBehavior.Player.IsVisible(this)) {
			this.body.maxVelocity.x = 200;
		} else {
			this.body.maxVelocity.x = 100;
		}

		if(this.direction === 'left') {
			this.body.acceleration.x = -1000;

			if(this.body.onWall()) {
				this.SetDirection('right');
			}
		} else if(this.direction === 'right') {
			this.body.acceleration.x = 1000;

			if(this.body.onWall()) {
				this.SetDirection('left');
			}
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
