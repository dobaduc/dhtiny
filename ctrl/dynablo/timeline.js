$dh.Required("ctrl/dynablo/story");
$dh.isLoaded("ctrl/slider", true);
$dh.newClass("dynablo.slider", DHRichCanvas, {
    /*
     * Properties
     */
    
    /*
     * Methods
     */
    init : function(container, props) {
        // Be careful...
        this.pointer = new DHRichCanvas(this.canvas, {position    : "absolute", left: 0, top: 0 } );       
        DHRichCanvas.prototype.init.apply(this, arguments);
    },

    setPointerProps: function(ptProps) {
        if (!ptProps) returns;
        this.pointer.setProps(ptProps);
    },
    
    displayTime: function(currentTime, duration) {
        
    }
});