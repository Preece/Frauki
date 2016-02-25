
TriggerController.prototype.triggers['open_door'] = {
	enter: function(params) {

	},

	stay: function(params) {
		//if there are no enemies within the region
	},

	exit: function(params) {
	}
}

TriggerController.prototype.triggers['return_shard'] = {
	enter: function(params) {
		if(GetCurrentShardType() === 'Will') {
			var shard = frauki.carriedShard;

			shard.returnedToChurch = true;
			DropShard(shard);

			//122 179

			var placementTween = game.add.tween(shard).to({x: 122 * 16 + 1, y: 179 * 16 + 14}, 2000, Phaser.Easing.Exponential.InOut, true);
			placementTween.onComplete.add(function() {
				GameData.SaveShardPositions();
			});
			//Frogland.effectsGroup.addChild(shard);
		}
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['soccer_goal'] = {
	enter: function(params) {
		events.publish('open_door', { door_name: 'soccer_goal' });
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['heal_to_open_door'] = {
	enter: function(params) {
		//if they have fewer than max apples, they already healed so just open up.
		//or, if they are at full health and cant heal
		if(energyController.GetApples() < GameData.GetMaxApples() || energyController.GetHealth() === energyController.GetMaxHealth()) {
			events.publish('open_door', { door_name: 'heal_trainer' });
			this.appleUsed = true;
		}
	},

	stay: function(params) {
		//keep checking for them to use an apple
		if(energyController.GetApples() < GameData.GetMaxApples() && !this.appleUsed) {
			events.publish('open_door', { door_name: 'heal_trainer' });
			this.appleUsed = true;
		}
	},

	exit: function(params) {
	}
};