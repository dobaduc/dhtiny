$dh.Require("ctrl/imgbutton");
$dh.New("DHToolbar", DHRichCanvas, {
    init: function(container, props) {
        this.__defaults__ = this.__defaults__ || {itemWidth: 35, itemHeight: 25, itemSpacing: 5, itemPadding: 10};
        DHRichCanvas.prototype.init.apply(this, arguments);
        this.setProp("height", this.itemHeight + (2 * this.itemPadding));
        this.items = [];
        this.canvas.style.position = "relative";
    },
    addItem: function(txt, props) {
        var test = {
            top: this.itemPadding,
            left: this.itemPadding + (this.itemWidth + this.itemSpacing) * this.items.length,
            text: txt,
            cssText: "position:absolute;border:solid 1px gray",
            image: "images/theme0/home_S_iatv.gif",
            image_over: "images/theme0/home_S_atv.gif",
            image_down: "images/theme0/circle_M_iatv.gif",
            height: this.itemHeight,
            width: this.itemWidth
        }
        $dh.set(test, props);
        var item = new DHImgButton(this.canvas, test);
        this.items.push(item);
        item.itemIndex = this.items.length;

        this.setProp("width", 2 * this.itemPadding + (this.itemWidth + this.itemSpacing) * this.items.length)

        this.setItemEvents(item);
        return item;
    },

    setItemEvents: function(item) {
        var self = this;
        item.addListener("onclick", function() {self.onItemSelected(this);});
    },

    onItemSelected: function(item) {
    },
    removeItem: function(idx) {
        var item;
        if ($dh.isNum(idx))
            item = this.items[idx];
        else
            item = idx;
        this.canvas.removeChild(item.canvas);
        this.items.splice(item.itemIndex);
    }
});