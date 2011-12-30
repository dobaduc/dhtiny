// JScript ファイル
$dh.newClass("DHGUIControlManager", [],
{
    init: function(_form, _cvsid, _dragmode) {
        this.multipleSelectFlag = false; // By Default
        this.GUIControls = new Array();
        
        if (window.__GUIControlManagerInitFlag != true) {
            window.__GUIControlManagerInitFlag = true;
            $dh.addEv(document,"mousemove", null);
            $dh.addEv(document,"mouseup", null);
        }
    },
    
    getSelectedItems: function() {
        var a = new Array();
        for (var x =0; x < this.GUIControls.length; x++)
            if (this.GUIControls[x].selectedFlag == true)
                a.push(this.GUIControls[x]);
        return a;
    },
    
    setSelected: function (item) {
        if (!this.multipleSelectFlag) {
            this.clearSelectedItems();
            this.changeSelectedStatus(item, true);
            return;
        }
        
        if (this.shiftSelect != true && this.dragSelect != true) {
            if (item.selectedFlag == true) {
                this.changeSelectedStatus(item, false);
            }
            else {
                this.selectedFlagIndex = item.index;
                this.changeSelectedStatus(item, true);
            }
        }
        
        if (this.shiftSelect == true || this.dragSelect == true) {
            if (!$dh.isNil(this.selectedFlagIndex) && !$dh.isNil(this.selectedFlagIndex2))
                this.drawRange(this.selectedFlagIndex, this.selectedFlagIndex2, false);
            
            if ($dh.isNil(this.selectedFlagIndex)) this.selectedFlagIndex = item.index;
            this.selectedFlagIndex2 = item.index;
                
            this.drawRange(this.selectedFlagIndex, this.selectedFlagIndex2, true);
        }
    },
    
    clearSelectedItems: function() {
        var count= 0;
        for (var x = 0 ; x< this.GUIControls.childNodes.length; x++)
            if (this.GUIControls.childNodes[x].selectedFlag == true) {
                this.changeSelectedStatus(this.GUIControls.childNodes[x], false);
                count++;
            }
        return count; // Number of cleared selected items
    },
    changeSelectedStatus: function(item, selectedFlag) {
        if (item.selectedFlag == selectedFlag)     // Be careful!!!
            return;
        if (selectedFlag == false)
            this.drawSelected(item);
        else
            this.drawUnselected(item);
    },
      
    redrawGUIControlLayout: function() {
    },
    
    setItemEvent: function(item) {
        item.onmousedown = function(ev) {
            ev = $ev(ev);
            var selectbox = this.parentNode.parent;
            var saveMulti = selectbox.multipleSelectFlag;
            
            selectbox.multipleSelectFlag = ev.ctrlKey || ev.shiftKey;
            if (saveMulti == true && selectbox.multipleSelectFlag == false)
                selectbox.clearSelectedItems();
            
            selectbox.shiftSelect = ev.shiftKey;
            selectbox.ctrlSelect = ev.ctrlKey;
            if (!selectbox.shiftSelect) 
                selectbox.selectedFlagIndex2= null;
            selectbox.setSelected(this);
            
            // Handle drag& drop
            window.currentSelectbox = selectbox;
        }
    },
    
    drawSelectedItem: function(item) {},
    drawUnselectedItem: function(item) {},
    onSelectedItem: function(item) {},
    onUnselectedItem: function(item) {}
});

//=============== Add global drag& drop manager for list selection action =================
DHSelectbox.GlobalSelectboxEV_mousemove = function (ev){
    if ($dh.isNil(window.currentSelectbox))
        return;
    var box = window.currentSelectbox;
    var boxBounds = box.$dh.bounds(window.currentSelectbox.GUIControls);
    var itemHeight = box.$dh.bounds(box.GUIControls.childNodes[0]).height;
    var msTop = $ev(ev).page.y;
    var boxTop = boxBounds.top - parseInt(box.GUIControls.scrollTop); // Real top
    
    if (msTop < boxTop)  // Nothing to do, out of the list now
        return;
    
    var itemIndex = Math.floor((msTop - boxTop) / itemHeight);
    
    if (itemIndex > box.GUIControls.childNodes.length-1) return; // Out of item list

    box.dragSelect = true;
    box.multipleSelectFlag = true;
    box.setSelected(box.GUIControls.childNodes[itemIndex]);
    
    if (msTop - boxBounds.top - boxBounds.height >= 0)
        box.GUIControls.scrollTop += msTop - boxBounds.top - boxBounds.height;
    if (msTop - boxBounds.top <= 0)
        box.GUIControls.scrollTop += msTop - boxBounds.top;
};

DHSelectbox.GlobalSelectboxEV_mouseup = function(ev) {
    if (window.currentSelectbox) {
        window.currentSelectbox.dragSelect = null;
        window.currentSelectbox = null;
    }
};