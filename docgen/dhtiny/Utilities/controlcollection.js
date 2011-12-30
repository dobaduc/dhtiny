// UI control collection interface
$dh.newClass("DHControlManager",  {
    // Multiselect:   0 : single, 1: multiple
    // Value will be changed on Ctrl/Shift key pressed or Mouse dragged
    multiSelect: 0,
    selectedIndex: 0,
    selectStarted: false,
     
    doSelectItem: function(row, col) {
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
    
    doUnselectItem: function(item) {
    },    
    onItemSelected: function(item) {
    },
    onItemUnselected: function(item) { // Just a dummy method 
    }
});