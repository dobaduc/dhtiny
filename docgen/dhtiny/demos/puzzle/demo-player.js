$dh.Require(["util/dragmanager","ctrl/gridcontainer","util/animation"]);

// Read game configurations from server
try{
	$dh.GC = eval('('+unescape( $dh.ajax.GET("config/config.js?ppx=" + (new Date().getTime()) ) )+')');
}
catch (errror) {
	alert("ERROR: Cannot read configurations from server!");
}

// Flash puzzle demo
$dh.newClass("MAGICVIDEOPUZZLE", {
	//---------- Game data --------------------------
	leveldata: $dh.GC.leveldata,
	maxlevel: parseInt($dh.GC.maxlevel,10),
	nRow: 2, nCol: 2, // Number of current row/ column
	currentVideo: "videos/test3.swf", // Current playing video
	loadedCount: 0, // Count currently loaded block
	isFinished: true, // Done game or not
	currentLevel: 0, // Current game level
	
	//---------- Default display properties -----------------
	VWIDTH: 738, VHEIGHT: 413, // Size of table
	BGPADDING: {left: 0, top: 50}, GRIDPADDING: {left: 30, top: 32, bottom: 8}, 
	
	top: 100, left: 350, // Absolute position of table on the screen 
	blocks: [], // Save created blocks for reusing
	Grid: null, // Grid component
	items: [], // Saved blocks' id for checking result
	vref : [], // Save video reference to call SWF methods
	
	init: function() {
		// Fit screen
		this.onWindowResize();
		var self = this;
		$dh.addEv(window,"onresize", function() { self.onWindowResize();});
		
		$dh.disableSelect(document.body);				
		this.initScreen();
		this.makeFirstScreen();		
	},
	onWindowResize: function() {
		// Change size of game screen to fit screen
		//var bs = $dh.bodySize();
		var gleft = $dh.pos($dh.el("GameContainer")).left;
		this.left = gleft + this.GRIDPADDING.left;//Math.floor(bs.width/2 - this.VWIDTH/2);
		this.top  = this.BGPADDING.top + this.GRIDPADDING.top;//Math.floor(bs.height/2 - this.VHEIGHT/2);
		if (this.Grid)
			this.moveGridRootTo(this.left, this.left);
				
	},
	moveGridRootTo: function(x, y) {		
		this.Grid.setProps({left: this.left, top: this.top});
		// Update positon for masks too
		for (var i =0; i < this.nRow; i ++)
			for (var j = 0; j < this.nCol+1 ; j++) {
				var item = this.Grid.items[i][j];
			    if (!item) continue;
			    if (item.vdmask)
			    	item.vdmask.style.cssText +=";top:"+(this.Grid.top + item.top)+"px;left:"+(this.Grid.left + item.left)+"px;width:"+item.width+"px;height:"+item.height+"px;";
			}
		if (this.startBut) {
			this.startBut.style.cssText +=";top:"+ (this.top + this.VHEIGHT + this.GRIDPADDING.bottom)+"px;"+
										 "left:"+Math.floor(this.left + this.VWIDTH/2-parseInt(this.startBut.style.width,10)/2 +3)+"px;";
		}
	},
	initScreen: function() {
	    // Set screen text	   
	    $dh.el("GameContainer").style.background="url("+$dh.GC.backgroundimg+") "+this.BGPADDING.left+"px "+this.BGPADDING.top+"px no-repeat";
		$dh.el("timelabel").innerHTML = $dh.GC.timetxt;
	    $dh.el("levellabel").innerHTML = $dh.GC.leveltxt;
	    if ($dh.GC.cursorcur && $dh.GC.cursorcur!="") {
	        document.body.style.cursor = "url("+$dh.GC.cursorcur+")";
	    }
	},
	makeFirstScreen: function() { // Welcome screen
		var div = $dh.el("GameContainer");
		M = new DHMotion(div, DHMotion.AnimEffects.bounceEaseOut, 1, 100, 1);
        M.setPropValue = function(val) {
            this.targetObj.style.height = val + "%"; 
            this.targetObj.style.width = (val*8) + "px";
        }
        var self = this;
        M.addEv("onstop", function() { 
        	self.createStartButton();
        	self.createGrid(true);
       	} )
        M.start();
	},
	createStartButton: function(bs) {
	    // Start button --> too simple
	    var bs = $dh.bodySize();
		var img = this.startBut = document.createElement("img");
		var imgw = 60, imgh = 30;		
        img.src = $dh.GC.startbutimg;
        //img.style.cssText +=";position:absolute;width:"+imgw+"px;height:"+imgh+"px;top:"+ (this.top + this.VHEIGHT + 5)+"px;left:"+Math.floor(bs.width/2-imgw/2)+"px;";
        img.style.cssText +=  ";position:absolute;width:"+imgw+"px;height:"+imgh+"px;"+
        					  "top:"+ (this.top + this.VHEIGHT + this.GRIDPADDING.bottom)+"px;"+
	 						  "left:"+Math.floor(this.left + this.VWIDTH/2-imgw/2+3)+"px;";
        document.body.appendChild(img);
        img.title = "Click here to start new game";
        
        var self = this;
        $dh.addEv(img,"onclick", function() { self.startBut.style.display = "none"; self.resetGame(++self.currentLevel);});
        $dh.addEv(img,"onmouseover", function() { self.startBut.src = $dh.GC.startbutoverimg;});
        $dh.addEv(img,"onmousemove", function() { self.startBut.src = $dh.GC.startbutoverimg;});
        $dh.addEv(img,"onmouseout", function() { self.startBut.src = $dh.GC.startbutimg;});
	},
	resetGame: function(level) {
		// Hide all existing blocks
		if (level > this.maxlevel){
			this.setScreenCenterText($dh.GC.finishalltxt, true);
			return;
		}
	    this.hideAllBlocks();
	    // Set current level
		this.currentLevel = level;
		$dh.el("currentlevel").innerHTML = level;
		
		// Set grid props
		var map = {nRow: "r", nCol: "c", availTime:"t", currentVideo: "v", currentFullVideo: "fullv"};
		for (var p in map) {		    
			this[p] = this.leveldata[level][map[p]];
			if (p != "currentVideo" && p != "currentFullVideo")
			    this[p] = parseInt(this[p],10);
		}			
		this.loadedCount = 0;
		this.isFinished = false;
		this.items = [];
		this.vref = []; // For test
		this.blocks = []; // For test
		
		// Clean everything related to last level
		this.Grid.covermask.innerHTML = "";
		var v = $dh.el(this.Grid.id +"_rootvideo");
		if (v && v.parentNode)
			v.parentNode.removeChild(v);
		
		this.createGrid(); // In fact, just reset it		
		$dh.setTime(this,"createBlocks",[], 1000);
	},
	loadVideoTo: function(divId, width, height, haveSound) {
	    var re_text = /\.swf|\.avi|\.flv|/i;
	    /* Checking file type */
	    if (this.currentVideo.toLowerCase().search(re_text) < 0) { // Is just an image
	        var img = document.createElement("img");
	        img.style.cssText = "width:100%; height:100%;position:absolute;left:0px;top:0px;";
	        $dh.el(divId).appendChild(img);
	        return;
	    }
	    
	    if (this.isFinished) {
		    var params = { allowScriptAccess: "always",wmode: "opaque", border: 1, volume: 0};
		    var atts = { "id": divId, "name": divId +"_swf", volume: 0 };
		    var flvars = {};
		    if ($dh.isNil(width)) width = "100%";
		    if ($dh.isNil(height)) height = "100%";
	
		    var self = this;
		    var onLoadedVideo = function(obj) {
			    self.onLoadedVideo(obj);
		    }
		    swfobject.embedSWF(this.currentVideo+"?playSound=var_"+(haveSound?"play":"stop"), divId, width, height, "8", null, flvars, params, atts, onLoadedVideo);
		    return;
	    }
	    
	    var flashvars = {
				 file:"videos/FitsCM-forPuzzle.swf", 
	             autostart:"false",
	             volume:0,
	             playerready : "OnDHLoadedVideo",
	             controlbar: "none",
	             icons:"false"
	     }
	     var params = {
	             allowfullscreen:"false",
	             allowscriptaccess:"always",
	             play:"false",
	             wmode:"opaque"
	     }
	     var attributes = {
	             id: divId,  
	             name:divId +"_swf"
	     }
	    if ($dh.isNil(width)) width = "100%";
	    if ($dh.isNil(height)) height = "100%";	    
	    swfobject.embedSWF("player/player-viral.swf", divId, width, height, "9.0.115", false, flashvars, params, attributes);
	},
	onLoadedVideo: function(obj) { // Loaded video for puzzle
		if (this.isFinished) { // donothing if loaded real video (the video is not for puzzle
			this.showStartBut();
			return;
		}
		
		/*if (this.isLoadingVideoForPuzzle) {
			this.isLoadingVideoForPuzzle = false;
			for (var i = 0;i < this.nRow; i++)
				for (var j = 0; j < this.nCol+1; j++) {
					var item = this.Grid.items[i][j];
					if (!item) continue;
					//this.cloneVideoTo(item.vdobject.id, this.Grid.itemwidth * this.nCol, this.Grid.itemheight * this.nRow);
					this.cloneVideoTo(item.vdcontainer.id, item.id);
				}			
			$dh.setTime(this,"showBlocks",[],1000);
		}*/
		/*else {*/
			this.vref.push(obj.id);
			this.loadedCount++;
			if (this.loadedCount == this.nRow * this.nCol) {
				$dh.setTime(this,"showBlocks",[],1000);
			}
		/*}*/
	},
	cloneVideoTo: function(container, targetID) {
		if ($dh.isStr(container)) container = $dh.el(container);
		var video = $dh.el(this.Grid.id + "_videocache").cloneNode(true);
		video.id = targetID + "_vdobject";
		video.name = video.id + "_swf";
		while(container.childNodes && container.childNodes[0])
			container.removeChild(container.childNodes[0]);
		container.appendChild(video);
		return;
		
		var props = {
				src: this.currentVideo, 
				name:targetID+"_vdobject_swf", 
				id: targetID,
				width: this.Grid.itemwidth * this.nCol, height:this.Grid.itemheight * this.nRow,
				wmode:"opaque",
				play:"true",
				loop:"true",
				quality:"high",
				allowScriptAccess:"always"};

		var html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' 
			+'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" ' 
			+'width="__WIDTH__" height="__HEIGHT__" id="__ID__">'
				+'<param name="movie" value="__SRC__">'
				+'__MOREPARAMS1__ '							
				+'<embed src="__SRC__" '
				+	'quality="high" bgcolor="__BGCOLOR__" width="__WIDTH__" height="__HEIGHT__" ' 
				+	'name="__NAME__" '
				+ 	'__MOREPARAMS2__ '
				+	'type="application/x-shockwave-flash" ' 
				+	'pluginspace="http://www.macromedia.com/go/getflashplayer"> '
				+'</embed>'
			+'</object>';
		// Add certain props: width, height, id, name, src
		for (var p in props) {
			var found = false;
			while (html.indexOf("__"+p.toUpperCase()+"__")>0) {
				found = true;
				html = html.replace( "__"+p.toUpperCase()+"__", props[p]);
			}
			if (found) delete props[p];
		}
		// Add params
		var pr1 = '', pr2 ='';
		for (var p in props) {
			pr1 += '<param name="'+p+'" value="'+props[p]+'"> ';
			pr2 += p +'="'+props[p]+'" ';
		}
		html = html.replace("__MOREPARAMS1__", pr1);
		html = html.replace("__MOREPARAMS2__", pr2);
			
		container.innerHTML = html;
	},
	createGrid: function(firstTime) {
	    // Create grid container
	    if (!this.Grid) {
	        this.Grid = new DHGridContainer(document.body, {
		        id : new Date().getTime()+""+Math.floor(Math.random()*99999),
	            position:"absolute", top: this.top, left: this.left, 
	            width:  this.VWIDTH, //Math.floor(this.VWIDTH / this.nCol) * (this.nCol+1),
	            height: this.VHEIGHT,//Math.floor(this.VHEIGHT / this.nRow) * (this.nRow),
	            nrow: this.nRow, ncol: this.nCol+1, itemspacing:0
	        });
	        // Create cover mask
	        this.Grid.covermask = $dh.New("div",{
		        id: this.Grid.id + "_covermask",
		        parentNode:this.Grid.canvas,
		        style: { position:"absolute", top:"0px", left:"0px", 
		    	    width:this.Grid.width+"px",height:this.Grid.height+"px",
		    	    textAlign:"center"
		    	    //bg:"url(images/loading.gif) 50% 50% no-repeat",zIndex:99999
		        }
	        });	        
	    }
	    // Reset grid container
	    this.Grid.setGridParams(null, null, null, this.nRow, this.nCol+1);	    	    
	    this.resetRootVideoContainer();	    
	    // Show screen status
	    if (!firstTime)
	        this.Grid.rootvideo.style.background = "url("+$dh.GC.loadingimg+") 50% 50% no-repeat";
	    else
	    	this.setScreenCenterText($dh.GC.welcometxt);
	},
	// Create root video container (center screen text container)
	resetRootVideoContainer: function() {
	    this.Grid.covermask.innerHTML = "";
        this.Grid.rootvideo = $dh.New("div",{
	        id: this.Grid.id + "_rootvideo",
	        parentNode: this.Grid.covermask,
	        style: { position:"relative", margin: "0px auto",		            
	    	    width:      (this.Grid.itemwidth* this.nCol-2)+"px",
	    	    height:     (this.Grid.itemheight * this.nRow-2)+"px",
	    	    lineHeight: (this.Grid.itemheight * this.nRow-2)+"px",
	    	    color: "orange", fontSize: "40px", fontWeight:"bold", fontFamily: "Tahoma", fontStyle:"italic",
	    	    zIndex:99999
	        }
        });
	},	
	createBlocks: function() {			
		// Make blocks
	    var check = [];
	    for (var i = 0; i < this.nRow; i++) {
		    for (var j = 0; j < this.nCol; j++) {
			    var val, row, col;
			    do {
				    row = Math.floor(Math.random()* this.nRow);
				    col = Math.floor(Math.random()* this.nCol);
				    val = row * this.nCol + col;
			    } while (check[val]== true || (row == i && col == j && val != this.nRow * this.nCol-1));
			    check[val] = true;
			    if (!(row == this.nRow-1 && col == this.nCol-1))
		            this.createBlock(row, col, i, j );
		        else // Make spare block
		            this.createBlock(row, col+1, i, j );
		    }
	    }
	    //this.loadVideoForPuzzle();
	},
	// Cache the video which is used for puzzle
	loadVideoForPuzzle: function() {
		// Cache root video
	    var div =$dh.el(this.Grid.id + "_videocachecontainer"); 
		if (!div) {
			div = $dh.New("div",{
		        id: this.Grid.id + "_videocachecontainer", parentNode: document.body,
		        style: { position:"absolute"/*, width:"0px", height:"0px", overflow:"hidden", visibility:"hidden"*/}
	        });
			var div2 = $dh.New("div",{
		        id: this.Grid.id + "_videocache", parentNode: div,
		        style: { position:"absolute"}
	        });
		}
		this.isLoadingVideoForPuzzle = true;
		this.loadVideoTo(this.Grid.id + "_videocache", this.Grid.itemwidth * this.nCol, this.Grid.itemheight * this.nRow);
	},
	// Load real video
	loadFullVideo: function() {
		this.Grid.rootvideo.style.background = "url("+$dh.GC.loadingimg+") 50% 50% no-repeat";
		this.loadVideoTo(this.Grid.rootvideo.id, this.Grid.itemwidth * this.nCol, this.Grid.itemheight * this.nRow, true);
	},
	// (i,j) is current block's position, (rrow,rcol) is real position
	createBlock: function(i, j, rrow, rcol) {
		if (!this.items[rrow]) this.items[rrow] = [];
		var item;
		//if (!this.blocks[i*this.nRow + j] ) { // Create new
		    item = /*this.blocks[i*this.nRow + j] =*/ new DHRichCanvas(this.Grid.canvas, {
	            cssText: "position:absolute;overflow:hidden;z-index:0;", 
	            id: new Date().getTime()+""+Math.floor(Math.random()*99999)	            
	        });	    	    
	        // Video container 
	        item.vdcontainer= document.createElement("div");
	        item.vdcontainer.style.cssText +=";position:absolute;z-index:0;";	        
	        item.vdcontainer.id =  item.id+ "_vdcontainer";    
	        item.canvas.appendChild(item.vdcontainer); // Container
	        
	        // Mask element
	        item.vdmask = item.vdcontainer.cloneNode(true);
	        item.vdmask.id =item.id + "_vdmask";	        
	        item.vdmask.style.cssText +=";background:red;z-index:9999;cursor:url("+$dh.GC.cursorcur+");";
	        document.body.appendChild(item.vdmask);
	        item.vdmask.style.cursor = "url("+$dh.GC.cursorcur+")";
	    //}
	    //else // Reuse
	        //item = this.blocks[i*this.nRow + j];	    	       
	    	    
	    // Video element
	        item.vdcontainer.innerHTML ="";
	        item.vdobject = document.createElement("div");
            item.vdobject.style.cssText +=";position:absolute;top:0px;left:0px;overflow:hidden;";    
            item.vdobject.id = item.id + "_vdobject";
            item.vdcontainer.appendChild(item.vdobject);
	    
	    // Reset props before reusing  
	    item.setProps({width: this.Grid.itemwidth, height: this.Grid.itemheight, display:"", border:"none"});
	    item.vdmask.style.cssText +=";display:block;border:none;";
	    $dh.opac(item.vdmask,30);
	    item.vdcontainer.style.cssText +=";width:"+(this.Grid.itemwidth * this.nCol)+"px;height:"+(this.Grid.itemheight * this.nRow)+"px;";
	    item.vdcontainer.style.cssText +=";left:"+(-this.Grid.itemwidth*rcol)+"px;top:"+(-this.Grid.itemheight*rrow)+"px;";	        
    	
    	//alert("creating block at " + i + " " + j + " vs " + this.nRow + "," + this.nCol);
    	this.Grid.addItem(item, i, j);
		item.vdmask.style.cssText +=";top:"+(this.Grid.top + item.top)+"px;left:"+(this.Grid.left + item.left)+"px;width:"+item.width+"px;height:"+item.height+"px;";
		// Save result
		this.items[rrow][rcol] = item.id;		
	    
	    //Load video
	    this.loadVideoTo(item.vdobject.id, this.Grid.itemwidth * this.nCol, this.Grid.itemheight * this.nRow);	    		
	    // Mouse action
	    this.setupDragDrop(item);
	},
	getBlockObj: function(id) { // id of mask, canvas, video container or video object	
		return $dh.el(id.split("_")[0]).ownerObj;
	},
	setupDragDrop: function(item) { // Setup drag & drop event for a block item
		item.vdmask.draggable = true;
	    $dh.dragger.setDrag(item.vdmask, { mode: "MOVE", noMask: true, ghostDrag: false, minleft: this.Grid.left, maxleft: this.Grid.left + this.Grid.width -this.Grid.itemwidth, mintop: this.Grid.top, maxtop: this.Grid.top + this.Grid.height -this.Grid.itemheight});
	    var self = this;
	    $dh.dragger.addEv("ondragstart", function(sender, ev) {	        
	        if (sender.dragSource.id.indexOf("_vdmask")<0) return;
	        if (self.isFinished) // Do nothing when game is finished
	            { sender.activeObj = null; sender.dragStarted = false; return;}
	        var block = self.getBlockObj(sender.activeObj.id);
	        block.canvas.style.zIndex = 10;
	        block.vdmask.style.zIndex= 99999;
	        $dh.opac(block.vdmask,0);
	    });
	    $dh.dragger.addEv("ondragstop", function(sender, ev) {		    
	        if (sender.dragSource.id.indexOf("_vdmask")<0) return;
	        if (self.isFinished) // Do nothing when game is finished
	            { sender.activeObj = null; sender.dragStarted = false; return;}
	        var block = self.getBlockObj(sender.activeObj.id);
	        if (block.canvas.style.zIndex != 0) {
	        	block.canvas.style.zIndex = 0;
	        	block.vdmask.style.zIndex= 9999;
	        	$dh.opac(block.vdmask,20);
	        	self.adjustTargetPos(block);
	        }	        
	    });
	    $dh.dragger.addEv("ondragging", function(sender, ev) {
	        if (sender.dragSource.id.indexOf("_vdmask")<0) return;
	        if (self.isFinished) // Do nothing when game is finished
	            { sender.activeObj = null; sender.dragStarted = false; return;}
	        var block = self.getBlockObj(sender.activeObj.id);       
	        block.setProps({left: parseInt(sender.activeObj.style.left,10) - self.Grid.left, 
	        			  top : parseInt(sender.activeObj.style.top,10) - self.Grid.top});
	    });
	},
	moveBlockTo: function(block, row, col) { // Move a block to given row, column
		this.Grid.moveItemTo(block, row, col);
		if (block.vdmask) {
			block.vdmask.style.top  = (this.Grid.top + block.top ) + "px";
			block.vdmask.style.left = (this.Grid.left+ block.left) + "px";
		}
	},
	setBlockPos: function(block, left, top) {
	    block.setProps({"left":left, "top":top});
	    if (block.vdmask) {
	        block.vdmask.style.top = top + "px";
	        block.vdmask.style.top = top + "px";
	    }
	},
	adjustTargetPos: function(block) { // Predict target position for dropped block
		var tx = block.left + block.width/2;
		var ty = block.top  + block.height/2;		
		var distance = 9999999;
		var sx, sy;
		// find nearest blank place
		for (var i =0; i < this.nRow; i ++) 
			for (var j=0; j < this.nCol+1; j++) 
				if (!this.Grid.items[i][j] || (i == block.gridRowIdx && j== block.gridColIdx)){
					var ry = i*this.Grid.itemheight + this.Grid.itemheight/2;
					var rx = j*this.Grid.itemwidth  + this.Grid.itemwidth /2;
					var dis = (tx-rx)*(tx-rx) + (ty-ry)*(ty-ry);					
					if (distance > dis) {
						distance = dis;
						sx = i; sy = j;						
					}
				}	
		this.moveBlockTo(block, sx, sy);
		this.checkFinish();
	},
	checkFinish: function(debug) { // Encode id later
		if (this.isFinished) return;
		var dx=0, dy= null;
		// Find first item
		for (var j=0; j < this.nCol; j++)
			if (this.Grid.items[0][j]) {
				dy = j;
				break;
			}

		for (var i =0; i < this.nRow; i ++)
			for (var j=0; j < this.nCol; j++) {				
				if (!this.Grid.items[i][j+ dy] || this.Grid.items[i][j+dy].id != this.items[i][j]) {
					//if (debug)						
					//alert("fail at "+ i+ " "+ j+"\n"+ this.items[i][j] +" vs "+ (this.Grid.items[i+dx][j+dy])?this.Grid.items[i+dx][j+dy].id:" none");
					return false;
				}
			}
		this.finishGame(dy);
		return true;
	},
	finishGame: function(dy) {
		if (this.isFinished) return;
		this.isFinished = true;
		
		// Display animation
		//var P = new DHParallelMotions();
		var P = new DHMotionSequence();
		for (var i=0; i < this.nRow; i ++)
			for (var j=0; j < this.nCol+1; j++) {
			    var item = this.Grid.items[i][j];
			    if (!item) continue;
		        M = new DHMotion(item.canvas, DHMotion.AnimEffects.bounceEaseOut, item.left, item.left+ Math.floor(dy==0?item.width/2:-item.width/2), 0.25);
                M.setPropValue = function(val) {
                    this.targetObj.style.left = Math.floor(val) + "px"; 
                    this.targetObj.ownerObj.vdmask.style.left = (val+ self.Grid.left)+ "px";
                }
                P.addChild(M);
			}	
	    
	    // Display root video
	    var self = this;
        P.addEv("onstop", function() {
            self.showRootVideo();
        });		
        P.start();
	},
	showRootVideo: function() {
	    if (!this.isFinished) return;
	    clearTimeout(this.clockCounter);
	    
	    this.hideAllBlocks();
		// Load root video with sound
		this.setScreenCenterText($dh.GC.passleveltxt.replace("##",this.currentLevel));
			    
		// Show root video and show start button to go to next level
		if (this.currentFullVideo && this.currentFullVideo != "")
		    this.currentVideo = this.currentFullVideo;
		$dh.setTime(this,"loadFullVideo",[], 1000);		
	},
	
	showStartBut: function() { 
		this.startBut.style.display = "";
		this.startBut.style.cssText +=";top:"+ (this.top + this.VHEIGHT + this.GRIDPADDING.bottom)+"px;"+
		 	"left:"+Math.floor(this.left + this.VWIDTH/2-parseInt(this.startBut.style.width,10)/2+ 3)+"px;";
	},
	hideAllBlocks: function() {	// Hide all blocks and totally clear inner video
		for (var i=0; i < 10; i ++) {
		    if (this.Grid.items[i])
			for (var j=0; j < 10; j++) {
				var item = this.Grid.items[i][j];
				if (item) {
					var v = $dh.el(item.id +"_vdobject");
					if (v && v.parentNode)
						v.parentNode.removeChild(v);
				    if (item.canvas && item.canvas.parentNode)item.canvas.parentNode.removeChild(item.canvas);	    
				    if (item.vdmask && item.vdmask.parentNode)item.vdmask.parentNode.removeChild(item.vdmask);
				    delete item;
				}
			}
		}
		// Totally clear, no reusing --> More safety
		this.blocks = [];
	},
	showBlocks: function() {		
		// hide loading mask
		this.Grid.covermask.style.display = "none";
		for (var i = 0; i < this.nRow; i ++)
			for (var j = 0; j < this.nCol+1 ; j ++) {
				var item = this.Grid.items[i][j];
				if (item) {
				    item.canvas.style.border = "solid 1px blue";
				    $dh.css(item.vdmask, {opac:20, bg: "red", border:"solid 1px blue"});
				}
			}		
		// Start videos
		this.controlAllVideos("start");
		
		// Start time counter
		$dh.el("currenttime").innerHTML = this.availTime+" s";
		this.clockCounter = $dh.setTime(this,"onClockCounted",[], 1000);		
		//$dh.setTime(this,"controlAllVideos",["rewind"],1000);		
	},
	controlAllVideos: function(action) {				
		switch (action) {
		case "rewind":
			for (var i=0; i< this.vref.length; i++)
				try {this.vref[i].Rewind();} catch(errrr) {}
			break;
		case "start":
			for (var i=0; i< this.vref.length; i++)
				try {document.getElementById(this.vref[i]).sendEvent("PLAY");} catch(errrr) {}			
			break;
		}
	},
	onClockCounted: function() {
	    if (this.availTime <= 0) {
	        this.isFinished = true;
	        this.hideAllBlocks();	        
	        clearTimeout(this.clockCounter);
	        this.currentLevel = 0;	        
	        this.setScreenCenterText($dh.GC.gameovertxt); // Show game over message
			$dh.setTime(this,"showStartBut",[],1000);
	        return;
	    }
	    this.availTime --;
	    $dh.el("currenttime").innerHTML = this.availTime+" s";
	    this.clockCounter = $dh.setTime(this,"onClockCounted",[], 1000);
	},
	
	setScreenCenterText: function(msg, isLast) {
	    this.Grid.covermask.style.display = "";
	    if (isLast) {
	        // Remove current video if it is being played
	        var v = $dh.el(this.Grid.id +"_rootvideo");
		    if (v && v.parentNode) v.parentNode.removeChild(v);
		    this.resetRootVideoContainer();
		}
        this.Grid.rootvideo.innerHTML = msg;
        this.Grid.rootvideo.style.background= "";
	}
});
var XDEMO;
function OnDHLoadedVideo(obj) {
	XDEMO.onLoadedVideo(obj);
}
$dh.addLoader(function() { XDEMO = new MAGICVIDEOPUZZLE(); });