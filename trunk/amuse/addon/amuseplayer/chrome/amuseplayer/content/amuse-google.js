var AmuseGoogle = {
/*
	* Input: html page data.
	* Input: limited size. no limit if 0.
	* Output: array of [trackname, searchurl];
	*/
	parseTrackList: function(resText, limit) {
		if(limit <= 0) limit = 65535;
		//e.g: http://www.google.cn/music/songstreaming?id=Sb0c7769ef3f34a57&output=xml&sig=b54c8dd70af5b16ff2b8a06a8b45c19f
		
		var trackIdReg = /<td class=\"Title BottomBorder\"><a[^>]*id%3D[^%]*/g;
		var trackNameReg = /<td class=\"Title BottomBorder\"><a[^>]*>[^<]*/g;
		var GOOGLE_PLAYER_KEY = "eca5badc586962b6521ffa54d9d731b0";
		var soundId;
		var soundName;
		var hash;
		var data = new Array();

		var trackIds = resText.match(trackIdReg);
		var trackNames = resText.match(trackNameReg);
		for(var i = 0; i < trackIds.length && i < limit; i++)
		{
			soundId = trackIds[i].split("%3D")[1];
			AmuseDebugOut("[loadListCallback_Google] soundId " + soundId);
			soundName = trackNames[i].split(">")[2];
			soundName = soundName.replace(/&#[\d]+;/g, function(e) {
										return String.fromCharCode(e.substring(2, e.length-1));}
										);
			hash = hex_md5(GOOGLE_PLAYER_KEY + soundId);
			AmuseDebugOut("[loadListCallback_Google] soundName " + soundName);
			AmuseDebugOut("[loadListCallback_Google] hash " + hash);
			data.push([	soundName,
									"http://www.google.cn/music/songstreaming?id=" + soundId + "&output=xml&sig=" + hash
								]);
		}
		
		AmuseDebugOut("[loadListCallback_Google] data.length " + data.length);
		return data;
	},	
	
	/*
	* Input: html page data.
	* Input: limited size. no limit if 0.
	* Output: array of [crypt url];
	*/
	parseTrack:function(resText, limit) {
		if(limit <= 0) limit = 65535;
		
	},
	
	parseRealMp3Url: function(resText) {	
		var mp3url;
		var regExp = /http:\/\/[^>]*.mp3/g;
		mp3url = resText.match(regExp);
		return mp3url;
	},
	loadSearchLyric: function(lyricUrl, encode) {
		var tmp;
		var data = [];
		AmuseDebugOutLyrics("===gooole===================" + lyricUrl);
		tmp = AmuseUtil.XHRSync(lyricUrl, encode);
		var lrc = tmp.match(/http:\/\/lyric.[\S]*.lrc/g);
		if(lrc) {
			data.push({url:tmp, data:AmuseUtil.XHRSync(lrc, encode)});
			AmuseDebugOutLyrics("[AmuseGoogle.loadSearchLyric] lrc:" + lrc);
		}
		//AmuseDebugOutLyrics(data[0].data);
		return data;
	},
};