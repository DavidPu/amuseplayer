// Very simple plugin for adding a close context menu to tabs
Ext.ux.TabCloseMenu = function(){
    var tabs, menu, ctxItem;
    this.init = function(tp){
        tabs = tp;
        tabs.on('contextmenu', onContextMenu);
    }

    function onContextMenu(ts, item, e){
        if(!menu){ // create context menu on first right click
            menu = new Ext.menu.Menu([{
                id: 'aaa' +'-close',
                text: 'Close Tab',
                handler : function(){
                
                }
            },{
                id: 'bbbb' + '-close-others',
                text: 'Close Other Tabs',
                handler : function(){
                    
                }
            }]);
        }
        ctxItem = item;
        var items = menu.items;
        
        menu.show();
    }
};