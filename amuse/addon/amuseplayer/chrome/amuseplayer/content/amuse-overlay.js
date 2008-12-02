function loadAmusePlayer() {
  var prefService    = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
  var prefSvc        = prefService.getBranch(null);

  var loadInTab      = true;
  try {
    loadInTab        = prefSvc.getIntPref("amuseplayer.loadmode");
  } catch (ex) {
    loadInTab = true;
  }

  if (loadInTab) {
    //var theTab          = gBrowser.addTab('http://localhost/amuse/src/amuseplayer1-18.html'/*'chrome://amuseplayer/content/extamuse.xul'*/);
    //var theTab          = gBrowser.addTab('chrome://amuseplayer/content/extamuse.xul');
    var theTab          = gBrowser.addTab('http://localhost/amuse-googlecode/amuse/webpage/amuseplayer.html');
    theTab.label        = "AmusePlayer";
    gBrowser.selectedTab = theTab;
    var func = function () { gBrowser.setIcon(theTab, "chrome://amuseplayer/skin/icons/logo.png"); };
    setTimeout(func, 500);
  } else {
  	toOpenWindowByType('mozilla:AmusePlayer', 'chrome://amuseplayer/content/extamuse.xul');
  }
}


