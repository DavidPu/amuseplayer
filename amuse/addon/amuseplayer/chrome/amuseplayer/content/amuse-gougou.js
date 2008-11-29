var AmuseGougou = {
/*
	* Input: html page data.
	* Input: limited size. no limit if 0.
	* Output: array of [trackname, searchurl];
	*/
	parseTrackList: function(resText, limit) {
		if(limit <= 0) limit = 65535;

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
	
	},
};