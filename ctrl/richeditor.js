$dh.Require(["ctrl/richcanvas","ctrl/imgbutton", "ctrl/imglist"]);
$dh.isLoaded("ctrl/richeditor", true);

$dh.newClass("DHRichEditor", DHRichCanvas, {
    init: function(_placeHolder, _props) {
        this.__defaults__ = {}
        DHRichCanvas.prototype.init.apply(this, [document.body,props]);
    }
});