$dh.Require("ctrl/animitem");
$dh.isLoaded("ctrl/framescroller", true);

$dh.newClass("DHContentFrame", DHAnimItem, {
	init: function(container, props) {
        if (!props) props = {};
 
        // Default properties
		props.bdwidth = props.bdwidth || 12; // Border width
		props.width   = props.width || 10;
		props.height  = props.height || 10;
        props.cssText = ";position:absolute;overflow:hidden;background-color: gray;cursor: pointer;" +
                        (props.cssText ? props.cssText : "");
        props.opacity = props.opacity || 70;
        
        DHAnimItem.prototype.init.apply(this, [container, props]);

        this.setContent(props.contentData);
	},
	
	setContent: function(content) {                
        // Default properties for content
        var _props = {
            parentNode: this.canvas,
            style: "position:absolute;left:"+ this.bdwidth + "px;"+
                    "top:"  +  this.bdwidth +"px;"+
                    "width:" + (this.width - 2 * this.bdwidth -2)+"px;" +
                    "height:"+ (this.height- 2* this.bdwidth - 2)+"px;"+
                    "border:solid 1px #404040;"
        };
        _props = $dh.set(_props, content);
        
        this.content = $dh.New( content.type === "img"?"img":"div", _props);
	}
});

$dh.newClass("DHFrameScroller", DHRichCanvas, {
	_scrollPos : 0,
	init: function(container, props) {
        props = props || {};

        // Scroller type
        //props.scrollerType = props.scrollerType || "horizontal";
        // Scroll button size. Horizontal: width, Vertical: height
        props.btSize  = props.btSize || 25;
        props.imageExt = props.imageExt || "jpg";
        props.itemImageExt = props.itemImageExt || props.imageExt;

        // Content item
        props.itemSpacing  = props.itemSpacing || 0;        
        props.itemWidth  = props.itemWidth  || 1;
        props.itemHeight = props.itemHeight || 1;
        
        // Calculate space between item and canvas border
        props.itemPadding  = (props.scrollerType !== "vertical")? Math.floor((props.height - props.itemHeight)/2) :
                                                                  Math.floor((props.width - props.itemWidth)/2);
        // Item border width
        props.itemBorder = props.itemBorder || 3;
        // Default style
        props.cssText  = ";overflow:hidden;position:absolute;" + (props.cssText ? props.cssText : "");
        
        // Other default settings
        props.scrollInterval = props.scrollInterval || 10;        

		DHRichCanvas.prototype.init.apply(this, [container, props]);        
		this.items = [];

		this.drawButtons();
	},
	getImgSrc: function(fname) {
        return this.imagePath +fname+"."+ this.imageExt;
    },
    getItemImgSrc: function(fname) {
        return this.itemImagePath +fname+"."+ this.itemImageExt;
    },
	drawButtons: function() {
		this.butScrollBack = document.createElement("img");
        var pos = (this.scrollerType !== "vertical") ? ["left","top"] : ["top", "left"];
        var oposite = {"left": "right", "top": "bottom"};
        var size = (this.scrollerType !== "vertical") ? ["width","height"] : ["height", "width"];
		
		var commonCssText = "position:absolute;z-index: 20;"+
                                           size[0]+":"+ this.btSize +"px;"+
                                           size[1]+":100%;";
                                       
		$dh.opac(this.butScrollBack, 50);
        this.butScrollBack.style.cssText = commonCssText+ pos[0] +":0px;"+pos[1]+":0px;";
        this.butScrollBack.src = this.getImgSrc("but_prev"+(this.scrollerType ? "_"+ this.scrollerType : ""));

		this.butScrollForward = this.butScrollBack.cloneNode(true);
        this.butScrollForward.style.cssText = commonCssText+ oposite[pos[0]] + ":0px;" + pos[1]+":0px;";
        this.butScrollForward.src = this.getImgSrc("but_next"+ (this.scrollerType ? "_"+ this.scrollerType : ""));

        // Add buttons to frame
		this.canvas.appendChild(this.butScrollBack);
		this.canvas.appendChild(this.butScrollForward);


        // Prepare event handlers
		var self = this;
		$dh.addEv(this.butScrollBack, "mouseover", function() {$dh.opac(self.butScrollBack, 80);});
		$dh.addEv(this.butScrollForward, "mouseover", function() {$dh.opac(self.butScrollForward, 80);});
		$dh.addEv(this.butScrollBack, "mouseout", function() {$dh.opac(self.butScrollBack, 50);});
		$dh.addEv(this.butScrollForward, "mouseout", function() {$dh.opac(self.butScrollForward, 50);});
		
		$dh.addEv(this.butScrollBack, "mousedown", function() {
			$dh.opac(self.butScrollBack, 100);
			if (!self.scrollTimer) {
				self.scrollDir = 1;
				self.scrollTimer = setInterval($dh.delegate(self, "doScroll"), self.scrollInterval);
			}
		});
		$dh.addEv(this.butScrollForward, "mousedown", function() {
			$dh.opac(self.butScrollForward, 100);
			if (!self.scrollTimer) {
				self.scrollDir = -1;
				self.scrollTimer = setInterval($dh.delegate(self, "doScroll"), self.scrollInterval);
			}
		});
		
		$dh.addEv(document, "mouseup", function() {
			$dh.opac(self.butScrollBack, 50);
			$dh.opac(self.butScrollForward, 50);
			window.clearInterval(self.scrollTimer); 
			self.scrollTimer= null;
		});
	},
	
	itemMouseOver: function(item) {	    
		$dh.opac(item.canvas,100);
		item.canvas.style.backgroundColor = "#eedd00";
        this.raise("onitemmouseover");
	},
	
	itemMouseOut: function(item) {
		$dh.opac(item.canvas, this.itemMinOpac);
		item.canvas.style.backgroundColor = "gray";
        this.raise("onitemmouseout");
	},
	
	itemClick: function(item) { // For demo only
	    // For images in detail dialog
		 this.raise("onitemclick");
	}, // User define
	
	doScroll: function() {
		var delta = 3;
        var pos = (this.scrollerType !== "vertical") ? "left": "top";
        var bpos = pos.charAt(0).toUpperCase() + pos.substr(1); // return: Left/Top
        var size = (this.scrollerType !== "vertical") ? "Width": "Height";
        
		if (!this.scrollTimer || this.items.length ==0) return;       
		if ((this.items[0].getProp(pos) >= this.btSize && this.scrollDir == 1) ||
		    (this.items[this.items.length-1].getProp(pos) + this["item"+size] <= this.butScrollForward["offset"+bpos] && this.scrollDir == -1)) {

                window.clearInterval(this.scrollTimer);
                this.scrollTimer = null;
                return;
		}
        
		this._scrollPos += this.scrollDir * delta;
        
		for (var x = 0; x < this.items.length; x ++) {
			this.items[x].setProp(pos, (this.items[x].getProp(pos)+ this.scrollDir*delta ) );
        }
	},

    addItem: function(contentData) {
        if (contentData && contentData.type === "img" && contentData.src) {
            contentData.src = this.getItemImgSrc(contentData.src);
        }
        var pos = (this.scrollerType !== "vertical") ? ["left","top"] : ["top", "left"];
        var size = (this.scrollerType !== "vertical") ? "Width": "Height";

        // Create content frame
        props = {};
        props[pos[0]] = this.items.length * (this["item"+size] + this.itemSpacing) +  this.btSize + this._scrollPos;
        props[pos[1]] = this.itemPadding;
        $dh.set(props, {   
            width: this.itemWidth,
            height: this.itemHeight,
            bdwidth: this.itemBorder,
            cssText: "position:absolute;",
            contentData: contentData
        });
        
		var item = new DHContentFrame(this.canvas, props);
		this.items.push(item);

        // Event handlers
		var self = this;
		item.addEv("onmouseover", function() {self.itemMouseOver(item);});
		item.addEv("onmouseout" , function() {self.itemMouseOut(item);});
		item.addEv("onclick"    , function() {self.itemClick(item);});

		return item;
	},
	removeItem: function(item) {
		for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] === item) {
                this.canvas.removeChild(this.items[i].canvas);
                this.items.splice(i,1);
                return;
            }
		}
	},
    addItems: function(items){
        for (var i=items.length; i >=0; i--){
            this.addItem(items[i]);
        }
    },
    removeItems: function(items){
        for (var i=items.length; i >=0; i--){
            this.removeItem(items[i]);
        }
    }
});