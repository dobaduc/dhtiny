$dh.Require("ctrl/covermask");
$dh.isLoaded("ctrl/modalcanvas", true);

$dh.newClass("DHModalCanvas", DHRichCanvas, {
    init: function(target, props) {
	    if (!props) props = {};
	    props.cssText = "position:absolute;z-index:999999;display:none;" + (props.cssText || "");
        
	    target = target || document.body;
	    this.target = $dh.isStr(target) ? $dh.el(target): target;

        DHRichCanvas.prototype.init.apply(this,[document.body, props]);
		if (props.hasmask) {
			props.maskProps = props.maskProps || {};
			this.mask = new DHCoverMask(props.maskProps);
            this.mask.canvas.style.cssText +=";width:100%;height:100%;top:0px;left:0px;position:aboslute;"
		}
		this.setupListeners();
        this.setAutoResizeMask();

        this.setProps({width: this.width, height: this.height})
    },
    setupListeners: function() {
    	var self = this;
    	$dh.addEv(document, "mousedown", function(ev) {
            var target = $dh.evt(ev).target;
            while (target != self.canvas && target) {
                target = target.parentNode;
            }
    		if (target != self.canvas && self.canvas.style.visibility != "hidden") {
    			self.show(false);
    			if (self.hasmask) self.mask.show(false);
    		}
    	});
        if (this.hasmask) {
            this.mask.addEv("onmaskmousedown", function(){
                if (self.hideOnMaskClick) {
                    self.show(false);
                    self.mask.show(false);
                }
            });
        }
    },

    setAutoResizeMask: function() {
        var self = this;
        $dh.addEv(window,"onresize", function(){
            if (self.hasmask && self.mask.canvas.style.visibility != "hidden") {
                var bs = $dh.bodySize(true);
                self.mask.setProps({width: bs.width, height: bs.height});
            }
        })
    },

    setPos: function(x,y, zIndex) {
    	if (!$dh.isNil(x)) this.setProp("left",x);
    	if (!$dh.isNil(y)) this.setProp("top",y);
    	if (!$dh.isNil(zIndex)) this.setProp("zIndex",zIndex);
    },
    
    // Overridden method
    show: function(flag, target, zIndex) {
    	// Change target     
  		this.target= (target) ? ($dh.isStr(target)? $dh.el(target) : target)
                                  : {left: this.getProp("left"), top: this.getProp("top")};

    	// Calculate position first
    	if (flag != false) {            
    		if (this.canvas.style.display == "none") {
        		this.canvas.style.display = "";
                if (this.hasmask) {
                    this.mask.show(true, this.canvas.style.zIndex-1);
                }
                
                var tb = (this.target.tagName)? $dh.bounds(this.target): this.target; // bound of target
                var left =tb.left + (tb.width || 0),
                    top = tb.top + (tb.height || 0);
                    
                this.setPos(left, top, zIndex);
                this.raise("onshow");
            }
    	}
    	else {
    		if (this.canvas.style.display != "none"){
                this.canvas.style.display = "none";
                if (this.hasmask){
                    this.mask.show(false);
                }
                this.raise("onhide");
            }
    	}
    }
});