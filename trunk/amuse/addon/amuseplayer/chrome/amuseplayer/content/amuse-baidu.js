var AmuseBaidu = {
	gSandbox:Components.utils.Sandbox("http://www.amuseplayer.com"),
	/*
	* Input: html page data.
	* Input: limited size. no limit if 0.
	* Output: array of [trackname, searchurl];
	*/
	parseTrackList: function(resText, limit) {
		if(limit <= 0) limit = 65535;
	
		var trackReg = /href=\"http:\/\/mp3.baidu.com\/m\?(f=ms&)?tn=baidump3&[\S]+\"/g;
		var tracks = resText.match(trackReg);
		var Idx = 0;
		var data = new Array();
		
		for(var i = 0; i < tracks.length && i < limit; i++)
		{
			if(tracks[i].indexOf("&word=") != -1)
			{
				var track = tracks[i].split("&word=")[1];
				track = track.split("\"")[0];
				var trackname = AmuseUtil.URL2Unicode('GB2312', track);
				
				var trackurl = tracks[i].split("href=")[1].split('"')[1];
				//AmuseDebugOut("trackurl:" + trackurl + "\n");
				//AmuseDebugOut("trackname:" + trackname + "\n");
				data.push([trackname, trackurl]);
				Idx++;										
			}
		}
		return data;
	},	
	
	/*
	* Input: html page data.
	* Input: limited size. no limit if 0.
	* Output: array of [[crypt url, track--full-name]];
	*/
	parseTrack:function(resText, limit, bKeepFullName) {
		if(limit <= 0) limit = 65535;
		var regExp = /http:\/\/box.zhangmen.baidu.com\/m\?gate=1&ct=\d+&tn=baidumt[^&]+&word=mp3[^\"]+/g;
		var urls = resText.match(regExp);
		if(urls == null){
			return;
		}
		var data = new Array();
		if(bKeepFullName) {
			for(var i = 0; i < urls.length && i < limit; i++)
			{
				var url = urls[i];
				var trackname;
				url = url.replace(/&lm=-1/g, "&lm=0")
				AmuseDebugOut("[AmuseBaidu.parseTrack] url: " + url);
				
				trackname = url.split('=baidumt,')[1];
				trackname = trackname.split('&word')[0];
				//AmuseDebugOut("[AmuseBaidu.parseTrack] trackname: " + encodeURIComponent(trackname));				
				data.push([trackname,url]);
			}
		} else {
			for(var i = 0; i < urls.length && i < limit; i++)
			{
				var url = urls[i];
				url = url.replace(/&lm=-1/g, "&lm=0")
				AmuseDebugOut("[AmuseBaidu.parseTrack] url: " + url);
				data.push(['',url]);
			}
		}
		return data;
	},
	parseRealMp3Url: function(resText) {	
			var regExp = /function G\(A\)[\s|\S]+disUrl\(\);/g;
			var urlscript = resText.match(regExp);

			if(urlscript == null) return null;
			
			AmuseDebugOut("[AmuseBaidu.parseRealMp3Url] " + urlscript +"\n"); 
			urlscript = urlscript[0].replace(/function G\(A\){return document\.getElementById\(A\)}/g,
																			 "function G(A){ var dummy={href:'',innerHTML:''}; return dummy;}"
																				);
			urlscript = urlscript.replace(/function sd\(\)[\s|\S]+Math\.random\(\)}/g, " ");
			urlscript = urlscript.replace(/B\.innerHTML=C/g, "return B.href;");
			AmuseDebugOut("[AmuseBaidu.parseRealMp3Url] urlscript:" + urlscript);
			urlscript = Components.utils.evalInSandbox(urlscript, AmuseBaidu.gSandbox);
			return urlscript;
		},
};
