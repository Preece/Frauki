TriggerController = function() {

    this.timers = new TimerUtil();

    this.triggerLayers = {};
  
};

TriggerController.prototype.triggers = {};

TriggerController.prototype.Create = function(map) {
};

TriggerController.prototype.CreateTriggers = function(layer) {

    this.triggerLayers['Triggers_' + layer] = map.objects['Triggers_' + layer];

    for(var i = 0; i < this.triggerLayers['Triggers_' + layer].length; i++) {

        var trigger = this.triggerLayers['Triggers_' + layer][i];

        trigger.once =  trigger.properties.once === 'true' ? true : false;
        delete trigger.properties.once;

        trigger.x = Math.floor(trigger.x);
        trigger.y = Math.floor(trigger.y);
        trigger.width = Math.floor(trigger.width);
        trigger.height = Math.floor(trigger.height);

        trigger.enterFired = false;
        trigger.stayFired = false;
        trigger.exitFired = false;

        trigger.playerInside = false;

        if(!!this.triggers[trigger.name]) {
            trigger.enter = this.triggers[trigger.name].enter;
            trigger.stay = this.triggers[trigger.name].stay;
            trigger.exit = this.triggers[trigger.name].exit;
        } else {
            console.log('Trigger with name ' + trigger.name + ' was not found');
        }
    }
};

TriggerController.prototype.Update = function(currentLayer) {

    currentLayer = this.triggerLayers['Triggers_' + currentLayer];

    //loop through all triggers on the current layer and see if any in
    //the active zone around or within the camera

    var activeTriggers = [];

    var i = currentLayer.length;
    while(i--) {
        var trigger = currentLayer[i];

        //if the player intersects with this trigger
        if(this.Intersects(frauki, trigger)) {

            //if the flag is unset, they just entered the trigger
            if(trigger.playerInside === false) {

                if(!trigger.enterFired || !trigger.once) {
                    //so call the enter function
                    if(!!trigger.enter) trigger.enter(trigger.properties);

                    trigger.enterFired = true;
                }

                //and set the flag
                trigger.playerInside = true;

            //if the flag is already set, they are still in the trigger
            } else {
                if(!trigger.stayFired || !trigger.once) {
                    //call the stay function
                    if(!!trigger.stay) trigger.stay(trigger.properties);

                    trigger.stayFired = true;
                }
            }

        //if the player does not intersect with the trigger
        } else {

            //if the flag is set, they just exited the trigger
            if(trigger.playerInside === true) {

                if(!trigger.exitFired || !trigger.once) {
                    //so call the exit function of the trigger
                    if(!!trigger.exit) trigger.exit(trigger.properties);

                    trigger.exitFired = true;
                }

                //and unset the flag
                trigger.playerInside = false;
            }
        }
    }
};

TriggerController.prototype.Intersects = function(body, trigger) {
    if (body.right <= trigger.x) { return false; }
    if (body.bottom <= trigger.y) { return false; }
    if (body.position.x >= trigger.width + trigger.x) { return false; }
    if (body.position.y >= trigger.height + trigger.y) { return false; }
    return true;
}

/* TRIGGER TEMPLATE

{
    "name":"music_surface_ruins",
    "height":293.333333333333,
    "width":85.3333333333335,
    "x":2921.33333333333,
    "y":979.333333333333,

    "properties": {
        "once":"true"
    },

}

*/
