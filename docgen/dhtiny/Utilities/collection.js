// 1 dimension collection utility class
$dh.newClass("DHCollection", {
    init: function(_items) {
        if ($dh.isArr(_items))
            this.items = _items;
        else
            this.items = [];
    },

    addItem: function(_item, _idx) {
        if ($dh.isNil(_idx))
            this.items.push(_item);
        else
            this.items.splice(_idx, 0, _item);
    },

    removeItem: function(_idx) {
        if (!$dh.isNum(_idx)) // Remove given object, not given index
            this.removeItem(this.getItemIndex(_idx));
        else
            this.items.splice(_idx, 1);
    },

    clearItems: function() {
        while (this.items.length > 0)
            this.items.pop();
    },

    getItemIndex: function(_item) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] == _item)
                return i;
        }
        return -1;
    },
    toStr: function(_deli) {
        return this.items.join(_deli || ",");
    }
});

// 2 dimensions collection utility class
$dh.newClass("DH2DCollection", {
    init: function(_items) {
        if ($dh.isArr(_items)) {
            this.items = _items;
            this.nRow = _items.length;
            this.nCol = _items[0].length;
        }
        else {
            this.items = [];
            this.setSize(arguments[0], arguments[1]);
        }
    },

    setSize: function(nr, nc) {
        this.nRow = nr;
        this.nCol = nc;
        for (var i = 0; i < this.nRow; i++)
            if (!this.items[i])
            this.items[i] = [];
    },

    addItem: function(_item, _ix, _iy) {
        if ($dh.isNil(_ix)) {
            var pos = this.getItemIndex(null);
            this.items[pos.row][pos.col] = _item;
            return pos;
        }
        else
            this.items[_ix][_iy] = _item;
    },

    removeItem: function(_ix, _iy) {
        if (!$dh.isNum(_ix)) { // Remove given object, not given index
            var pos = this.getItemIndex(_ix);
            this.removeItem(pos.row, pos.col);
        }
        else
            this.items[_ix][_iy] = null;
    },

    clearItems: function() {
        for (var i = this.nRow; i >= 0; i--) {
            for (var j = this.nCol; j >= 0; j--)
                delete this.items[i][j];
            delete this.items[i];
        }
    },

    getItemIndex: function(_item) {
        for (var i = 0; i < this.nRow; i++)
            for (var j = 0; j < this.nCol; j++) {
            if (this.items[i][j] == _item || ($dh.isNil(this.items[i][j]) && $dh.isNil(_item)))
                return { row: i, col: j };

        }
        return { row: -1, col: -1 };
    }
});
