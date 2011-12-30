$dh.Require("ctrl/richbutton");
$dh.New("DHRichList", DHRichCanvas, {
    init: function(container, props) {
        this.__defaults__ = {itemHeight: 25, itemSpacing: 2, imgWidth: 18, imgPadding: 7, boundMargin: 4, maxVisibleItem: 5, buttonSize: 12,
            deleteMsg: "Do you want to delete this item?",
            editText: "Add new item",
            addText: "Add new item",
            bmExistMsg: "Item is already existing"
        };
        DHRichCanvas.prototype.init.apply(this, arguments);
        this.canvas.style.cssText += ";position:absolute;overflow:hidden;cursor: default;";
        this.items = [];

        var self = this;
        this.addItem({text: this.addText, type: "head", onClick: function() {self.doEditItem();}});
        //this.addItem({ text: "ブックマークを編集", type: "head", onClick: function() { /*self.doEditItem(1);*/ } });
        this.itemContainer = new DHRichCanvas(this.canvas, {
            overflow: "auto", height: this.itemHeight * (this.maxVisibleItem + 1) + this.itemSpacing * 2,
            onMouseOut: function() {
                self.showEditButtons(false); //.style.visibility = "hidden";
            }
        });

        this.canvas.style.height = this.itemHeight * (this.maxVisibleItem + 2) + this.itemSpacing * 3 + this.boundMargin * 3 + "px";
        this.createEditButtons();
    },
    addItem: function(props) { // text
        if (props.type == "head") {
            var item = new DHRichCanvas(this.canvas, {margin: this.boundMargin, textAlign: "center",height: this.itemHeight});
            props.borderBottom = "solid 2px gray";
            props.innerHTML = props.text;
        }
        else {
            var item = new DHRichButton(this.itemContainer.canvas, {margin: this.boundMargin, image: this.imageSrc + "bookmark_icon.gif", text: props.text});
            this.items.push(item);
            item.itemIndex = this.items.length;
        }

        $dh.set(props, {
            cssText: "left:0px;overflow:hidden;position:relative;margin-bottom:" + (this.itemSpacing) + "px;",
            height: this.itemHeight,
            lineHeight: this.itemHeight
        });
        item.setProps(props);
        this.setItemEvents(item);
        return item;
    },

    createEditButtons: function() {
        var div = this.editButtons = document.createElement("div");
        div.style.cssText += ";position:absolute;visibility:hidden;z-index:99;width:" + (3 * this.buttonSize) + "px;height:" + this.buttonSize + "px;right:" + this.boundMargin + "px;";

        this.editBut = document.createElement("img");
        this.editBut.style.cssText += ";position:absolute;top:3px;width: " + this.buttonSize + "px; height:" + this.buttonSize + "px;right:" + Math.floor(1.5 * this.buttonSize) + "px;";
        this.editBut.src = this.imageSrc + "bookmark_edit.gif";
        this.editBut.title = "Edit";

        this.deleteBut = document.createElement("img");
        this.deleteBut.style.cssText += ";position:absolute;top:3px;width: " + this.buttonSize + "px; height:" + this.buttonSize + "px;right:0px;";
        this.deleteBut.src = this.imageSrc + "bookmark_close.gif";
        this.deleteBut.title = "Delete";

        div.appendChild(this.editBut);
        div.appendChild(this.deleteBut);

        var self = this;
        $dh.addEv(div, "onmouseover", function() {
            div.parent.broadcast("onmouseover");
        });

        $dh.addEv(this.editBut, "onclick", function() {
            self.showEditButtons(false);
            self.doEditItem(self.editButtons.parent);
        });
        $dh.addEv(this.deleteBut, "onclick", function() {
            if (!self.stopEditing())
                return;
            if (!confirm(self.deleteMsg))
                return;
            self.showEditButtons(false);
            self.removeItem(self.editButtons.parent);
        });
        this.itemContainer.canvas.appendChild(div);
    },
    showEditButtons: function(flag, item) {
        if (flag == false) {
            this.editButtons.style.visibility = "hidden";
            if (this.editButtons.parent)
                this.editButtons.parent.setProp("background", "");
        }
        else if (item.type != "head" && item.type != "edit") {
            this.editButtons.style.visibility = "visible";
            //document.title = item.canvas.offsetTop  this.itemContainer.canvas.scrollTop;
            if ($dh.browser.ie)
                this.editButtons.style.top = (item.canvas.offsetTop) + "px";
            else
                this.editButtons.style.top = (item.canvas.offsetTop - this.itemContainer.canvas.scrollTop) + "px";
            // Fix Firefox's scrollbar problem
            if (!$dh.browser.ie) {
                if (this.items.length < this.maxVisibleItem)
                    this.editButtons.style.right = this.boundMargin + "px";
                else
                    this.editButtons.style.right = (this.boundMargin + 20) + "px";
            }
            this.editButtons.parent = item;
            this.editButtons.parent.setProp("background", "gray");
        }
    },
    removeItem: function(idx) {
        var item;
        if ($dh.isNum(idx))
            item = this.items[idx];
        else
            item = idx;
        this.itemContainer.canvas.removeChild(item.canvas);
        this.items.splice(item.itemIndex);
    },
    doEditItem: function(idx) {
        var item, editText;
        if (!this.stopEditing())
            return;

        if (!$dh.isNil(idx)) { // idx != null: Edit existing item
            if ($dh.isNum(idx))
                item = this.items[idx];
            else
                item = idx;
            editText = item.label.innerHTML;
        }
        else { // idx = null: Insert new item
            item = this.addItem({text: "", type: "edit"});
            editText = this.editText;
        }
        item.label.innerHTML = "<input value ='" + editText + "' type='text' style='width:100%;height:100%;'/>";
        item.label.childNodes[0].focus();
        item.type = "edit";
        this.currentEditItem = item;

        var self = this;
        var updateContent = function() {
            // Finished editing
            if (!self.checkBookmarkName(item, item.label.childNodes[0].value)) {
                alert(self.bmExistMsg);
                item.label.childNodes[0].focus();
                return;
            }
            item.label.innerHTML = item.label.childNodes[0].value;
            item.setProp("text", item.label.innerHTML);            
            item.setProp("title", item.label.innerHTML);
            item.type = "";
            // Trick to hack IE error
            item.canvas.scrollLeft = 0;
            item.canvas.scrollTop = 0;
            // Broadcast
            self.currentEditItem = null;
            self.broadcast("onitemchanged", item);
        };
        $dh.addEv(item.label.childNodes[0], "keydown", function(ev) {
            if ($dh.evt(ev).keyCode == 13) {
                self.stopEditing();
            }
        });
        $dh.addEv(item.label.childNodes[0], "blur", updateContent);
    },

    setItemEvents: function(item) {
        var self = this;
        item.addListener("onmouseover", function(sender, ev) {
            if (sender.type == "head" || sender.type == "edit") return;
            //sender.setProp("background", "gray");
            self.showEditButtons(true, sender);
        });

        if (item.type != "head")
            item.addListener("onclick", function(sender) {
                if (sender.type != "edit") {
                    // Recheck editing item
                    if (self.stopEditing())
                        self.broadcast("onitemselected", sender);
                }
                else
                    sender.label.childNodes[0].focus();
            });
    },

    stopEditing: function() {
        var ret = true;
        if (this.currentEditItem) {
            ret = this.checkBookmarkName(this.currentEditItem, this.currentEditItem.label.childNodes[0].value);
            this.currentEditItem.label.childNodes[0].focus();
            if (this.currentEditItem.label.childNodes[0].onblur)
                this.currentEditItem.label.childNodes[0].onblur();
            else
                this.currentEditItem.label.childNodes[0].blur();
        }
        return ret;
    },

    saveBookmark: function(rootTree, item) {
        if (item.path)
            return;
        var node = rootTree;
        if (!node) return;
        var path = [{nodeIndex: null, clickCount: null, text: node.text, iconType: node.iconType, treeRadius: node.treeRadius, radius: node.radius}];
        while (node.activeBranch >= 0) {
            var bnode = node.branches[node.activeBranch].node;
            path.push({nodeIndex: node.activeBranch, text: bnode.text, iconType: bnode.iconType, clickCount: bnode.clickCount, treeRadius: rootTree.treeRadius, radius: bnode.radius});
            node = node.branches[node.activeBranch].node;
        }
        item.path = path;
    },

    checkBookmarkName: function(item, name) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] != item && this.items[i].text == name)
                return false;
        }
        return true;
    }
});