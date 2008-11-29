var AmuseSound = {
	tryLoadCnt:0,
	tryUrlCnt:0,
	s_id:null,
	s_bytesLoaded:0,
	s_bytesTotal:0,
	s_positon:0,
	s_duration:0,
	s_state:0,
	s_bStop: false,
	s_volume: 100,
	s_MaxTryCnt: 3,
	timer:null,
	onplay: function() {
		AmuseSound.bytesLoaded = this.bytesTotal;
		AmuseSound.bytesTotal = 0;
	},
	
	setVolume: function(v) {
		if(AmuseSound.s_id != null && soundManager.getSoundById(AmuseSound.s_id))
		{
			AmuseSound.s_volume = v;
			soundManager.setVolume(AmuseSound.s_id, AmuseSound.s_volume);
		}
	},
	
	stop: function() {
		if(AmuseSound.s_id != null && soundManager.getSoundById(AmuseSound.s_id))
		{
			soundManager.stop(AmuseSound.s_id);
			AmuseSound.s_bStop = !AmuseSound.s_bStop;
			if(AmuseSound.s_bStop == false)
			{
				soundManager.resume(AmuseSound.s_id);
			}
		}
		
	},
	
	setTryCnt: function(v) {
		AmuseSound.s_MaxTryCnt = v;
	},
	
	reset: function() {
		if(AmuseSound.s_id != null && soundManager.getSoundById(AmuseSound.s_id))
		{
			soundManager.destroySound(AmuseSound.s_id);
			AmuseSound.s_id = null;
			AmuseSound.stopzombieKiller();
			g_ProgressBar.updateProgress(0.0, "connecting...");
		}
	},
	
	/* For killing the low speed Sound object.
	   SoundManager is lack of timing out msg/callback when loading a low speed mp3 url.   
	   Just polling it by myself.
	 */
	stopzombieKiller: function() {
		clearTimeout(AmuseSound.timer);
	},
	
	startzombieKiller: function(soundID) {
		
		var soundobj = null;
		
		AmuseSound.s_id = soundID;
		AmuseSound.tryLoadCnt = 0;
		AmuseSound.tryUrlCnt = 0;
		AmuseSound.zombieKiller();
	},
	
	zombieKiller: function() {
		
		soundobj = soundManager.getSoundById(AmuseSound.s_id);
		if(soundobj)
		{
			AmuseDebugOut('[zombieKiller]readyState:' +soundobj.readyState);
			/*
			0 = uninitialised
	    	1 = loading
	    	2 = failed/error
	    	3 = loaded/success
			*/
			AmuseSound.s_state = soundobj.readyState;
			AmuseDebugOut('[zombieKiller]readyState:' +soundobj.readyState);
			switch(soundobj.readyState)
			{
			case 0:
				break;
			case 1:
				AmuseDebugOut('[zombieKiller]bytesLoaded:' + soundobj.bytesLoaded);
				if(AmuseSound.s_bytesLoaded == soundobj.bytesLoaded || soundobj.bytesLoaded == null)
				{
					AmuseSound.tryLoadCnt++;
					AmuseDebugOut('[zombieKiller]AmuseSound.tryLoadCnt:' + AmuseSound.tryLoadCnt);
				}
				else
				{
					//AmuseSound.tryLoadCnt = 0;
					AmuseSound.s_bytesLoaded = soundobj.bytesLoaded;
				}	
				break;
			case 2:
				break;
			case 3:
				if(soundobj.bytesLoaded == null || soundobj.duration == 0)
				{
					AmuseSound.tryLoadCnt = AmuseSound.s_MaxTryCnt;
					AmuseDebugOut('[zombieKiller]AmuseSound.tryLoadCnt:' + AmuseSound.tryLoadCnt);
					
				}
				else
				{
					AmuseSound.s_duration = soundobj.duration;
				}
				AmuseDebugOut('[zombieKiller]duration:' + soundobj.duration);
				AmuseDebugOut('[zombieKiller]AmuseSound.s_duration:' + AmuseSound.s_duration);
				break;
			}
			
			if(AmuseSound.tryLoadCnt >= AmuseSound.s_MaxTryCnt)
			{
				soundManager.destroySound(AmuseSound.s_id);
				if(AmuseSound.tryUrlCnt < 3)
				{
					AmuseAgent.loadMp3(AmuseSound.s_id);
					AmuseSound.tryUrlCnt++;
					g_ProgressBar.updateProgress(0.0, "Oops...");
				}
				else
				{
					AmuseAgent.playNext();
					g_ProgressBar.updateProgress(0.0, "Oops...");
				}
			}
			
			AmuseSound.timer = setTimeout(AmuseSound.zombieKiller, 10000);	
		}
		else
		{
			AmuseDebugOut('[zombieKiller] no sound obj.');
			AmuseAgent.playNext();
			AmuseSound.timer = setTimeout(AmuseSound.zombieKiller, 10000);	
		}
	},
	
	createSound: function(soundID, url, bAutoPlay) {
		AmuseDebugOut("createSound:"+ url);
		AmuseSound.stopzombieKiller();
		var sId = soundManager.createSound(
		{
			id:soundID,
			url:url,
			autoPlay:bAutoPlay,
			volume:AmuseSound.s_volume,
			autoLoad:true,
		});	
		soundManager.setVolume(soundID, AmuseSound.s_volume);
		AmuseSound.startzombieKiller(soundID);
	},
	
	playSound: function(id) {
		AmuseSound.tryLoadCnt = 0;
		if(soundManager.getSoundById(id))
		{
			soundManager.setVolume(AmuseSound.s_id, AmuseSound.s_volume);
			soundManager.play(id);
		}
	},
	pauseSound: function(id) {
		if(soundManager.getSoundById(id))
		{
			soundManager.pause(id);
		}
	},
	
	whileloading: function() {
			//AmuseDebugOut('whileloading: bytesLoaded: ' + this.bytesLoaded + '  bytesTotal:' + this.bytesTotal);
			/* make CPU loading happy */
			if(this.bytesLoaded & 0x2000)
			{
				g_ProgressBar.updateProgress(this.bytesLoaded / this.bytesTotal, 'loading:' + parseInt(this.bytesLoaded / 1024) + ':' + parseInt(this.bytesTotal / 1024) + ' KB');
			}
	},
	
	whileplaying_obsolete:function() {
	},
	
	whileplaying:function() {
		//AmuseDebugOut('sound '+this.sID+' playing, '+this.position+' of '+this.duration);
		if(this.position == this.duration)
		{
			AmuseDebugOut('sound ' + this.sID + ' Ooops!');
			AmuseSound.tryLoadCnt++;
			//AmuseDebugOut('sound ' + AmuseSound.tryLoadCnt + ' Ooops!');
		}
		else
		{
			/* make CPU loading happy */
			if(this.position & 0x2000)
			{
				//AmuseDebugOut("[whileplaying]g_ProgressBar:" + g_ProgressBar);
				g_ProgressBar.updateProgress(this.position / this.duration, 'playing:' + parseInt(this.position / 1000) + ":" + parseInt(this.duration / 1000) + ' Sec.');
			}
		}
	},
	
	onfinish:function() {
		//alert(this.sID + " is finished!");
		//this.play();
		soundManager.destroySound(this.sID);
		AmuseAgent.playNext();
	},
	onload: function() {
		/*
		0 = uninitialised
    	1 = loading
    	2 = failed/error
    	3 = loaded/success
		*/
		if(this.readyState == 2) {
			/* try next MP3 url. */
			soundManager.destroySound(this.sID);
			AmuseAgent.loadMp3(this.sID);
		}
		
	}
}

soundManager.url = './soundmanager2/soundmanager2.swf'; // override default SWF url
soundManager.debugMode = false;
soundManager.consoleOnly = false;	
soundManager.onload = function()
{
	soundManager.defaultOptions = {
  'autoLoad': true,             // enable automatic loading (otherwise .load() will be called on demand with .play()..)
  'stream': true,                // allows playing before entire file has loaded (recommended)
  'autoPlay': true,             // enable playing of file as soon as possible (much faster if "stream" is true)
  'onid3': null,                 // callback function for "ID3 data is added/available"
  'onload': AmuseSound.onload,                // callback function for "load finished"
  'whileloading': AmuseSound.whileloading,          // callback function for "download progress update" (X of Y bytes received)
  'onplay': AmuseSound.onplay,                // callback for "play" start
  'onpause': null,               // callback for "pause"
  'onresume': null,              // callback for "resume" (pause toggle)
  'whileplaying': AmuseSound.whileplaying,          // callback during play (position update)
  'onstop': null,                // callback for "user stop"
  'onfinish': AmuseSound.onfinish,              // callback function for "sound finished playing"
  'onbeforefinish': null,        // callback for "before sound finished playing (at [time])"
  'onbeforefinishtime': 5000,    // offset (milliseconds) before end of sound to trigger beforefinish..
  'onbeforefinishcomplete': null,// function to call when said sound finishes playing
  'onjustbeforefinish': null,    // callback for [n] msec before end of current sound
  'onjustbeforefinishtime': 200, // [n] - if not using, set to 0 (or null handler) and event will not fire.
  'multiShot': true,             // let sounds "restart" or layer on top of each other when played multiple times..
  'position': null,		 // offset (milliseconds) to seek to within loaded sound data.
  'pan': 0,                      // "pan" settings, left-to-right, -100 to 100
  'volume': 100                  // AmuseSound-explanatory. 0-100, the latter being the max.
	};
	
}
