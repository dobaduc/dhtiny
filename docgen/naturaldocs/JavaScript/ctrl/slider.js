$dh.Require("ctrl/richcanvas");
$dh.Require("util/dragmanager");

$dh.isLoaded("ctrl/slider", true);
$dh.newClass("DHSlider", DHRichCanvas, {
    init : function(container, props) {
        // Be careful...
        props = props || {};
        DHRichCanvas.prototype.init.apply(this, arguments);        
        this.minval = this.minval || 0;
        this.maxval = this.maxval || this.minval;
        this.currentval = this.currentval || this.minval;
        this.type   = this.type || "horizontal";

        this.setProgressProps(this.progressProps);
        this.setPointerProps(this.pointerProps);
        
        // OK to start
        this.slideToVal(this.currentval);
    },
    
    setPointerProps: function(pointerProps) {
        if (!pointerProps) return;
        
        // First time
        if (!this.pointer) {
            this.pointer = new DHRichCanvas(this.canvas, {
                position : "absolute", className:"pointer",
                left: 0, width: this.height, top: "-10%", height:"120%", zIndex: 100
            });
            // Setup drag
            $dh.dragger.enableDrag(this.pointer.canvas);
            var self = this;
            $dh.dragger.addEv("ondragging", function(sender, target) {
                if (target != self.pointer.canvas) return;
                var prop = self.getTargetProp();
                self.slideToPos( parseInt(self.pointer.canvas.style[prop], 10) )
            });
        }
        this.pointer.setProps(pointerProps);
        if (this.type == "horizontal") {
            this.pointer.maxleft = this.getProp("width") - this.pointer.getProp("width");
        } else {
            this.pointer.maxtop = this.getProp("height") - this.pointer.getProp("height");
        }

        // Update drag params
        list = ["top","left","width","height"];
        dragParams = { mode: "MOVE", noMask: true, dragOrigin: this.canvas};
        for (i =0; i < list.length; i++) {
            this.pointer["min"+list[i]] = this.pointer["min"+list[i]] || 0;                        
            this.pointer["max"+list[i]] = this.pointer["max"+list[i]] || this.pointer["min"+list[i]];

            dragParams["min"+list[i]] = this.pointer["min"+list[i]];
            dragParams["max"+list[i]] = this.pointer["max"+list[i]];
            //alert("min"+list[i]+": " + this.pointer["min"+list[i]]+ ",  "+ "max"+list[i]+": " + this.pointer["max"+list[i]]);
        }
        $dh.dragger.setDragParams(this.pointer.canvas, dragParams);
    },

    setProgressProps: function(progressProps) {
        if (!progressProps) return;
        if (!this.progressbar) {
            this.progressbar = new DHRichCanvas(this.canvas, {className: "progressbar", style:"position:absolute;top:0px;left:0px;padding:0px;margin:0px;width:0px;", height:this.height} );
            // Default progress display
            this.addEv("onslide", function(sender) {
                sender.progressbar.canvas.style.width = Math.round(100 * sender.currentval/(sender.maxval - sender.minval))+"%";
            });
        }
        this.progressbar.setProps(progressProps);
    },

    slideToVal: function(val) {
        if (val < this.minval) val = this.minval;
        if (val > this.maxval) val = this.maxval;
        
        this.currentval =val;
        var prop = this.getTargetProp();
        this.pointer.setProp(prop, this.valueToPos(this.currentval, prop) );

        this.raise("onslide");
    },
    
    slideToPos: function(pos) {
        var prop = this.getTargetProp();
        if (this.pointer["min"+ prop] > pos)    pos = this.pointer["min"+ prop];
        if (this.pointer["max"+ prop] < pos)    pos = this.pointer["max"+ prop];
   
        this.currentval = this.posToValue(pos, prop);        
        this.pointer.setProp(prop, pos);

        this.raise("onslide");
    },

    seek : function(percent) {
        if (percent < 0) percent =0;
        if (percent > 100) percent = 100;

        this.currentval = this.minval + (this.maxval - this.minval)* percent;
        var prop = this.getTargetProp();
        this.pointer.setProp(prop, this.valueToPos(this.currentval, prop) );
        
        this.raise("onslide");
    },

    valueToPos: function(val, prop){
        var rate = (val- this.minval) / (this.maxval - this.minval);
        return this.pointer["min"+prop] +  Math.round(rate* (this.pointer["max"+ prop] - this.pointer["min"+prop]) );
    },

    posToValue: function(pos, prop) {
        var rate = (pos- this.pointer["min"+prop])/(this.pointer["max"+prop] - this.pointer["min"+prop]);
        return this.minval + rate * (this.maxval - this.minval);
    },
    
    getTargetProp: function() {
        switch (this.type) {
            case "vertical":
                return "top";
            case "horizontal":
                return "left";
            case "both":
                return "width";
            default:
                return "height";
        }
    },

    getCurrentVal: function() { return this.currentval }
});