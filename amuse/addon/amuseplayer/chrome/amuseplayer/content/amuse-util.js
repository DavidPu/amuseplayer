function AmuseDebugOut(arg){AmuseDebugOut2(arg);}
function AmuseDebugOut2(arg){}
function AmuseDebugOutLyrics(arg)
{

	dump(arg +"\n");
	if(typeof(console) != 'undefined')
		{
			console.log(arg);
		}

}
	
	
var AmuseUtil = {
		XHRSync: function(url, encode) {
			if(url == null) return null;

			try {
				var httpRequest = new XMLHttpRequest();
				httpRequest.open("GET", url, false);	
				if(encode)
					httpRequest.overrideMimeType(encode);	
				httpRequest.send(null);
				if(httpRequest.status == 200) {
					return httpRequest.responseText;
				} else {
					AmuseDebugOut("[AmuseUtil.XHRSync] getData: url:" + url + " httpRequest.status:" + httpRequest.status);
					return null;
				}
			} catch(e){
				AmuseDebugOut("[AmuseUtil.XHRSync]Execption getData: url:" + url);
			}
		},
		
		XHRAsync: function(url, encode, callback, userdata) {
			
			if(url == null) return false;
			
			try {
				var httpRequest = new XMLHttpRequest();
				httpRequest.open("GET", url, true);	
				httpRequest.onload = function() { callback(httpRequest.responseText, userdata);};
				if(encode)
					httpRequest.overrideMimeType(encode);
				httpRequest.send(null);
			} catch(e){
				AmuseDebugOut("[AmuseUtil.XHRAsync]Execption getData: url:" + url);
			}
			return true;
		},
		
		/* decode 'charset' URL-encoded string to Unicode string. */
		URL2Unicode: function(charset, data) {
		var szRet = data.replace(/(%[0-9A-Z][0-9A-Z])/ig, function(e){
				return String.fromCharCode("0x" + e.charAt(1) + e.charAt(2));
			});
		return FileIO.toUnicode(charset, szRet);
	},
	
	/*
		covert gb2312 encoded url
		e.g: http://ftp.modabo.cn/¸èÇú/±±¾©»¶Ó­Äã.mp3
		to 
		http://ftp.modabo.cn/%B8%E8%C7%FA/%B1%B1%BE%A9%BB%B6%D3%AD%C4%E3.mp3
		*/
	encodeURIComponent_GB2312:function(str) {
	 var ret = '';
		for(var i = 0; i < str.length; i++)
		{
			var chr = str.charCodeAt(i);
			if((chr >= 'a' && chr <= 'z') || 
         (chr >= 'A' && chr <= 'Z') || 
         (chr >= '0' && chr <= '9') )
      {
				ret += chr;
			} else {
				ret += '%' + chr.toString(16);
			}
		}
		return ret;
	},

	toHex: function(str) {
		var ret = '';
		for(var i = 0; i < str.length; i++)
		{
			ret += '0x' + str.charCodeAt(i).toString(16) +' ';
		}
		return ret;
	},
};
	
//function gb2312callback(resText, userData)
//{
//	//http://ftp.modabo.cn/%B8%E8%C7%FA/ %B1%B1 %BE%A9 %BB%B6 %D3%AD %C4%E3.mp3
//	//'http://ftp.modabo.cn/¸èÇú/±±¾©»¶Ó­Äã.mp3'
//		var regExp = /<a id=\"song_url\" href=\"\S*/g;
//		var url = resText.match(regExp);
//		//alert(url[0]);
//		var str = url[0].split('"')[3];
//		str = AmuseServer.encodeURL_GB2312(str);//encodeURI(str);//FileIO.toUnicode("gb2312", str)
//		AmuseDebugOut(str);
//		alert(str);
//		alert(str.length);
//		//alert(escape(str));
//		for(var i = 0; i < str.length; i++)
//		{
//			AmuseDebugOut(str.charCodeAt(i).toString(16) + " ");
//			AmuseDebugOut((str.charCodeAt(i) & 0xFF).toString(16) + " ");
//			AmuseDebugOut((str.charCodeAt(i) >>8).toString(16) + "\n");
//			//alert(str.charAt(i).toString(16));
//		}
//}
//AmuseServer.getData('http://box.zhangmen.baidu.com/m?gate=1&ct=134217728&tn=baidumt,%B1%B1%BE%A9%BB%B6%D3%AD%C4%E3%20%20&word=mp3,http://ftp.modabo.cn/%B8%E8%C7%FA/4uPx3fDsCuX1FTM$.mp3,,[%B1%B1%BE%A9%BB%B6%D3%AD%C4%E3+%C8%BA%D0%C7]&si=%B1%B1%BE%A9%BB%B6%D3%AD%C4%E3;;%C8%BA%D0%C7;;0;;0&lm=16777216',
//gb2312callback, null, "text/plain; charset=x-user-defined");
