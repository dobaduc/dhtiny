$dh.Require("ctrl/richcanvas.js");
$dh.newClass("DHGridContainer", DHRichCanvas, {
    // nrow, ncol, width, height
    itemspacing:0, nrow:1, ncol:1,
    init: function(container, props) {
        DHRichCanvas.prototype.init.apply(this, [container, props]);
        this.setGridParams();        
    },
    
    setGridParams: function(width, height, ispace, nrow, ncol) {
        this.nrow = nrow || this.nrow;
        this.ncol = ncol || this.ncol;
        this.width = width|| this.width;
        this.height = height || this.height;
        this.itemspacing = ispace || this.itemspacing;
        var spw = this.itemspacing * (this.ncol-1), sph = this.itemspacing * (this.nrow - 1);
        if (spw < 0) spw = 0;
        if (sph < 0) sph = 0;
        this.itemheight = Math.floor((this.height - sph)/this.nrow);
        this.itemwidth = Math.floor((this.width - spw)/this.ncol);
                
        this.items = [];
        for (var i = 0; i < this.nrow; i++)
            this.items[i] = [];
    },

    refreshGrid: function() { // Redraw items
        for (var i = 0; i < this.nrow; i++)
            for (var j = 0; j < this.ncol; j++)
                if (!$dh.isNil(this.items[i][j]))
                    this.moveItemTo(this.items[i][j], i, j);
    },
    
    addItem: function(item, row, col) { // Item must implements GridItem interface        
        if (item.canvas.parentNode != this.canvas)
            $dh.addCh(this.canvas, item.canvas);
        if (arguments.length == 3)
            this.moveItemTo(item, row, col);
        else {
            var pos = this.getFirstBlankPlace();
            this.moveItemTo(item, pos.row, pos.col);
        }
    },

    getFirstBlankPlace: function() {
        for (var i = 0; i < this.nrow; i++) {
            for (var j = 0; j < this.ncol; j++) {
                if ($dh.isNil(this.items[i][j]))
                    return { row: i, col: j };
            }
        }
        return { row: -1, col: -1 };
    },

    moveItemTo: function(item, row, col) {
        var top = (this.itemheight + this.itemspacing ) * row;
        var left = (this.itemwidth + this.itemspacing) * col;
        item.setProps({"top": top, "left": left});
        
        // Change position of item inside array
        if (!$dh.isNil(item.gridRowIdx)) {
            this.items[item.gridRowIdx][item.gridColIdx] = null;
        }
        item.gridRowIdx = row;
        item.gridColIdx = col;
        // Clear existing item
        if (this.items[row][col])
            this.removeItem(this.items[row][col]);
        this.items[row][col] = item;
    },

    removeItem: function(item) {
        if (!$dh.isNil(item.gridRowIdx)) {
            this.items[item.gridRowIdx][item.gridColIdx] = null;
            $dh.rmCh(this.canvas, this.items[item.gridRowIdx][item.gridColIdx]);
        }
    }
});