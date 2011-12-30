NewDelegate = function (o, f) {
	var a = new Array() ;
	var l = arguments.length ;
	for(var i = 2 ; i < l ; i++) a[i - 2] = arguments[i] ;
	return function() {
		var aP = [].concat(arguments, a) ;
		f.apply(o, aP);
	}
}

$dh.newClass("XImgFrame", {
	init: function(container, w, h, b) {
	    this.imgcache = {};
	    
		b = b|| 12;
		w = w || 220;
		h = h || 160;
		
		this.canvas = document.createElement("div");
		this.canvas.style.cssText +=";position:absolute;overflow:hidden;background-color: gray;cursor: pointer;";
		container.appendChild(this.canvas);
		
		this.img = document.createElement("img");
		this.img.style.cssText = "position:absolute;left:"+b+"px;top:"+b+"px;width:"+(w-2*b-2)+"px;height:"+(h-2*b-2)+"px;border:solid 1px #404040;";
		this.canvas.appendChild(this.img);
		
		$dh.pos(this.canvas, [0, 0,"absolute"]);
		$dh.size(this.canvas, [w, h]);
		$dh.opac(this.canvas, 70);		
	},

	show: function(flag) {
		this.isVisible = flag;	
		this.canvas.style.visibility = (flag==false)?"hidden":"visible";
	},
	
	setContent: function(id) {
		this.src = id;
		if ((id+"").indexOf(".") < 0)
			id+= ".jpg"; // Default extension is JPG
		if (document.images) {
			this.imgcache[id] = new Image();
			this.imgcache[id].src = "images/"+id;
		}
		else {
			this.imgcache[id] = {src: "images/"+id};
		}
		this.img.src = this.imgcache[id].src;
	}
});

$dh.newClass("XImgScroller", {
	deltaLeft : 0,
	init: function(container, imgW, imgH, imgB, closeFlag) {
		this.canvas = document.createElement("div");
		this.canvas.style.cssText +=";overflow:hidden;width:100%;height:100%;position:absolute;";
		container.appendChild(this.canvas);
		
		this.items = [];
		this.added = {};
		
		this.imgW = imgW;
		this.imgH = imgH;
		this.imgB = imgB;
		this.closeFlag = closeFlag;
		
		this.drawButtons();
	},
	
	drawButtons: function() {
		this.butLeft = document.createElement("img");
		//var butH = $dh.bounds(this.canvas).height-2, butW = Math.floor(butH/3);
		var butH = 85, butW = 25;
		
		this.butLeft.style.cssText = "position:absolute;z-index: 20;top:2px;width:30px;height:"+butH+"px; width:"+butW+"px;";
		$dh.opac(this.butLeft, 50);
		this.butRight = this.butLeft.cloneNode(true);
		
		this.butLeft.style.left = "1px";
		this.butLeft.src = "images/but_prev.jpg";
		this.butRight.style.right = "1px";
		this.butRight.src = "images/but_next.jpg";
		
		this.canvas.appendChild(this.butLeft);
		this.canvas.appendChild(this.butRight);
		
		var self = this;
		$dh.addEv(this.butLeft, "mouseover", function() {  $dh.opac(self.butLeft, 80); });
		$dh.addEv(this.butRight, "mouseover", function() { $dh.opac(self.butRight, 80); });
		$dh.addEv(this.butLeft, "mouseout", function() {   $dh.opac(self.butLeft, 50);});
		$dh.addEv(this.butRight, "mouseout", function() {  $dh.opac(self.butRight, 50); });
		
		$dh.addEv(this.butLeft, "mousedown", function() {
			$dh.opac(self.butLeft, 100);
			if (!self.scrollTimer) {
				self.scrollDir = 1;
				self.scrollTimer = setInterval(NewDelegate(self, self.doScroll), 10);
			}
		});
		$dh.addEv(this.butRight, "mousedown", function() {
			$dh.opac(self.butRight, 100);
			if (!self.scrollTimer) {
				self.scrollDir = -1;
				self.scrollTimer = setInterval(NewDelegate(self, self.doScroll), 10);
			}
		});
		
		$dh.addEv(document, "mouseup", function() {
			$dh.opac(self.butLeft, 50);
			$dh.opac(self.butRight, 50);
			window.clearInterval(self.scrollTimer); 
			self.scrollTimer= null;
		});
	},
	
	addItem: function(src) {
		if (this.added[src]) {
			return this.items[this.added[src]-1];
		}	
		var item = new XImgFrame(this.canvas, this.imgW, this.imgH, this.imgB); 
		$dh.pos(item.canvas, [(this.items.length) * (this.imgW + 10)+30 + this.deltaLeft, 10, "absolute"]);
		
		this.items.push(item);
		item.src = src;
		item.setContent(src);
		this.added[src] = this.items.length;
		
		var self = this;
		$dh.addEv(item.canvas, "mouseover", function() { self.mouseOverItem(item);});
		$dh.addEv(item.canvas, "mouseout", function() { self.mouseOutItem(item);});
		$dh.addEv(item.canvas, "click", function() { self.clickItem(item);});
		
		if (this.closeFlag) {
		    ResultTab.tbody.rows[parseFloat(item.src+"",10)].cells[0].childNodes[0].innerHTML = "<img src='images/check.png' style='width:17px;height:17px;' />";
		}
		return item;
	},
	
	mouseOverItem: function(item) {
	    if (DialogManager.isLocked)
	        return;
		$dh.opac(item.canvas,100);
		item.canvas.style.backgroundColor = "#eedd00";
		//item.canvas.style.top = (parseFloat(item.canvas.style.top))+"px";
		
		if (this.closeFlag) {
		    var self = this;
		    showGCloseBut(true,item.canvas);
		    GCloseBut.onclick = function() {
			    showGCloseBut(false);
			    self.removeItem(item);			
		    }
		}
	},
	
	mouseOutItem: function(item) {
		$dh.opac(item.canvas,70);
		item.canvas.style.backgroundColor = "gray";
		//item.canvas.style.top = (parseFloat(item.canvas.style.top)+4)+"px";
		showGCloseBut(false);
	},
	
	clickItem: function(item) { // For demo only
	    if (this.closeFlag) { // For BPanel
	        var dialog = DialogManager.dialogs[item.src];
	        if (dialog.canvas.style.display =="" || DialogManager.isLocked)
	            return;
	        
	        dialog.fromObj = item;
	        var ib = $dh.bounds(item.canvas);
	        dialog.setProps({left: ib.left, top: ib.top, width: ib.width, height: ib.height});
	        
	        //dialog.setContent(item.src);	        
		    DialogManager.showDialog(item.src, item);//.show(true, 600, dialog.maxBounds);
		    DialogManager.dialogs[item.src].minBut.style.visibility = "hidden"; // Don't allow keeping more
		    ResultTab.previewer.show(false);
		}
		else { // For images in detail dialog
		    if (item.onClickItem)
		        item.onClickItem(item.src);
		}
	}, // User define
	
	doScroll: function() {
		var delta = 3;
		if (!this.scrollTimer || this.items.length ==0) return;
		if ((parseFloat(this.items[0].canvas.style.left) >= 30 && this.scrollDir == 1) ||
		    (parseFloat(this.items[this.items.length-1].canvas.style.left)+this.imgW <= this.butRight.offsetLeft && this.scrollDir == -1)) {
			window.clearInterval(this.scrollTimer);
			this.scrollTimer = null;
			return;		
		}
		this.deltaLeft += this.scrollDir*delta; 
		for (var x = 0; x < this.items.length; x ++)
			this.items[x].canvas.style.left = (parseInt(this.items[x].canvas.style.left,10)+ this.scrollDir*delta) +"px"; 
	},
	
	removeItem: function(item) {
		if (typeof item != "object") 
			item = this.items[this.added[item]-1];
		if (!RPanel.added[item.src])
		    ResultTab.tbody.rows[parseInt(item.src,10)].cells[0].childNodes[0].innerHTML = "";
		else
		    ResultTab.tbody.rows[parseInt(item.src,10)].cells[0].childNodes[0].innerHTML ="<img src='images/cart_flag.png' style='width:17px;height:17px;' />";
		
		var saveIndex = this.added[item.src];
		var saveSrc = item.src;
		this.added[item.src] = false;
		for (var i = saveIndex; i < this.items.length; i++) {
			this.items[i-1].img.src = this.items[i].img.src;
			this.items[i-1].src = this.items[i].src;
			this.added[this.items[i-1].src] = i;
		}
		
		this.canvas.removeChild(this.items[this.items.length-1].canvas);
		this.items.pop();
		if (DialogManager.dialogs[saveSrc].canvas.display != "none") {
			DialogManager.hideDialog(DialogManager.dialogs[saveSrc]);
		}
	}
});