//////////////////
var test_lyric = "[ti:彩虹]\n"+
"[ar:许巍]\n"+
"[al:]\n"+
"[by:fyes(Feiyes.net)]\n"+
"[00:00.76]彩虹\n"+
"[00:04.85]词曲：许巍\n"+
"[00:31.09]每当音乐声响起\n"+
"[00:34.70]心就宛如一道彩虹\n"+
"[00:38.02]我多想拥抱着你\n"+
"[00:41.47]让你感觉不到风雨\n"+
"[00:44.87]在缤纷的节奏里\n"+
"[00:48.20]让你感觉快乐简单\n"+
"[00:51.69]在温暖的春天里\n"+
"[00:55.03]把你的心再次唤醒\n"+
"[01:01.99]每当你望着远方\n"+
"[01:08.66]别忘了爱在身边\n"+
"[01:15.52]我多想让你醒来\n"+
"[01:22.35]我多想给你温暖\n"+
"[01:25.96]在我珍爱的每一天\n"+
"[01:32.54]爱你是不变的信念\n"+
"[01:39.40]任时光飞逝如闪电\n"+
"[01:46.18]这彩虹永远开在我心间\n"+
"[01:55.92]02.彩虹\n"+
"[02:00.42]词曲：许巍\n"+
"[02:25.58]每当你望着远方\n"+
"[02:32.30]别忘了爱在身边\n"+
"[02:39.12]我多想让你醒来\n"+
"[02:46.08]我多想给你温暖\n"+
"[02:49.34]在我珍爱的每一天\n"+
"[02:56.13]爱你是不变的信念\n"+
"[03:03.00]任时光飞逝如闪电\n"+
"[03:09.81]这彩虹永远开在我心间\n"+
"[03:18.44]在我珍爱的每一天\n"+
"[03:25.11]爱你是不变的信念\n"+
"[03:31.90]任时光飞逝如闪电\n"+
"[03:38.81]这彩虹永远开在我心间\n"+
"[03:48.84]02.彩虹\n"+
"[03:57.64]词曲：许巍\n";
//////////////////////////////
///////////TODO::::::::::::::::::::::::
var test_lyric2 = "[01:41.00][00:15.00]灯亮起来\n"+
"[01:43.00][00:17.00]我们献上一份爱\n"+
"[01:46.00][00:20.00]陪伴每个你\n"+
"[01:49.00][00:23.00]画出彩虹的色彩\n"+
"[01:52.00][00:26.00]茫茫人海\n"+
"[01:54.00][00:28.00]始终有一种安排\n"+
"[01:58.00][00:32.00]让我们相遇在这里\n"+
"[02:01.00][00:34.00]在同一个舞台\n"+
"[02:04.00][00:37.00]为你喝彩\n"+
"[02:06.00][00:40.00]坚定心志不摇摆\n"+
"[02:09.00][00:43.00]将心扉敞开\n"+
"[02:11.00][00:45.00]迎接最真挚关怀\n"+
"[02:15.00][00:49.00]日日夜夜\n"+
"[02:17.00][00:51.00]晴天下雨一起挨\n"+
"[02:20.00][00:54.00]我们承诺用心灌溉\n"+
"[02:23.00][00:57.00]希望你别走开\n"+
"[02:27.00][01:01.00]把手给我 手牵手一起走\n"+
"[03:22.00][02:56.00][02:31.00][01:05.00]让微笑驱走忧愁\n"+
"[03:25.00][02:34.00][01:08.00]未来日子一起拼凑\n"+
"[03:29.00][03:04.00][02:38.00][01:12.00]就让我们 手牵手一起走\n"+
"[03:33.00][03:08.00][02:42.00][01:16.00]阳光为你我守候\n"+
"[03:36.00][03:11.00][02:46.00][01:20.00]梦想就在前头\n"+
"[01:22.00]期待每一份感动(每一份感动)\n"+
"[02:48.00]期待每一份感动 手牵手一起走\n"+
"[03:00.00]未来日子一起拼凑(一起拼凑)\n"+
"[03:14.00]期待每一份感动(把手给我) 手牵手一起走\n"+
"[03:39.00]期待每一份感动";
//////////////////////////////

var AmuseLyric = {
	LyricData:null,
	Index:0,
	
	loadLyric: function(lyric_param) {
		var lyric = lyric_param;//test_lyric;
		var regexp = /\[\d\d:\d\d.\d\d\][^\[]*/g;
		var strings = lyric.match(regexp);
		
		if(!strings) return ;
		
		var timestamp;
		var text;
		AmuseLyric.LyricData = [];
		AmuseLyric.Index = 0;
		function str2Int(a, b) { return parseInt(a) * 10 + parseInt(b);}
		for(var i = 0; i < strings.length; i++)
		{
			
			timestamp = str2Int(strings[i].charAt(1), strings[i].charAt(2)) * 60000;
			timestamp += str2Int(strings[i].charAt(4), strings[i].charAt(5)) * 1000;
			timestamp += str2Int(strings[i].charAt(7), strings[i].charAt(8)) * 10;
			text = strings[i].split(']')[1];
			AmuseDebugOutLyrics(text);
			AmuseLyric.LyricData.push([timestamp, text.split('\n')[0]]);
		}
	},
	
	/* return [boolean, text] */
	syncLyric: function(timems) {
		if(!AmuseLyric.LyricData) return "";
		
		if(	timems < AmuseLyric.LyricData[AmuseLyric.Index][0] ||
				timems >= AmuseLyric.LyricData[AmuseLyric.LyricData.length - 1][0]) {
				var changed = (AmuseLyric.Index == 0 || AmuseLyric.Index == AmuseLyric.LyricData.length - 1);
				if(changed) {
					return [true, AmuseLyric.Index, AmuseLyric.LyricData[AmuseLyric.Index][1], 
												AmuseLyric.Index + 1 < AmuseLyric.LyricData.length ?
												AmuseLyric.LyricData[AmuseLyric.Index + 1][1] : '' , AmuseLyric.Index];
				} else {
					return [false, ''];
				}
			}
		
		while(timems >= AmuseLyric.LyricData[AmuseLyric.Index][0]) {
			AmuseLyric.Index++;
		}
		return [true, AmuseLyric.LyricData[AmuseLyric.Index - 1][1],
									AmuseLyric.Index < AmuseLyric.LyricData.length ?
									AmuseLyric.LyricData[AmuseLyric.Index][1] : '', AmuseLyric.Index];
	},
	
	resetLyric: function() {
		AmuseLyric.Index = 0;
		AmuseLyric.LyricData = null;
	},
	
};

//AmuseLyric.loadLyric();