var AmuseYahoo = {
/*
	* Input: html page data.
	* Input: limited size. no limit if 0.
	* Output: array of [trackname, searchurl];
	*/
	parseTrackList: function(resText, limit) {
		if(limit <= 0) limit = 65535;

		//http://www.yahoo.cn/s?v=music&p=%E5%8C%97%E4%BA%AC%E6%AC%A2%E8%BF%8E%E4%BD%A0&source=ysmt_laoy_r&pid=bd_mp3
		var trackReg = /http:\/\/www.yahoo.cn\/s[^\"]+/g;
		var data = [];
		var track = null;
		while( (track = trackReg.exec(resText)) != null)
		{
			//AmuseDebugOut("[loadListCallback_Yahoo]trackurl:" + track[0]);
			//search mp3 type only.
			var trackname = track[0].match(/&p=[^&]+/g);
			var trackurl = track[0] += "&x=mp3%3Aalls";
			
			trackname = decodeURIComponent(trackname[0].split("=")[1]);
			//AmuseDebugOut("[loadListCallback_Yahoo]trackname:" + trackname);
			//AmuseDebugOut("[loadListCallback_Yahoo]trackurl:" + trackurl);
			data.push([trackname,trackurl]);
		}
		return data;
	},	
	
	/*
	* Input: html page data.
	* Input: limited size. no limit if 0.
	* Output: array of [crypt url];
	*/
	parseTrack:function(resText, limit) {
		if(limit <= 0) limit = 65535;
		
		//http://i.music.cn.yahoo.com/down.php?sid=.24.117.71.108.76.22.16.109.100.126.249.
		// 228.233.155.227.158.227.153.130.221.93.108.72.136.206.249.247.16.96.30.122.84.124. 
		// 78.35.58.53.115.72.4.85.55.2.42.74.111.25.8.13.90.121.31.8.27.23.80.70.41.30.16.66.
		// 45.91.38.66.67.8.30.47.3.63.83.18.18.19.90.29.5.124.100.94.71.95.90.85.96.101.90.64.
		// 4.36.73.8.29.90.110.31.68.89.127.65.90.84.109.112.66.94.67.75.94.66.20.19.30.30.114.123
		// .117.10.21.117&link=0&mimes=5&speeds=133229&sizes=6799326&kids=107529&kid=107529|c01a
		// 7d153af25aa23731e05078d1784e&lrcids=0&ranges=3&pid=bd_mp3
		
		var regExp = /http:\/\/i.music.cn.yahoo.com\/down.php\?sid=[^\"|^\']+/g;
		var urls = resText.match(regExp);
		if(urls == null)
		{
			return;
		}
		var data = new Array();
		/* step by 4 to skip duplicated urls. */
		for(var i = 0; i < urls.length && i < limit * 4; i+=4)
		{
			var url = urls[i];
			AmuseDebugOut("[loadTrackCallback_Yahoo] url: " + url);
			
			data.push(['', url]);
		}
		return data;
	},
	parseRealMp3Url: function(resText) {
		var regExp = /http:\/\/[^\"|^\'|\s]+mp3/g;
		var url = resText.match(regExp);
		var mp3url;
		
		if(url == null) return null;
		mp3url = url[0];
		AmuseDebugOut("[getRealUrlCallback_Yahoo] " + mp3url +"\n"); 
		return mp3url;
		},
};