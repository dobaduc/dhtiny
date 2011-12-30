$dh.Require("util/animation");
$dh.isLoaded("ctrl/dynablo/story", true);
$dh.newClass("dynablo.story", DHParallelMotions, {
    /*
     * Properties
     */
    
    // Use this to enable/disable/change speed of animations
    speedRatio: 1,
    
    /*
     * Methods
     */
    init : function() {
        DHParallelMotions.prototype.init.apply(this, arguments);
        // Self handling all events
        this.addEv(this);
    },

    addChild: function(motion, timebefore) {
        var child;
        if (!(motion instanceof DHMotionSequence)){
            child = new DHMotionSequence();
            child.addChild(motion, timebefore);            
        }
        else child = motion;
        DHParallelMotions.prototype.addChild.apply(this, [child]);
    }
});