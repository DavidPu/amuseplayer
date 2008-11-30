function AmuseDebugOut2(arg){AmuseDebugOut(arg);}
function AmuseDebugOut(arg)
{
	dump(arg + "\n");
	
	if(typeof(console) != 'undefined')
	{
		console.log(arg);
	}
	
}

var AmuseAgent = {
			AGENT_STUB_NODENAME:'commNode',
			AGENT_EVENT_NAME:'AmuseAgentEvent', 
			SERVER_EVENT_NAME:'AmuseServerEvent', 
			CLIENT_LOADLIST:		'0',
			CLIENT_LOADTRACK:	'1',
			CLIENT_LOADMP3: '2',
			CLIENT_CHECK_VERSION: '3',
			CLIENT_SEARCHTRACK: '4',
			EXTENSION_VERSION:null,
			PAGE_SIZE: 25,
			data:null,
			data_index:0,
			tracklist:null,
			currenttrack:-1,
			/////////////google music only///////////////
			currentlisturl:null,
			currentstart:0,
			////////////////////////////////
			bSearchMode:false,
			searchEngineIdx:0,
			searchKeyword:'',
			searchPageIndex:1,
			
			ontreeclick : function(node, evt) {
				if(node.attributes.url)
				{
					AmuseAgent.talkToServer(AmuseAgent.CLIENT_LOADLIST, node.attributes.url);
					AmuseAgent.currentlisturl = node.attributes.url;
					AmuseAgent.currentstart = 0;
					AmuseAgent.bSearchMode = false;
				}
				else if(node.id == "cur_playlist")
				{
					AmuseAgent.showPlayList();
				}else if(node.parentNode && node.parentNode.isRoot) {
					node.toggle();
					var sibling = node.previousSibling;
					while(sibling) {
						sibling.collapse();
						sibling = sibling.previousSibling;
					}
					sibling = node.nextSibling;
					while(sibling) {
						sibling.collapse();
						sibling = sibling.nextSibling;
					}
				}
			},
			
			loadTrack: function(index) {
				if(index < AmuseAgent.tracklist.length)
				{
					AmuseDebugOut("[loadTrack] index:" + index + " queryurl: " + AmuseAgent.tracklist[index].queryurl);
					AmuseAgent.talkToServer(AmuseAgent.CLIENT_LOADTRACK, AmuseAgent.tracklist[index].queryurl, index);
				}
			},
			
			onLoadTrack: function(data, index) {
				AmuseAgent.tracklist.crypturls = null;
				AmuseAgent.tracklist[index].crypturls = eval(data);
				AmuseAgent.tracklist[index].tryindex = 0;
				AmuseDebugOut("[onLoadTrack]:" + AmuseAgent.tracklist[0]);
				AmuseAgent.loadMp3(index);
				AmuseAgent.currenttrack = index;
				
		 },
			
			onPlay: function(node, evt){
				var sm = gridPanel.getSelectionModel();
				if(sm.hasSelection())
				{
					var sels = sm.getSelections();
					AmuseAgent.tracklist = null;
					AmuseAgent.currenttrack = -1;
					AmuseAgent.tracklist = new Array();
					for(var i = 0; i < sels.length; i++)
					{
						AmuseAgent.tracklist.push({
														queryurl: sels[i].get('url'),
														crypturls:null,
														realurl:null,
														tryindex:0,
														soundname:sels[i].get('song')
													});
					
					AmuseDebugOut("[onPlay]: " + sels[i].get('url'));
					AmuseDebugOut("[onPlay]: " + sels[i].get('song'));
					}
					
					AmuseSound.reset();
					AmuseAgent.playNext();
				}
			},
			
			playNext: function() {
				AmuseDebugOut2("[playNext] AmuseAgent.bSearchMode" + AmuseAgent.bSearchMode);
				AmuseAgent.currenttrack++;
				if(!AmuseAgent.bSearchMode)
				{
					if(AmuseAgent.currenttrack < AmuseAgent.tracklist.length)
					{
						AmuseAgent.loadTrack(AmuseAgent.currenttrack);
						AmuseDebugOut("[playNext] " + AmuseAgent.tracklist[AmuseAgent.currenttrack].soundname);
					}
					else
					{
						AmuseSound.stop();
					}
				}
				else
				{
					AmuseAgent.loadMp3(AmuseAgent.currenttrack);
				}
			},	
				 
			onStop: function(node, evt){ AmuseSound.stop();}, 
			onPrev: function(node, evt){ 
				AmuseAgent.currenttrack -= 2; 
				AmuseAgent.onNext(null, null);
			},
			 
			onNext: function(node, evt){ 
				AmuseSound.reset(); 
				AmuseAgent.playNext();
			},
			 
			onsetVolume: function(slider, evt) { 
        AmuseDebugOut("[onSlide]" + slider.getValue());
        AmuseSound.setVolume(slider.getValue());
			},
			
			onPageGoogleMusic: function(direct)
			{
				if(direct > 0)
				{	
					AmuseAgent.currentstart += 25;
				}
				else
				{
					AmuseAgent.currentstart = AmuseAgent.currentstart <= 0 ? 0 : (AmuseAgent.currentstart - 25);
				}
			
				if(AmuseAgent.currentlisturl.indexOf("&start=") != -1)
				{
					AmuseDebugOut("[onPageGoogleMusic] replace.");
					AmuseAgent.currentlisturl = AmuseAgent.currentlisturl.replace(/&start=[\d]+/, "&start=" + AmuseAgent.currentstart);
				}
				else
				{
					AmuseAgent.currentlisturl += "&start=25";
				}
				AmuseDebugOut("[onPageGoogleMusic] " + AmuseAgent.currentlisturl);
				AmuseAgent.talkToServer(AmuseAgent.CLIENT_LOADLIST, AmuseAgent.currentlisturl);
				
			},
			
			onSwitchSearchEngine: function(node, evt) {
				AmuseAgent.searchEngineIdx++;
				AmuseAgent.searchEngineIdx = AmuseAgent.searchEngineIdx & 0x1;
				var iconclass = AmuseAgent.searchEngineIdx == 0 ? 'baidu-icon' : 'google-icon';
				node.setIconClass(iconclass); 
					
			},
			
			onPage: function(node, evt){
				
				var direct = (node.id == "next_page") ? 1 : -1;
				if(AmuseAgent.bSearchMode) {
					if(AmuseAgent.searchEngineIdx == 0) {
						AmuseAgent.searchPageIndex += (direct == 1 ? 30 : -30);
					} else {
						AmuseAgent.searchPageIndex += (direct == 1 ? 20 : -20);
					}
					if(AmuseAgent.searchPageIndex < 0 || AmuseAgent.searchPageIndex > 1000) {
						AmuseAgent.searchPageIndex = 1;
					}
					AmuseAgent.searchTrack(AmuseAgent.searchKeyword, AmuseAgent.searchPageIndex);
					//if(AmuseAgent.searchEngineIdx == 0) return;
					return;
				}
								
				var dataStore = gridPanel.store;
				
				var gv = gridPanel.getView();
				AmuseDebugOut("[onPageGoogleMusic] " + AmuseAgent.currentlisturl);
				
				if(/google/.test(AmuseAgent.currentlisturl))
				{
					AmuseAgent.onPageGoogleMusic(direct);
					return;
				}
				
				
				if(AmuseAgent.data != null)
				{
					if(direct > 0 &&  AmuseAgent.data.length - AmuseAgent.data_index > AmuseAgent.PAGE_SIZE)
					{
						AmuseAgent.data_index += AmuseAgent.PAGE_SIZE;
						var left = AmuseAgent.data.length - AmuseAgent.data_index;
						var cnt = left > AmuseAgent.PAGE_SIZE ? AmuseAgent.PAGE_SIZE : left;
						dataStore.loadData(AmuseAgent.data.slice(AmuseAgent.data_index, AmuseAgent.data_index + cnt), false);
						//gv.focusRow(AmuseAgent.data_index);
						
					}
					else if(direct <= 0 && AmuseAgent.data_index > 0)
					{
						AmuseAgent.data_index -= AmuseAgent.PAGE_SIZE;
						AmuseAgent.data_index = AmuseAgent.data_index > 0 ? AmuseAgent.data_index : 0;
						//gv.focusRow(AmuseAgent.data_index);
						dataStore.loadData(AmuseAgent.data.slice(AmuseAgent.data_index, AmuseAgent.data_index + AmuseAgent.PAGE_SIZE), false);
						
					}
				}
			},
			
			oncellclick: function(grid, rowIndex, columnIndex, evt) {
				if(columnIndex == 2) {
					var sm = gridPanel.getSelectionModel();
					var prevSelState = !sm.isSelected(rowIndex);
					prevSelState ? sm.selectRow(rowIndex, true) : sm.deselectRow(rowIndex);
					var record = grid.getStore().getAt(rowIndex);  // Get the Record
					var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // Get field name
					var url = record.get(fieldName);
					var trackname = record.get('song');
					if(AmuseAgent.tracklist == null) {
	       		AmuseAgent.tracklist = new Array();
				 		AmuseAgent.tracklist.push({
													queryurl: url,
														crypturls:null,
														realurl:null,
														tryindex:0,
														soundname:trackname
													});
					 	AmuseSound.reset();
					 	AmuseAgent.currenttrack = -1;
						AmuseAgent.playNext();
					}	else {
						var insertion = {
														queryurl: url,
														crypturls:null,
														realurl:null,
														tryindex:0,
														soundname:trackname
													};
						AmuseAgent.tracklist.splice(AmuseAgent.currenttrack, 0, insertion);
						AmuseAgent.currenttrack--;
						AmuseAgent.currenttrack = AmuseAgent.currenttrack < -1 ? -1 : AmuseAgent.currenttrack;
						AmuseSound.reset();
						AmuseAgent.playNext();
					}
			}
		},
			
			talkToServer: function(cmd, param, userdata){
				//alert("talkToServer");
				var element = document.getElementById(AmuseAgent.AGENT_STUB_NODENAME);
				//alert(element);
				element.setAttribute("cmd", cmd);
				element.setAttribute("param", param);
				element.setAttribute("userdata", userdata);
				//alert(element);
				
				var evt = document.createEvent("Events");
				evt.initEvent(AmuseAgent.AGENT_EVENT_NAME, true, false);
				element.dispatchEvent(evt);
				evt = null;
		},
		
		onLoadList: function(data){
			//alert("onServerDoneCallback: " + data);
			var dataStore = gridPanel.store;
			
			AmuseAgent.data = eval(data);
			AmuseAgent.data_index = 0;
			var cnt = AmuseAgent.data.length > AmuseAgent.PAGE_SIZE ? AmuseAgent.PAGE_SIZE: AmuseAgent.data.length;
			dataStore.loadData(AmuseAgent.data.slice(AmuseAgent.data_index, AmuseAgent.data_index + cnt), false);
			//dataStore.loadData(AmuseAgent.data, false);
			if(/google/.test(AmuseAgent.currentlisturl))
			{
				AmuseSound.setTryCnt(100);
			}
			else
			{
				AmuseSound.setTryCnt(3);
			}
		
		},
		
		showPlayList: function()
		{
			var dataStore = gridPanel.store;
			if(AmuseAgent.tracklist != null && AmuseAgent.tracklist.length > 0)
			{
				var data = [];
				for(var i = 0; i < AmuseAgent.tracklist.length; i++)
				{
					data.push([AmuseAgent.tracklist[i].soundname, AmuseAgent.tracklist[i].queryurl]);
				}
				dataStore.loadData(data, false);
				data = null;
				var sm = gridPanel.getSelectionModel();
				sm.selectAll();
			}
		},
		

		
		loadMp3: function(index) {
			AmuseDebugOut("[loadMp3]index: " + index);
			
			if(index < AmuseAgent.tracklist.length)
			{
				var track = AmuseAgent.tracklist[index];
				AmuseDebugOut2("[loadMp3]track: " + track);
				if(!AmuseAgent.bSearchMode)
				{
					if(track.tryindex < track.crypturls.length)
					{
						
						var crypturl = track.crypturls[track.tryindex][1];
						if(crypturl)
						{
							AmuseDebugOut("[loadMp3]crypturl: " + crypturl);
							AmuseAgent.talkToServer(AmuseAgent.CLIENT_LOADMP3, crypturl, index);
						}
					}
					else
					{
						AmuseAgent.playNext();
					}	
				}
				else
				{
					AmuseDebugOut2("[loadMp3] track.queryurl: " +  track.queryurl);
					AmuseAgent.talkToServer(AmuseAgent.CLIENT_LOADMP3, track.queryurl, index);
				}
				
			}
		},
		
		onLoadMp3: function(mp3url, index) {
			AmuseAgent.tracklist[index].tryindex++;
			//alert("onLoadMp3:" + mp3url);
			mp3url = mp3url.split('"')[1];
			if(mp3url.length == 0)
			{
				AmuseDebugOut("[onLoadMp3] mp3url.length " + mp3url.length);
				if(AmuseSound.tryUrlCnt < AmuseSound.s_MaxTryCnt) {
					AmuseAgent.loadMp3(index);
					AmuseSound.tryUrlCnt++;
				}
				else {
					AmuseAgent.playNext();
				}
				return;
			}
			
			var soundname = AmuseAgent.tracklist[index].soundname.length > 35 ? 
											AmuseAgent.tracklist[index].soundname.substring(0,35) :
											AmuseAgent.tracklist[index].soundname;
			playerPanel.setTitle("Title:" + soundname);
			var el = document.getElementById('trackInfo');
			//AmuseDebugOut("[onLoadMp3] mp3url.length " + mp3url.length);
			if(mp3url.length >= 60)
			{
				el.innerHTML = '<a onclick="showDownloadTips(); return false;" href="' + mp3url + '>MP3\u6765\u6e90:' + mp3url.substring(0,60) +
											' ..... '+ '.mp3</a>';
			}
			else if(mp3url.length > 1 )
			{
					el.innerHTML = '<a onclick="showDownloadTips(); return false;"  href="' + mp3url + '>MP3\u6765\u6e90:' + mp3url + '</a>';
			}
			AmuseSound.createSound(index, mp3url, true);
			
		},
		
		checkVersion: function() {
			AmuseAgent.talkToServer(AmuseAgent.CLIENT_CHECK_VERSION, 'version', 'dummy');
		},
		
		onCheckVersion: function(version) {
			AmuseAgent.EXTENSION_VERSION = version;
			AmuseDebugOut("[onCheckVersion]: version: " + version);
		},
		
		searchTrack : function(unicodeKeywords, pageIdx) {
			/* called by SearchField.js */
			AmuseAgent.bSearchMode = true;
			if(pageIdx == 0) {
				AmuseAgent.searchPageIndex = 0;
			}
			if(AmuseAgent.searchEngineIdx == 0) {
				var searchurl = 'http://mp3.baidu.com/m?f=ms&tn=baidump3&ct=134217728&lm=0&word=@'+ unicodeKeywords +'@';
				AmuseAgent.searchKeyword = unicodeKeywords;
				searchurl += '&pn=' + pageIdx;
				AmuseDebugOut2("[searchTrack]searchurl: " + searchurl);
				AmuseAgent.talkToServer(AmuseAgent.CLIENT_SEARCHTRACK, searchurl);
			}
			else 
			{
				var searchurl = 'http://www.google.cn/music/search?q=';
				AmuseAgent.searchKeyword = unicodeKeywords;
				searchurl += encodeURIComponent(unicodeKeywords);
				searchurl += "&cat=song&start=" + pageIdx;
				AmuseDebugOut2("[searchTrack]searchurl: " + searchurl);
				AmuseAgent.talkToServer(AmuseAgent.CLIENT_SEARCHTRACK, searchurl);
			}
		},
		onsearchTrack : function(data) {
			if(typeof(data) !='undefined' && data.length > 0) {
				AmuseAgent.onLoadList(data);
			} 
			else {
				AmuseDebugOut('[onsearchTrack]Empty data!');
			}
			
		},
		
		AmuseCommBackEvtHandler:function(evt){
			var node = evt.target;
			var data = decodeURIComponent(node.getAttribute("data"));
			var cmd = node.getAttribute("cmd");
			var userdata = node.getAttribute("userdata");
			if(data == null || data == 'undefined') {
				//TODO: Error Handler..
				return;
			}
			
			evt = null;
			switch(cmd)
			{
				case AmuseAgent.CLIENT_LOADLIST:
					AmuseAgent.bSearchMode = false;
					AmuseAgent.onLoadList(data);
					break;
					
					case AmuseAgent.CLIENT_LOADTRACK:
						//alert("AmuseAgent.CLIENT_LOADTRACK");
						AmuseAgent.onLoadTrack(data, userdata);
						break;
						
					case AmuseAgent.CLIENT_LOADMP3:
						AmuseAgent.onLoadMp3(data, userdata);
						break;
					
					case AmuseAgent.CLIENT_CHECK_VERSION:
						AmuseAgent.onCheckVersion(data);
						break;
					
					case AmuseAgent.CLIENT_SEARCHTRACK:
						//AmuseAgent.bSearchMode = true;
						AmuseAgent.onsearchTrack(data);
						break;
												
					default:
						alert("unkown cmd: " + cmd);
						break;
			}
		}
}


function redirect_oldVersion()
{
		/* no need to update agent side page. */
		window.location = "./amuseplayer1-18.html";
}

function redirect()
{
	AmuseDebugOut("[redirect]" +AmuseAgent.EXTENSION_VERSION);
	if(AmuseAgent.EXTENSION_VERSION != "\"2.0\"")
	{
		var prompt = document.getElementById("versioncheck");
		prompt.style.display= "";
	}
	else
	{

		window.location = "./amuseplayer1-18.html";
		document.body.innerHTML = "loading...";
	}
}

window.addEventListener("load", function(e) 
{

	var btn = document.getElementById(AmuseAgent.AGENT_STUB_NODENAME);
	btn.addEventListener(AmuseAgent.SERVER_EVENT_NAME, AmuseAgent.AmuseCommBackEvtHandler, false);
	if(window.location.pathname.indexOf("/amuseplayer.html") != -1)
	{
		AmuseAgent.checkVersion();
		setTimeout(redirect, 90);
	}
	
}, false);	

