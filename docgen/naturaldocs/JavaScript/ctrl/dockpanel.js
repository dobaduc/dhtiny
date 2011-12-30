$dh.Require("ctrl/animitem");
$dh.isLoaded("ctrl/dockpanel", true);

$dh.newClass("DHDockPanel", DHAnimItem, {
    init: function(container, props) {
        // Props: 
        //  dockpos: left/right/top/bottom
        //  autohide: true/false
        var dockpos = props.dockpos || "left";
        delete props.dockpos;        
        DHAnimItem.prototype.init.apply(this,arguments);        
        this.setDockPos(dockpos);
        this.setAutoHideEvents(this.autohide);
    },
    setProp: function(p, value) {
        if ("dockpos".indexOf(","+p) < 0) this.setDefault(p, value);
        else switch(p) {
            case "dockpos":
                this.setDockPos(value);
                break;
        }
    },
    setDockPos: function(pos, dprops) {
        this.canvas.style.position = "absolute";
        this.dockpos = pos;
        var op = {"left":"right", "right":"left", "top": "bottom", "bottom":"top"};
        this.setProp(op[pos],"auto");
        this.setProp(pos, 0);
        // Set additional props
        if (dprops) this.setProps(dprops);
        var side = (this.dockpos == "left" || this.dockpos == "right") ? "width": "height";        
        this["max"+side] = this[side];
    },
    
    setAutoHideEvents: function() {    
        this.addEv("onmouseover", function(sender, ev) {
            this.animation.stop();
            this.maximize();
        });
        this.addEv("onmouseout", function(sender, ev) { 
            this.animation.stop();
            this.minimize();
        });
    },
    maximize: function() {
        if ($dh.isNil(this.dautohide)) return;
        var side = (this.dockpos == "left" || this.dockpos == "right") ? "width": "height";
        var tar = {};
        tar[side] = this["max"+side];
        this.draw(tar, 1);
    },
    
    minimize: function() {
        if ($dh.isNil(this.dautohide)) return;
        var tar = {}, side;
        var side = (this.dockpos == "left" || this.dockpos == "right") ? "width": "height";
        tar[side] = this.dautohide;
        this.draw(tar, 1);
    }
});