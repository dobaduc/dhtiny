// This class is written to handle basic animation item with default canvas
$dh.Require(["ctrl/richcanvas","util/animation","util/color"]);
$dh.isLoaded("ctrl/animitem", true);

$dh.newClass("DHAnimItem", DHRichCanvas, DHMotion, {
    init: function(container, props) {
        DHRichCanvas.prototype.init.apply(this, [container, props]);
        if (container && !container.tagName) {
            props = container;
        }
        
        this.initAnimation(props);       
        this.draw(props);
    },
    /**
     * Set animation destination
     */
    setAnimDes: function(animDes) {
         this.setAnimation(animDes);
    },
    /**
     * Set animation destination by delta
     */
    setAnimDelta: function(animDelta) {
         this.setAnimation(animDelta, null, null, true);
    },
    /**
     * Initialize animation properties
     */
    initAnimation: function(props) {
        // Val is percentage
        var self = this;
        this.setPropValue = function(val) {
            for (var p in self.animDelta) {
                if (p.toLowerCase().match(/color/)) {
                    var r =  Math.floor(self.animStart[p].r + self.animDelta[p].r * val / 100);
                    var g =  Math.floor(self.animStart[p].g + self.animDelta[p].g * val / 100);
                    var b =  Math.floor(self.animStart[p].b + self.animDelta[p].b * val / 100);
                    r = (r> 255)? 255: (r < 0 ? 0: r);
                    g = (g> 255)? 255: (g < 0 ? 0: g);
                    b = (b> 255)? 255: (b < 0 ? 0: b);
                    self[p]= "rgb("+r+","+g+","+b+")";
                } else {
                    self[p] = Math.floor(self.animStart[p] + self.animDelta[p] * val / 100);
                }
            }
            self.draw();
            self.onAnimation(val);
            self.raise("onanimation", val);
        }
        this.addEv("onstart", function() {self.onAnimStart();self.raise("onanimstart");} );
        this.addEv("onstop", function() {self.onAnimStop();self.raise("onanimstop");} );
        
        this.targetObj = this.canvas;
        this.setParams(props.exeFunc, props.duration);       


        // Set default anim values
        this.animStart = this.animStart || props;
        this.canvas.style.position = "absolute";
        
        // By default, all given options will become Item's properties
        this.animDelta = this.animDelta || {};
        //$dh.set(this.animDelta, this.animStart);

        // Compatible with old version -- not really tidy but works
        this.animation = this;
        $dh.preventLeak(this, "animation");
    },
    /**
     * Draw object using specified properties.
     * If _deltaFlag_ is true, des is treated as difference (delta)
     */
    draw: function(des, duration , exeFunc, _deltaFlag_) {
        if ($dh.isNil(duration)) {
            if ($dh.isNil(des)) des = {}; // On animation
            for (var p in this.animStart) { // For redraw at anytime
                if ($dh.isNil(des[p])) des[p] = this[p];
            }
            this.setProps(des);
        }
        else {
            this.setAnimation(des, duration, exeFunc, _deltaFlag_);
            this.start();
        }
    },

    drawDelta: function(delta, duration, exeFunc) {
        this.draw(delta, duration, exeFunc, true);
    },

    // If _deltaFlag_ is true, don't need to calculate animDelta
    setAnimation: function(des, duration, exeFunc, _deltaFlag_) {
        this.setParams(exeFunc || DHMotion.AnimEffects.strongEaseOut, duration);
        des = des || {};

        this.animDelta = _deltaFlag_ ? des : {};
        this.animStart = {};        

        for (var p in des) {  // Save animation's start status & calculate difference
            this.animStart[p] = this.getProp(p);

            // Special process for color
            if (p.toLowerCase().match(/color/)) {
                this.animStart[p] = $dh.color.getRGBHash(this.animStart[p]);
                des[p] = $dh.color.getRGBHash(des[p]);
            }
            
            if (!_deltaFlag_) {
                try {
                    if (p.toLowerCase().match(/color/)) {
                        this.animDelta[p] = {};
                        this.animDelta[p].r = des[p].r -  this.animStart[p].r;
                        this.animDelta[p].g = des[p].g -  this.animStart[p].g;
                        this.animDelta[p].b = des[p].b -  this.animStart[p].b;                        
                    }
                    else
                        this.animDelta[p] = des[p] - this.animStart[p];
                } catch (_error_) {}
            }
        }
    },
    onAnimation: function() {},
    onAnimStart: function() { },
    onAnimStop: function() { }
});
