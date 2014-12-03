Enemy.prototype.types['CreeperThistle'] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ["CreeperThistle/CreeperThistle0000"], 10, true, false);
    this.animations.add('shit', ["CreeperThistle/CreeperThistle0000"], 10, true, false);

    this.energy = 1;
    this.body.immovable = true;

    this.state = this.Idling;

	this.updateFunction = function() {
		
	};

	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}

	    this.timers.SetTimer('hit', 800);

	    this.state = this.Hurting;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');
	};

	this.Hurting = function() {
		this.PlayAnim('idle');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};