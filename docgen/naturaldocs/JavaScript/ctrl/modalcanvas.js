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
			props.maskprops = props.maskprops || {};
			this.mask = new DHCoverMask(props.maskprops);
		}
		this.setupListeners();
        this.setAutoResizeMask();       
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
    	if (target)
    		this.target= $dh.isStr(target)? $dh.el(target) : target;         
    	// Calculate position first
    	if (flag != false) {            
    		if (this.canvas.style.display == "none") {
        		this.canvas.style.display = "";
                if (this.hasmask) {
                    var bs = $dh.bodySize(true);
                    $dh.size(this.mask.canvas, [bs.width, bs.height]);
                    this.mask.show(true, this.canvas.style.zIndex-1);
                }
                var tb = $dh.bounds(this.target); // bound of target
                var size = $dh.size(this.canvas);
                var left =tb.left +tb.width, top = tb.top + tb.height;
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