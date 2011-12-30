$dh.Require("ctrl/imgbutton");
$dh.newClass("DHRichButton", DHImgButton, {
    init: function(container, props) {
        this.__defaults__ = this.__defaults__ || { imgWidth: 16, imgPadding: 7 };
        DHImgButton.prototype.init.apply(this, [container, props]);
        this.drawLabel();
    },
    drawIcon: function() {
        this.icon = document.createElement("img");
        this.icon.style.cssText += ";width:" + (this.imgWidth) + "px;height:100%;";
        this.canvas.appendChild(this.icon);
        $dh.imgList.setImage(this.icon, this.image);
    },
    drawLabel: function() {
        this.label = document.createElement("div");
        this.label.style.cssText = ";position:absolute;width:100%;height:100%;white-space:nowrap;top:0px;left:" + (this.imgWidth + this.imgPadding) + "px;";
        this.canvas.appendChild(this.label);
        this.label.innerHTML = this.text;
    },
    setProp: function(p, val) {
        this[p] = val;
        if (p == "text") {
            if (this.label)
                this.label.innerHTML = this.text;
        }
        else
            DHImgButton.prototype.setProp.apply(this, arguments);
    },    
    onMouseOver: function() {
        if (this.image_over) $dh.imgList.setImage(this.icon, this.image_over);
    },
    onMouseDown: function() {
        if (this.image_down) $dh.imgList.setImage(this.icon, this.image_down);
    },
    onMouseOut: function() { $dh.imgList.setImage(this.icon, this.image); },
    onMouseUp: function() { $dh.imgList.setImage(this.icon, this.image_over || this.image); }
});