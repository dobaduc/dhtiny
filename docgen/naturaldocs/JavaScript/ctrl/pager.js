$dh.Require("ctrl/richcanvas");
$dh.isLoaded("ctrl/pager", true);

$dh.newClass("DHPager", DHRichCanvas, {
    init: function(container, props) {
        DHRichCanvas.prototype.init.apply(this, [container, props]);
        this.canvas.style.cssText += ";cursor:default;position:absolute;font-family:Arial";
        this.currentPage = 0;
        this.totalPage = 0;
        this.drawParts();
    },
    setProp: function(p, val) {
        this[p] = val;
        if (p == "currentPage" || p == "numberOfPage") {
            this.title.innerHTML = this.currentPage + "/" + this.numberOfPage;
        }
        else
            DHRichCanvas.prototype.setProp.apply(this, arguments);
    },
    drawParts: function() {
        this.butprev = document.createElement("span");
        this.butprev.style.cssText += ";position:absolute;top:0px;left:0px;width:10px;z-index:1;";
        this.butprev.innerHTML = "◄";

        this.butnext = document.createElement("span");
        this.butnext.style.cssText += ";position:absolute;top:0px;right:0px;width:10px;z-index:1";
        this.butnext.innerHTML = "►";

        this.title = document.createElement("span");
        this.title.style.cssText += ";width:100%;height:100%;text-align:center;position:absolute;top:0px;left:0px;z-index:0;";

        this.canvas.appendChild(this.title);
        this.canvas.appendChild(this.butnext);
        this.canvas.appendChild(this.butprev);
        this.setEvents("next");
        this.setEvents("prev");
    },
    setEvents: function(name) {
        var self = this;
        var but = self["but" + name];
        $dh.addEv(but, "mouseover", function() {but.style.color = self.overColor || "green";});
        $dh.addEv(but, "mouseout", function() {but.style.color = "";});
        $dh.addEv(but, "click", function() {self.broadcast("ongo" + name);});        
    }
});