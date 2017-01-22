ScriptRunner = function() {

};

ScriptRunner.run = function(name) {
	//find the script, and then execute each item sequentially
	if(!!this.scripts[name]) {

		//chain all the commands together by informing each of the next one
		for(var i = 0; i < this.scripts[name].length - 1; i++) {
			this.scripts[name][i].nextCommand = this.scripts[name][i + 1];
		}

		//execute the first command in the chain. It will call the following commands
		this.executeCommand(this.scripts[name][0]);

	} else {
		console.log('Script with name ' + name + ' was not found');
	}
};

ScriptRunner.executeCommand = function(cmd) {
	var that = this;

	if(!cmd) return;

	console.log(cmd);

	if(cmd.name === 'wait') {
		game.time.events.add(cmd.props.amount, function() { that.executeCommand(cmd.nextCommand); });

	} else {
		events.publish(cmd.name, cmd.props );

		this.executeCommand(cmd.nextCommand);
	}
};

ScriptRunner.scripts = [];

ScriptRunner.scripts['demo_Baton'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Oh neat! This weapon let\'s me throw my energy out like a boomerang. The more energy I have, the strong it will be!', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'wait', props: { amount: 500 } },
	{ name: 'activate_weapon', props: { activate: true, override: true } },
	{ name: 'wait', props: { amount: 1500 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Stab'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Whee! Now if I attack while rolling, I can shish-kebab some baddies.', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'wait', props: { amount: 500 } },
	{ name: 'player_roll', props: {} },
	{ name: 'wait', props: { amount: 200 } },
	{ name: 'player_slash', props: {} },
	{ name: 'wait', props: { amount: 1500 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Dive'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Whoa... Down attacking in the air now lets me do a power attack', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'wait', props: { amount: 500 } },
	{ name: 'player_jump', props: { jump: true } },
	{ name: 'wait', props: { amount: 200 } },
	{ name: 'player_crouch', props: { crouch: true } },
	{ name: 'player_slash', props: {} },
	{ name: 'wait', props: { amount: 1500 } },
	{ name: 'player_crouch', props: { crouch: false } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Health'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Yay, more health!', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Apple'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Apples are tasty. If I find one, I can eat it with the right shoulder button to feel better.', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'wait', props: { amount: 500 } },
	{ name: 'player_heal', props: { charging: true } },
	{ name: 'wait', props: { amount: 1200 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Will'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'This must be the prism thing of... whatever... guess I should take it back to that lady.', portrait: 'Neutral' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_intro'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Oh, hello there...', portrait: 'Displeased' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 250 } },
	{ name: 'show_text', props: { text: 'It\'s been a long time since I\'ve seen... anyone...', portrait: 'Neutral' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 500 } },
	{ name: 'show_text', props: { text: 'Would you mind helping me out of this place? All you need to do is bring the prism shard of Will.', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 750 } },
	{ name: 'show_text', props: { text: 'Oh right... It looks like a big red jewel. You can\'t miss it.', portrait: 'Neutral' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 750 } },
	{ name: 'show_text', props: { text: 'Please hurry... I\'ve been in here a long time.', portrait: 'Dazed' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_shard'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'You found it!! You beautiful little person thing!!', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 250 } },
	{ name: 'show_text', props: { text: 'Now just walk up to the door and it will open. Freedom... finally...', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_hurt'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "OUCH! What's your problem!? Don't do that again.", portrait: 'Displeased' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];