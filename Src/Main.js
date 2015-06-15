var Main = new Phaser.State();

Main.create = function() {

    cameraController = new CameraController();
    inputController = new InputController();
    effectsController = new EffectsController();
    energyController = new EnergyController();
    audioController = new AudioController();
    weaponController = new WeaponController();
    triggerController = new TriggerController();
    scriptRunner = new ScriptRunner();
    timerUtil = new TimerUtil();

    energyController.Create();
    triggerController.Create(map);

    this.restarting = false;

    Frogland.Create();
    
    projectileController = new ProjectileController();
};

Main.update = function() {

    frauki.UpdateAttackGeometry();
    
    Frogland.Update();

    cameraController.UpdateCamera();
    inputController.UpdateInput();
    effectsController.UpdateEffects();
    energyController.UpdateEnergy();
    weaponController.Update();
    projectileController.Update();
    triggerController.Update(Frogland.currentLayer);

};

Main.render = function() {
    //game.debug.body(frauki);
    //game.debug.body(frauki.attackRect);

    // this.objectGroup_3.forEach(function(o) {
    //     game.debug.body(o);
    // });

    /*projectileController.projectiles.forEach(function(o) {
        game.debug.body(o);
    });*/

    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
};

Main.Restart = function() {
    if(this.restarting === true) {
        return;
    }

    events.publish('stop_all_music'); 
    events.publish('play_music', { name: 'Gameover' } ); 

    this.restarting = true;
    game.time.slowMotion = 5;
    var fadeOutTween = game.add.tween(game.world).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);

    fadeOutTween.onComplete.add(function() {
        Main.ChangeLayer(3);
        frauki.body.x = 100; //fraukiSpawnX;
        frauki.body.y = 100; //fraukiSpawnY;
        energyController.energy = 15;
        energyController.neutralPoint = 15;
        game.time.slowMotion = 1;
        game.world.alpha = 1;

        Main.restarting = false;

        Main['objectGroup_4'].forEach(function(e) {
            if(!!e.Respawn) {
                e.Respawn();
            }
        });

        Main['objectGroup_3'].forEach(function(e) {
            if(!!e.Respawn) {
                e.Respawn();
            }
        });

        Main['objectGroup_2'].forEach(function(e) {
            if(!!e.Respawn) {
                e.Respawn();
            }
        });
    });
};
