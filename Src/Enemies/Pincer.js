Enemy.prototype.types['Pincer'] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Pincer/Idle0001'], 10, true, false);
    this.animations.add('shit', ['Pincer/Idle0001'], 10, true, false);

    this.body.gravity.y = -800;

    this.body.maxVelocity.y = 300;
    this.body.maxVelocity.x = 300;

    //this.body.bounce.set(0);

    //create the body sections
    this.bodies = [];
    this.bodies.push(game.add.sprite(this.body.center.x, this.body.center.y, 'EnemySprites', 'Pincer/Idle0003'));
    //game.physics.enable(this.bodies[0], Phaser.Physics.ARCADE);

    /*
    this.weight = 0.5;
    this.energy = 5;
    this.damage = 5;
    this.baseStunDuration = 500;
    this.poise = 10;
    */
    
	this.updateFunction = function() {
		this.bodies[0].x = this.body.center.x;
		this.bodies[0].y = this.body.center.y;
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

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsVisible()) {
			this.state = this.Chasing;
		}

	};

	this.Chasing = function() {
		this.PlayAnim('idle');

		var normVel = this.body.velocity.normalize();

		var dist = new Phaser.Point(this.body.center.x - frauki.body.center.x, this.body.center.y - frauki.body.center.y);

		dist = dist.normalize();

		normVel = Phaser.Point.interpolate(normVel, dist, 0.9);

		this.body.acceleration = normVel.setMagnitude(400);

		this.body.acceleration.x *= -1;
		this.body.acceleration.y *= -1;

		this.body.velocity.setMagnitude(150);

		if(!this.PlayerIsVisible()) {
			this.state = this.Idling;
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
