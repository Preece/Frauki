ScriptRunner = {};

ScriptRunner.create = function() {
	this.waitEvent = null;
	this.currentCommand = null;
	this.waitTime = 200;

	events.subscribe('text_hidden', function(params) {
		if(!!this.waitEvent) {
			game.time.events.remove(this.waitEvent);
			this.waitEvent = null;

			if(!!this.currentCommand && !!this.currentCommand.nextCommand) {
				this.executeCommand(this.currentCommand.nextCommand);
			}
		}
	}, this);
};

ScriptRunner.run = function(name, params) {
	//find the script, and then execute each item sequentially
	if(!!this.scripts[name]) {

		//chain all the commands together by informing each of the next one
		for(var i = 0; i < this.scripts[name].length - 1; i++) {
			this.scripts[name][i].nextCommand = this.scripts[name][i + 1];
		}

		//execute the first command in the chain. It will call the following commands
		this.executeCommand(this.scripts[name][0]);

	} else {
		console.warn('Script with name ' + name + ' was not found');
	}
};

ScriptRunner.executeCommand = function(cmd) {
	var that = this;

	this.currentCommand = cmd;
	this.waitEvent = null;

	if(!cmd) return;

	if(cmd.name === 'wait') {
		this.waitEvent = game.time.events.add(cmd.props.amount, function() { that.executeCommand(cmd.nextCommand); });
	} 
	else {
		if(typeof cmd.func === 'function') {
			cmd.func.apply(null, cmd.props);
		} else {
			events.publish(cmd.name, cmd.props);
		}

		this.executeCommand(cmd.nextCommand);
	}
};

ScriptRunner.scripts = [];
