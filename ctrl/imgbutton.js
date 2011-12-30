$dh.Require(["util/imglist","ctrl/richcanvas"]);
$dh.isLoaded("ctrl/imgbutton", true);

$dh.newClass("DHImgButton", DHRichCanvas, {
    init: function(container, props) {
        if (props && props.text)
            props.title = props.text;
        else if (props)
            props.title = "";
        DHRichCanvas.prototype.init.apply(this, [container, props]);
        this.drawIcon();
    },
    setText: function(p, val) {
        this.canvas.title = val;
    },
    setImage: function(src) {
        this.image = src;
        if (this.icon) {
            $dh.imgList.setImage(this.icon, this.image);
        }
    },
    drawIcon: function() {
        this.icon = document.createElement("img");
        this.icon.style.cssText += ";width:100%;height:100%;";
        this.canvas.appendChild(this.icon);
        $dh.imgList.setImage(this.icon, this.image);
    },
    onMouseOver: function() {
        if (this.image_over) $dh.imgList.setImage(this.icon, this.image_over || this.image +"_over");
    },
    onMouseDown: function() {
        if (this.image_down) $dh.imgList.setImage(this.icon, this.image_down || this.image +"_down");
    },
    onMouseOut: function() { 
        $dh.imgList.setImage(this.icon, this.image);
    },
    // Image_over is required to show this effect
    onMouseUp: function() { 
        $dh.imgList.setImage(this.icon, this.image_over || this.image);
    }
});