// This class is written for managing grid layout
$dh.newClass("DHGridManager", null, { // This is an interface
    // Multiselect:   0 : single, 1: multiple-range, 2: multiple-separate
    // Value will be changed on Ctrl/Shift key pressed or Mouse dragged
    multiSelect: 0,
    init: function(_left, _top, _nrow, _ncol, _itemWidth, _itemHeight, _itemSpacing) {
        // Initialize array of item
        this.items = new Array();

        // Grid definition
        this.moveGridTo(_left || 0, _top || 0);
        this.setGridSize(_nrow || 6, _ncol || 3);
        this.setItemLayout(_itemWidth || 70, _itemHeight || 60, _itemSpacing || 24);

        this.refreshGrid();

        // Attach deselect event - mouse up
        $dh.addEv(document, "mouseup", function(ev) {
            var obj = ev.target || ev.srcElement;
            if (obj.className.indexOf("GridIcon") < 0) {
                var grids = $dh.instOf["GridManager"]; //$$dh.el(document,{className: "GridManager"});
                for (var k = 0; k < grids.length; k++) {
                    grids[k].selectItem(-1);
                }
            }
        });
    },

    moveGridTo: function(_left, _top) {
        this.left = _left;
        this.top = _top;
        //this.refreshGrid();
    },

    refreshGrid: function() { // Redraw items
        for (var i = 0; i < this.nrow; i++) {
            if ($dh.isNil(this.items[i]))
                this.items[i] = new Array();

            for (var j = 0; j < this.ncol; j++)
                if (!$dh.isNil(this.items[i][j])) {
                if (this.items[i][j].draw)
                    this.items[i][j].draw();
                this.moveItemTo(this.items[i][j], i, j);
            }
        }
    },

    setGridSize: function(_nrow, _ncol) {
        this.nrow = _nrow;
        this.ncol = _ncol;
        //this.refreshGrid();
    },

    setItemLayout: function(_itemWidth, _itemHeight, _itemSpacing) {
        this.itemWidth = _itemWidth;
        this.itemHeight = _itemHeight;
        this.itemSpacing = _itemSpacing;
        //this.refreshGrid();
    },

    addItem: function(item, row, col) {
        $dh.addCh(this, item);
        if (arguments.length == 3)
            this.moveItemTo(item, row, col);
        else {
            var pos = this.getFirstBlankPlace();
            this.moveItemTo(item, pos.row, pos.col);
        }
    },

    getFirstBlankPlace: function() {
        for (var i = 0; i < this.nrow; i++) {
            if ($dh.isNil(this.items[i])) {
                this.items[i] = new Array();
                return { row: i, col: 0 };
            }
            for (var j = 0; j < this.ncol; j++)
                if ($dh.isNil(this.items[i][j]))
                return { row: i, col: j };
        }
        return { row: -1, col: -1 };
    },

    moveItemTo: function(item, row, col) {
        // Change position inside grid
        var top = this.top + (this.itemHeight + this.itemSpacing - 1) * row;
        var left = this.left + (this.itemWidth + this.itemSpacing - 1) * col;
        $dh.pos(item, [left, top]);

        // Change position inside array
        if (!$dh.isNil(item.gridRowId)) {
            this.items[item.gridRowId][item.gridColId] = null;
        }
        item.gridRowId = row;
        item.gridColId = col;
        this.items[row][col] = item;
    },

    removeItem: function(row, col) {
        if (!$dh.isNil(item.gridRowId)) {
            this.items[item.gridRowId][item.gridColId] = null;
            $rmCh(this, this.items[item.gridRowId][item.gridColId]);
        }
    },

    selectItem: function(row, col) {
        if (row >= 0) {// If row <0, select nothing
            if (this.items[row][col].onSelected)
                this.items[row][col].onSelected();
            this.items[row][col].isSelectedIcon = true;
            this.onSelectItem(this.items[row][col]);
        }

        if (this.multiSelect == 0 || row < 0) {
            for (var i = 0; i < this.nrow; i++)
                for (var j = 0; j < this.ncol; j++)
                if (!(i == row && j == col && this.multiSelect == 0) || row < 0) {
                if ($dh.isNil(this.items[i][j]))
                    continue;
                this.items[i][j].isSelectedIcon = false;
                if (this.items[i][j].onDeselected)
                    this.items[i][j].onDeselected();
            }
        }
    },
    onSelectItem: function(item) { }
});

$dh.newClass("GridIcon", null, { // This is an interface for any types of container
    _elementType: "div",
    init: function(_parentGrid, _label, _type, _imgWidth, _imgHeight, _lbWidth, _lbHeight) {
        this.style.position = "absolute";
        this.parentGrid = _parentGrid;
        $dh.size(this, [_parentGrid.itemWidth, _parentGrid.itemHeight]);

        this.iconType = _type;
        this.labelText = _label;

        this.setImageSize(_imgWidth || 34, _imgHeight || 34);
        this.setLabelSize(_lbWidth || 60, _lbHeight || 15);

        this.parentGrid.addItem(this);
        this.onmouseout();
    },

    setImageSize: function(_imgWidth, _imgHeight) {
        this.imgWidth = _imgWidth;
        this.imgHeight = _imgHeight;
        this.drawImage();
    },

    setLabelSize: function(w, h) {
        this.labelWidth = w;
        this.labelHeight = h;
        this.drawLabel();
    },

    drawImage: function() {
        w = this.imgWidth;
        h = this.imgHeight;
        var left = Math.floor((this.parentGrid.itemWidth - w) / 2);

        name = GridIcon.TypeName[this.iconType]
        this.image = $dh.New("img", { src: "webtop/images/" + name + ".gif", bounds: [left, 0, w, h], className: "GridIconImage" })
        $dh.addCh(this, this.image);
        this.image.style.cursor = "pointer";
        this.image.title = this.labelText;

    },

    drawLabel: function() {
        w = this.labelWidth;
        h = this.labelHeight;

        var left = Math.floor((this.parentGrid.itemWidth - w) / 2);
        var top = Math.floor(this.parentGrid.itemHeight - h - 5);
        this.label = $dh.New("div", { html: this.labelText, bounds: [left, top, w, h], className: "GridIconLabel" });
        $dh.addCh(this, this.label);

        this.label.title = this.labelText;
        this.label.style.cursor = "pointer";
    },

    draw: function() {
        this.drawImage();
        this.drawLabel();
    },

    onmouseover: function() { $dh.opac(this, 100); },
    onmouseout: function() { $dh.opac(this, 65); },

    onclick: function() {
        if (this.isSelectedIcon != true)
            this.parentGrid.selectItem(this.gridRowId, this.gridColId);
    },

    onSelected: function() {
        $dh.css(this.label, { bg: "#ee0011", border: "dotted 1px white" })
    },

    onDeselected: function() {
        $dh.css(this.label, { bg: "", overflow: "hidden", border: "" })
        this.image.style.border = "";
        $dh.set(this, { opac: 65 });
    }
});

GridIcon.TypeName = ["ifolder", "ifile", "isearch", "iinternet", "iexplorer"];