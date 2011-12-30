$dh.Require("ctrl/richcanvas");
$dh.isLoaded("ctrl/selectbox", true);

$dh.newClass("DHSelectBox", null, {
    init: function(_container, _props) {
        DHRichCanvas.prototype.init.apply(this, [container, props]);
        this.canvas = $dh.New("div");
        this.maxSize = 10;
        this.redraw();
        this.multiple = false; // By Default
    },

    setMaxSize: function(s) {
        if ($dh.isNil(this.list))
            return;
        this.maxSize = s;
        var itemHeight = $dh.size(this.list.childNodes[0]).height;
        this.list.style.height = (itemHeight * s) + "px";
    },

    loadItemData: function(_data) { // Temporary accept text data only, Just use redrawFlag on initizaliation
        this.data = _data;
        if (!$dh.isNil(this.list)) {
            this.canvas.removeChild(this.list);
            this.list = null;
        }
        this.redraw();
        this.selectedIndex = null;
    },

    getSelectedItems: function() {
        var a = new Array();
        for (var x = 0; x < this.list.childNodes.length; x++)
            if (this.list.childNodes[x].selected == true)
            a.push(this.list.childNodes[x]);
        return a;
    },

    setSelected: function(item) {
        // Single mode, shift-mode and control-mode
        if (item.selected == true && this.rangeSelect != true) {
            this.drawItem(item, false);
            this.selectedIndex = null;
            return;
        }

        if (this.rangeSelect != true) {
            var saveIndex = this.selectedIndex;
            // Unselect selected item
            if (!$dh.isNil(saveIndex) && !this.multiple)
                this.drawItem(this.list.childNodes[saveIndex], false);
            this.selectedIndex = item.index;
            this.drawItem(item, true);
            this.onSelectedItem(item);
        }

        if (this.rangeSelect == true) {
            if (!$dh.isNil(this.selectedIndex) && !$dh.isNil(this.selectedIndex2))
                this.drawRange(this.selectedIndex, this.selectedIndex2, false);

            if ($dh.isNil(this.selectedIndex)) this.selectedIndex = item.index;
            this.selectedIndex2 = item.index;

            this.drawRange(this.selectedIndex, this.selectedIndex2, true);
        }
    },

    clearSelectedItems: function() {
        for (var x = 0; x < this.list.childNodes.length; x++)
            this.drawItem(this.list.childNodes[x], false);
    },
    drawItem: function(item, selectedFlag) {
        if (item.selected == selectedFlag)     // Be careful!!!
            return;
        if (selectedFlag == false) {
            item.selected = false;
            item.style.backgroundColor = "";
            item.style.color = "";
        }
        else {
            item.selected = true; // Mark up
            item.style.backgroundColor = "blue"; //className = "SelectedItem";
            item.style.color = "white";
        }
    },

    drawRange: function(i1, i2, selectedFlag) {
        if (i1 > i2) {
            var temp = i1;i1 = i2;i2 = temp;
        }
        for (var k = i1; k <= i2; k++)
            this.drawItem(this.list.childNodes[k], selectedFlag);
    },

    getItem: function(index) {return this.list.childNodes[index];},
    redraw: function() {
        // Draw the list first
        if ($dh.isNil(this.list)) {
            this.list = document.createElement("ul");
            this.list.className = "Selectbox";
            this.list.parent = this;
            this.canvas.appendChild(this.list);
        }

        // Set up content
        if ($dh.isNil(this.data)) return;
        var listContent = "";
        for (var i = 0; i < this.data.length; i++)
            listContent += "<li>" + this.data[i][0] + "</li>";
        this.list.innerHTML = listContent;

        var itemHeight = $dh.bounds(this.list.childNodes[0]).height;
        this.list.style.height = (itemHeight * this.maxSize) + "px";

        for (i = 0; i < this.data.length; i++) {
            this.list.childNodes[i].index = i;
            this.list.childNodes[i].itemValue = this.data[i][1];

            this.list.childNodes[i].onmousedown = function(ev) {
                ev = $dh.evt(ev);
                var selectbox = this.parentNode.parent;
                var saveMulti = selectbox.multiple;

                selectbox.multiple = ev.ctrlKey || ev.shiftKey;
                if (saveMulti == true && selectbox.multiple == false)
                    selectbox.clearSelectedItems();

                selectbox.rangeSelect = selectbox.multiple && ev.shiftKey;
                if (!selectbox.rangeSelect) selectbox.selectedIndex2 = null;
                selectbox.setSelected(this);
            }
        }
        this.list.onmousedown = function(ev) {return false;}
        this.list.onselectstart = function() {return false;}
    },
    drawCombobox: function() { },
    onDropDown: function() { },
    onCloseDropDown: function() { },
    onChange: function() { } // Null
});