AudioController = function() {
    var that = this;

    events.subscribe('play_sound', this.PlaySound, this);
    events.subscribe('stop_sound', this.StopSound, this);
    events.subscribe('play_music', this.PlayMusic, this);
    events.subscribe('stop_music', this.StopMusic, this);
    events.subscribe('stop_all_music', this.StopAllMusic, this);
    events.subscribe('fade_music', this.FadeMusic, this);

    events.subscribe('stop_attack_sounds', function() {
        for(var key in this.sounds) {
            if(key.indexOf('attack') > -1 && key !== 'attack_connect') {
                this.sounds[key].stop();
            }
        }
    }, this);

    this.sounds = {};
    this.music = {};

    this.currentSong = null;

    //load audio
    FileMap.Audio.forEach(function(audio) {
        that.sounds[audio.Name] = game.add.audio(audio.Name, audio.Volume, audio.Loop);
    });

    FileMap.Music.forEach(function(music) {

        that.music[music.Name] = game.add.audio(music.Name, music.Volume, music.Loop);
        var musicAudio = that.music[music.Name];

        that.music[music.Name].volumeStatic = music.Volume;

        for(var i = 0; i < music.Sections.length; i++) {
            var section = music.Sections[i];

            musicAudio.addMarker(section.name, section.start, section.end, music.Volume, section.loop);
        }

        musicAudio.onMarkerComplete.add(function(m) {
            if(m === 'intro' && musicAudio.volume > 0) {
                musicAudio.play('body');
            }
        });

        musicAudio.onLoop.add(function(m) {
            if(musicAudio.volume > 0) {
                musicAudio.play('body');
            }
        });
        
    });
};

AudioController.prototype.Update = function() {

    //if the section ends and the thing does not loop, advance the section index
    //and play the next section
    
};

AudioController.prototype.PlaySound = function(params) {
    var that = this;

    if(!!params.name && !!this.sounds[params.name]) {

        //if the sound is already playing and they dont want to start it over
        if(this.sounds[params.name].isPlaying && params.restart !== true) return;
        
        //if this is the damage sound, or an attack sound, stop all attack sounds
        if((params.name.indexOf('ouch') > -1 || params.name.indexOf('attack') > -1) && params.name !== 'attack_connect') {
            that.sounds['attack_slash'].stop();
            that.sounds['attack_stab'].stop();
            that.sounds['attack_dive_charge'].stop();
            that.sounds['attack_dive_fall'].stop();
            that.sounds['attack_dive_land'].stop();
        }
        
        this.sounds[params.name].play();
    }
};

AudioController.prototype.StopSound = function(params) {
    if(!!params.name && !!this.sounds[params.name]) {
        this.sounds[params.name].stop();
    }
}

AudioController.prototype.PlayMusic = function(params) {
    if(!!params.name && !!this.music[params.name] && !!this.music[params.name].play) {

        //this.music[params.name].stop();
        if(this.music[params.name].isPlaying) {
            if(!!this.music[params.name].fadeTween) this.music[params.name].fadeTween.stop();

            this.music[params.name].fadeTo(500, this.music[params.name].volumeStatic);
        } else {
            this.music[params.name].play('intro', 0, this.music[params.name].volumeStatic, false);
        }

        this.currentMusic = this.music[params.name];
    }
};

AudioController.prototype.StopMusic = function(params) {
    if(!!params.name && !!this.music[params.name] && !!this.music[params.name].stop) {
        this.music[params.name].pause();
    }
};

AudioController.prototype.StopAllMusic = function(params) {
    for(var key in this.music) {
        if(!this.music.hasOwnProperty(key)) continue;

        if(!!this.music[key] && this.music[key].isPlaying) {

            if(!!this.music[key].fadeTween && this.music[key].fadeTween.isRunning) {
                this.music[key].fadeTween.stop();
            }

            this.music[key].fadeOut(params.fadeOut || 500);
        }
    }
};

AudioController.prototype.FadeMusic = function( params) {
    //volume, duration

    if(!this.currentMusic) return;

    this.currentMusic.fadeTo(500, params.volume || 0);

    game.time.events.add(params.duration || 0, function() {
        audioController.currentMusic.fadeTo(500, audioController.currentMusic.volumeStatic);
    });
};

//NOTES
//Each element of the sounds object could be either a clip or an array. If
//it is an array, it will choose one at random to play
