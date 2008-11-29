
var gridPanel = null;
var g_ProgressBar = null;


var TreePanel = null;

Ext.apply(Ext.data.Store.prototype, {
applySort : function(){

}
});

///////////////CheckColumn//////////////////

Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            alert('onMouseDown');
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, false);
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-amuse-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
};
  // custom column plugin example
  var checkColumn = new Ext.grid.CheckColumn({
     header: "\u8bd5\u542c",
     dataIndex: 'url',
     width: 55
  });
/////////////////////////////////


///////////////////////////
/**
 * @class Ext.ux.SliderTip
 * @extends Ext.Tip
 * Simple plugin for using an Ext.Tip with a slider to show the slider value
 */
Ext.ux.SliderTip = Ext.extend(Ext.Tip, {
    minWidth: 10,
    offsets : [0, -10],
    init : function(slider){
        slider.on('dragstart', this.onSlide, this);
        slider.on('drag', this.onSlide, this);
        slider.on('dragend', this.hide, this);
        slider.on('destroy', this.destroy, this);
    },

    onSlide : function(slider){
        this.show();
        this.body.update(this.getText(slider));
        this.doAutoWidth();
        this.el.alignTo(slider.thumb, 'b-t?', this.offsets);
    },

    getText : function(slider){
        return slider.getValue();
    }
});

//////////////////////////////////////////////
function onBeforeSel(selm, rowIndex, bKeepExisting, Record)
{
	
	var b = selm.isSelected(rowIndex);
	if(!b)
	{
		selm.un('beforerowselect', onBeforeSel);
		selm.selectRow(rowIndex, true);
	}
	else
	{
		selm.deselectRow(rowIndex);
	}
	return false;
	
}

function onSelDelSel(selm, rowIndex, bKeepExisting, Record)
{
	selm.on('beforerowselect', onBeforeSel);
}
		
function setup(){

        //Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
////////////////////////////////
			    // shared reader
    var reader = new Ext.data.ArrayReader({}, [
       {name: 'song'},
       {name: 'url'}
    ]);
        var xg = Ext.grid;
        var sm2 = new xg.CheckboxSelectionModel();
        sm2.on('beforerowselect', onBeforeSel);//rowselect 
        sm2.on('rowselect', onSelDelSel);
        //sm2.on('rowdeselect ', onSelDelSel);
        
        /////
        g_ProgressBar = new Ext.ProgressBar({
						       text:'',
						       height:15,
						       width:200
						      });
        //// 
		    gridPanel = new xg.GridPanel({
		        id:'button-grid',
		        layout: 'absolute',
		        collapsible:true,
		        store: new Ext.data.Store({
		            reader: reader,
		            data: xg.dummyData
		        }),
		        cm: new xg.ColumnModel([
		            sm2,
		            {id:'song',header: '\u6B4C\u66F2\u540D', width: 200, sortable: false, dataIndex: 'song'},
		            checkColumn,
		        ]),
		        sm: sm2,
						
						listeners : {
 													cellclick 	 : AmuseAgent.oncellclick         													
            						},
/////////////////////////////////////////////////
		       tbar: [
		        '\u641c\u7d22: ', {iconCls:'baidu-icon', handler:AmuseAgent.onSwitchSearchEngine},
		        new Ext.app.SearchField({
		            //store: 'aa.js',
		            width:320
		        }),
		        ],
        
		        bbar:[{
		        // inline toolbars
		            text:'\u5f53\u524d\u64ad\u653e\u5217\u8868',
		            //iconCls:'add',
		            id:'cur_playlist2',
		            handler: AmuseAgent.showPlayList
		        }, '-', {
		            text:'\u4e0a\u4e00\u9875',
		            //iconCls:'option'
		            id:'prev_page',
		            handler: AmuseAgent.onPage
		        },'-',{
		            text:'\u4e0b\u4e00\u9875',
		            id:'next_page',
		            //iconCls:'remove'
		            handler: AmuseAgent.onPage
		        }
		        ],
						   
//////////////////////////////////////////////////
						   
        		//loadMask :true,
						autoScroll: true,
						y:100,
						x:300,
						width:500,
		        height:500,
		        //frame:true,
		        enableColumnHide:false,
		        //collapsible: true,
		        //title:'Amuse Player Preview version',
		        //iconCls:'icon-grid',
		        //plugins: new Ext.ux.TabCloseMenu(),
		    });
/////////////////////////////////        

TreePanel = 	new Ext.tree.TreePanel({
													    	  id: 'tree-panel',
													        //split: true,
													       // minSize: 150,
													       title:'Amuseplayer',
													        autoScroll: true,
													        width:300,
													        height:600,
													  
													        layoutConfig:{animate:false},
													        // tree-specific configs:
													        rootVisible: false,
													       // lines: false,
													        //singleExpand: true,
													        useArrows: true,
													        enableDD:true,
													        bbar:[{
													        // inline toolbars
													            text:'\u7559\u8a00\u677f',
													            //tooltip:'Add a new row',
													            //iconCls:'add',
													            //id:'cur_playlist',
													            handler: function() {open('http://www.amuseplayer.com/index.html#bugreport');}
													
													        }, '-', {
													           // text:'<<',
													            //tooltip:'Blah blah blah blaht',
													            //iconCls:'option'
													            id:'prev_page',
													            //handler: AmuseAgent.onPage
													        },'-',{
													            //text:'Search',
													            id:'next_page',
													            //tooltip:'Remove the selected item',
													            //iconCls:'remove'
													           // handler: AmuseAgent.searchTrack
													        }
													        ],
													        
													        loader: new Ext.tree.TreeLoader({
													            dataUrl:'tree-data1.18.json'
													        }),
													        
													        root: new Ext.tree.AsyncTreeNode({
														        	text: 'Albums', 
													            allowDrag:false,
													            allowDrop:false
            												}),
            										 
            										 
            											listeners : {
 																			click	 : AmuseAgent.ontreeclick         													
            													}	
													    });




playerPanel = new Ext.Panel({
        title: '-',
        //iconCls:'amuseplayer-icon',
        x:300,
        y:0,
        width:500,
        height:100,
		    bbar: [
	        {
            //text:'Play',
          	iconCls:'play-icon',
            handler: AmuseAgent.onPlay
	     		},'-',
	     		{
           // text:'Stop',
            //tooltip:'Add a new row',
           	iconCls:'stop-icon',
            handler: AmuseAgent.onStop
	     		},'-',  {
            //text:'Prev',
            //tooltip:'Add a new row',
            iconCls:'prev-icon',
            handler: AmuseAgent.onPrev
	     		},'-', {
            //text:'Next',
            //tooltip:'Add a new row',
            iconCls:'next-icon',
            handler: AmuseAgent.onNext
	     		}
	     		, '-', {
            //text:'Next',
            //tooltip:'Add a new row',
            iconCls:'volume-icon',
	     		}, 
	     		new Ext.Slider({
			        width: 100,
			        minValue: 0,
			        maxValue: 100,
			        value: 100,
			        listeners : {change: AmuseAgent.onsetVolume},
			        plugins: new Ext.ux.SliderTip()
			    }),'-', 
			    g_ProgressBar,
		   ],
				
        html: '<div id="trackInfo"> AmusePlayer </div>',
    });
    

 	var contentPanel = {
		id: 'content-panel',
		region: 'center', // this is what makes this panel into a region within the containing layout
		title:' ',
		//iconCls:'amuseplayer-icon',
		width:400,
		margins: '2 5 5 0',
		border: false,
		items: [TreePanel]
	};
	      
///////////////////////////////////////////////////////
       var viewport = new Ext.Viewport({
            layout:'border',
            items:[
                {
                  region:'center',
                 	//split:true,
                 // width: 400,
                  minSize: 200,
                  maxSize: 800,
                  margins:'0 0 0 5',
                  layout:'absolute',
               		items:[TreePanel, playerPanel, gridPanel]
              	}             	
             ]
        });
    }
    
Ext.grid.dummyData = [];

Ext.onReady(setup, true);    