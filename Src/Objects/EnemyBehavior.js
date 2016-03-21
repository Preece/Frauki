EnemyBehavior = {};

EnemyBehavior.SetProp = function(e, key, val) {
    if(!e.EBProps) e.EBProps = {};
    e.EBProps[key] = val;
};

EnemyBehavior.GetProp = function(e, key) {
    if(!e.EBProps) e.EBProps = {};
    return e.EBProps[key];
};

EnemyBehavior.WithinCameraRange = function(e) {
    var padding = 150;

    if(e.body.x > game.camera.x - padding &&
       e.body.y > game.camera.y - padding &&
       e.body.x < game.camera.x + game.camera.width + padding &&
       e.body.y < game.camera.y + game.camera.height + padding)
        return true;

    return false;
};

EnemyBehavior.FacingPlayer = function(e) {
    if((e.direction === 'left' && frauki.body.center.x < e.body.center.x + 20) ||
       (e.direction === 'right' && frauki.body.center.x > e.body.center.x - 20) )
        return true;

    return false;
};

EnemyBehavior.PathBlocked = function(e) {
    if(e.body.onWall()) {
        return true;
    } else {
        return false;
    }
}

EnemyBehavior.GetDirMod = function(e) {
    if(e.direction === 'left') {
        return -1;
    } else {
        return 1;
    }
};

EnemyBehavior.RollDice = function(sides, thresh) {
    var roll = Math.random() * sides;

    if(roll >= thresh)
        return true;
    else
        return false;
};


EnemyBehavior.Player = {};

EnemyBehavior.Player.IsNear = function(e, radius) {

    if(EnemyBehavior.Player.Distance(e) <= radius)
        return true;
    else
        return false;
};

EnemyBehavior.Player.Distance = function(e) {
    var distX = frauki.body.center.x - e.body.center.x;
    var distY = frauki.body.center.y - e.body.center.y;

    var dist = Math.sqrt(distX * distX + distY * distY);

    return dist;
};

EnemyBehavior.Player.Visibility = {};
EnemyBehavior.Player.IsVisible = function(e) {

    if(!EnemyBehavior.WithinCameraRange(e)) {
        return false;
    }

    //if the enemy is not cached, create an object for it
    if(!this.Visibility[e.z]) {
        this.Visibility[e.z] = { obj: e, timestamp: 0, result: false };
    }

    //determine how often the check should be redone
    var refreshTime = 2000;

    if(this.Visibility[e.z].result === true) {
        refreshTime = 3000;
    } else {
        var dist = EnemyBehavior.Player.Distance(e);

        if(dist < 100) {
            refreshTime = 500;
        } else if(dist < 200) {
            refreshTime = 1000;
        }

        if(EnemyBehavior.Player.MovingTowards(e)) {
            refreshTime /= 2;
        }
        
    }

    //if the timestamp has expired, check for visibility
    if(this.Visibility[e.z].timestamp + refreshTime < game.time.now) {
        var ray = new Phaser.Line(frauki.body.center.x, frauki.body.center.y, e.body.center.x, e.body.center.y);
        var collideTiles = Frogland.GetCurrentCollisionLayer().getRayCastTiles(ray, 4, true);

        this.Visibility[e.z].timestamp = game.time.now;

        this.Visibility[e.z].result = true;

        var i = collideTiles.length;
        while(i--) {
            if(collideTiles[i].index === 1) { 
                this.Visibility[e.z].result = false;
                break;
            }
        }
    }

    return this.Visibility[e.z].result;
};

EnemyBehavior.Player.IsBelow = function(e) {
    if(e.body.center.y < frauki.body.y && 
       e.body.center.x > frauki.body.center.x - 20 && 
       e.body.center.x < frauki.body.center.x + 20 && 
       !e.body.onFloor())
        return true;

    return false;
};

EnemyBehavior.Player.IsAbove = function(e) {
    if(e.body.center.y > frauki.body.y && 
       e.body.center.x > frauki.body.center.x - 20 && 
       e.body.center.x < frauki.body.center.x + 20)
        return true;

    return false;
};

EnemyBehavior.Player.IsStunned = function(e) {
    if(frauki.state === frauki.Stunned) {
        return true;
    }

    return false;
}

EnemyBehavior.Player.IsVulnerable = function(e) {

    if(frauki.state === frauki.Stunned) {
        return true;
    }

    if(!frauki.timers.TimerUp('frauki_invincible') || !frauki.timers.TimerUp('frauki_grace')) {
        return false;
    }

    if(frauki.state === frauki.Rolling) {
        return false;
    }

    var vulnerableFrames = [
        'Attack Fall0005',
        'Attack Fall0006',
        'Attack Fall0007',
        'Attack Fall0008',

        'Attack Front0006',
        'Attack Front0007',
        'Attack Front0008',
        'Attack Front0009',

        'Attack Jump0004',
        'Attack Jump0005',
        'Attack Jump0006',

        'Attack Overhead0008',
        'Attack Overhead0009',
        'Attack Overhead0010',
        'Attack Overhead0011',
        'Attack Overhead0012',

        'Attack Dive0000',
        'Attack Dive0001',
        'Attack Dive0002',
        'Attack Dive0003',
        'Attack Dive0004',
        'Attack Dive0005',

        'Attack Dive0019',
        'Attack Dive0020',
        'Attack Dive0021',
        'Attack Dive0022',
        'Attack Dive0023',
        'Attack Dive0024',
        'Attack Dive0025',
        'Attack Dive0026',

        'Attack Stab0000',
        'Attack Stab0001',

        'Attack Stab0011',
        'Attack Stab0012',
        'Attack Stab0013',
        'Attack Stab0014',
        'Attack Stab0015',
        'Attack Stab0016',
        'Attack Stab0017',
    ];

    if(vulnerableFrames.indexOf(frauki.animations.currentFrame.name) > -1) {
        return true;
    }

    if(frauki.state === frauki.Falling && frauki.states.hasFlipped) {
        return true;
    }

    //if none of this determined a vulnerable/invulnerable state, then just attack
    return true;
};

EnemyBehavior.Player.DirMod = function(e) {

    return frauki.body.center.x < e.body.center.x ? 1 : -1;
};

EnemyBehavior.Player.IsDangerous = function(e) {
    if(EnemyBehavior.Player.IsAbove(e) && frauki.state === frauki.AttackDiveCharge) {
        return true;
    }

    if(frauki.InPreAttackAnim()) {
        return true;
    } 

    if(frauki.Attacking() && frauki.currentAttack.damage > 0) {
        return true;
    }
    
    return false;
};

EnemyBehavior.Player.MovingTowards = function(e) {
    if(frauki.body.center.x < e.body.x && frauki.body.velocity.x > 0) {
        return true;
    } else if(frauki.body.center.x > e.body.x && frauki.body.velocity.x < 0) {
        return true;
    } else {
        return false;
    }
};



EnemyBehavior.FacePlayer = function(e) {
    if(e.body.center.x < frauki.body.center.x) {
        e.SetDirection('right');
    } else {
        e.SetDirection('left');
    }
};

EnemyBehavior.FaceAwayFromPlayer = function(e) {
    if(e.body.center.x < frauki.body.center.x) {
        e.SetDirection('left');
    } else {
        e.SetDirection('right');
    }
};

EnemyBehavior.ChargeAtPlayer = function(e, speed) {

    game.physics.arcade.moveToXY(e, frauki.body.center.x, frauki.body.center.y, speed);
};

EnemyBehavior.WalkToPlayer = function(e, speed) {
    e.body.velocity.x = speed * EnemyBehavior.Player.DirMod(e) * -1;
    EnemyBehavior.FacePlayer(e);

    if(EnemyBehavior.PathBlocked(e)) {
        EnemyBehavior.JumpCurb(e);
    }

    return true;
};

EnemyBehavior.JumpCurb = function(e) {
    if(e.body.onFloor()) {
        e.body.velocity.y = -200;
        EnemyBehavior.SetProp(e, 'jump_attempted', true);
    }
};

EnemyBehavior.JumpToPoint = function(e, x, y) {
    var duration = 0.65;

    e.body.velocity.x = (x - e.body.center.x) / duration;
    e.body.velocity.y = (y + -0.5 * game.physics.arcade.gravity.y * duration * duration - e.body.center.y) / duration;
};