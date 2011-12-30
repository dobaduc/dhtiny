/* Table-based form class - Written using DHTiny Javascript library by DO BA DUC */

/*MIT LICENSE

Copyright (c) 2008 Do Ba Duc  All Rights Reserved

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge, 
publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
to whom the Software is furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in all copies or 
substantial portions of the Software. 

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/// <reference name="../dhtiny.js"/>

$dh.newClass("DHTbForm", [], {
    TITLEBAR_HEIGHT: 24, BOTTOMBAR_HEIGHT: 15, CORNER_WIDTH: 6, BUTTONGROUPWIDTH: 76,
    captionTxt: null, statusTxt: null, themeIndex: null,
    body: null, titlebar: null, bottombar: null,
    _elementType: "table",

    init: function(container, props) {
        $dh.css(this, { position: "absolute", padding: "0px", cellSpacing: "0", cellPadding: "0", margin: "0px", borderWidth: "0px", borderCollapse: "collapse", borderStyle: "none", tableLayout: "fixed", overflow: "hidden" });
        $dh.set(this, props);
        if (!$dh.isNil(container)) { // Should be a form manager?
            $dh.addCh(container, this);
            this.maxSize = $dh.size(container);

            if (container.constructor == DHFormManager) {
                this.formManager = container;
                this.addItem(this);
            }
        }
        else this.maxSize = $dh.bodySize();

        this.imagePath = $dh.root + "res/images/DHForm/";

        this.initContent();
        this.initAnimation();
    },

    initContent: function() {
        this.style.visibility = "hidden";

        // Cell structure
        this.insertRow(-1);
        for (var k = 0; k < 4; k++)
            this.rows[0].insertCell(-1);

        this.insertRow(-1); this.rows[1].insertCell(-1);
        this.rows[1].cells[0].colSpan = 4;

        this.insertRow(-1);
        for (k = 0; k < 3; k++) this.rows[2].insertCell(-1);
        this.rows[2].cells[1].colSpan = 2;
        //-------------------------

        this.drawTitlebar(); this.drawBottombar(); this.drawBody();

        this.setTheme(this.themeIndex);
        $dh.css(this, { bounds: [0, 0, 100, 100] });
    },

    initAnimation: function() {
        this.aniMask = $dh.New("div");
        $dh.css(this.aniMask, { bg: "blue", zIndex: 99999, opac: 20, visibility: "hidden", fontSize: "1px" });
        $dh.addCh(document.body, this.aniMask);
        var self = this;

        this.showMotion = new DHMotion(this.aniMask, DHMotion.Effects.strongEaseOut, 0, 100, 0.6);
        this.showMotion.setPropValue = function(val) { // Val is percentage
            var d = self.dtaBounds;
            var s = self.srcBounds;
            $dh.bounds(this.obj, [Math.floor(s.left + d.left * val / 100),
	                            Math.floor(s.top + d.top * val / 100),
	                            Math.floor(s.width + d.width * val / 100),
	                            Math.floor(s.height + d.height * val / 100)
	                          ]);
            $dh.opac(this.obj, Math.floor(d.left > 0 ? val : 100 - val));
        }
        this.showMotion.addListener(this);
    },
    processMsg: function(msg, sender) { // For animation process, etc
        if (msg == "onstop") {
            if (sender == this.showMotion) {
                if (this.showMotion.showFlag != "hide")
                    this.style.visibility = "visible";

                if (this.showMotion.showFlag == "maximize")
                    this.captionbar.draggable = false;
                if (this.showMotion.showFlag == "restore")
                    this.captionbar.draggable = true;

                this.aniMask.style.visibility = "hidden";
            }
        }
    },

    setTitlebarHeight: function(_h) { this.titlebar.style.height = _h + "px"; },
    setBottombarHeight: function(_h) { this.bottombar.style.height = _h + "px"; },
    setMaxSize: function(w, h) { this.maxSize.width = w; this.maxSize.height = h; },

    resizeTo: function(w, h) {
        $dh.css(this, { size: [w, h] });
        this.body.style.height = (h - this.TITLEBAR_HEIGHT - this.BOTTOMBAR_HEIGHT) + "px";
        //this.body.style.width =w + "px";
    },
    moveTo: function(l, t) { $dh.css(this, { pos: [l, t] }); },
    setBounds: function(l, t, w, h) {
        this.resizeTo(w, h);
        this.moveTo(l, t); /*$dh.css(this,{bounds: [l,t,w,h]});*/
    },
    setTheme: function(ti) {
        if ($dh.isNil(ti)) return;
        var fixedPath = "url(" + this.imagePath + "Theme";
        var part = ["title", "bottom"];

        this.themeIndex = ti;

        for (var i = 0; i <= 1; i++) {
            this[part[i] + "bar"].className = "DHTbForm_" + part[i] + "bar" + this.themeIndex;
            for (var j = 1; j <= 3; j++)
                this[part[i] + j].style.backgroundImage = fixedPath + this.themeIndex + "/" + part[i] + j + ".gif)";
        }
        this.title4.style.backgroundImage = this.title2.style.backgroundImage;
    },

    // So funny, but I don't want to repair this function.... :D
    drawTitlebar: function() {
        this.titlebar = this.rows[0];
        this.titlebar.style.height = this.TITLEBAR_HEIGHT + "px";
        this.titlebar.id = this.id + "_titlebar";

        this.title1 = this.titlebar.cells[0];
        $dh.css(this.title1, { borderWidth: "0px", padding: "0px", backgroundRepeat: "no-repeat", backgroundPosition: "top left", size: [this.CORNER_WIDTH, this.TITLEBAR_HEIGHT], height: this.TITLEBAR_HEIGHT + "px" });

        this.title2 = this.titlebar.cells[1];
        $dh.css(this.title2, { borderWidth: "0px", padding: "0px", backgroundPosition: "top left", backgroundRepeat: "repeat-x", width: "auto", lineHeight: this.TITLEBAR_HEIGHT + "px", height: this.TITLEBAR_HEIGHT + "px" });

        this.title4 = this.titlebar.cells[2];
        $dh.css(this.title4, { borderWidth: "0px", padding: "0px", backgroundPosition: "top left", backgroundRepeat: "repeat-x", width: this.BUTTONGROUPWIDTH + "px", lineHeight: this.TITLEBAR_HEIGHT + "px", height: this.TITLEBAR_HEIGHT + "px" });

        this.title3 = this.titlebar.cells[3];
        $dh.css(this.title3, { borderWidth: "0px", padding: "0px", backgroundRepeat: "no-repeat", backgroundPosition: "top right", size: [this.CORNER_WIDTH, this.TITLEBAR_HEIGHT], right: "0px", height: this.TITLEBAR_HEIGHT + "px" });

        this.captionbar = $dh.New("div");
        $dh.css(this.captionbar, { cursor: "pointer", position: "relative", height: this.TITLEBAR_HEIGHT + "px", width: "100%" });
        $dh.addCh(this.title2, this.captionbar);

        if (!$dh.isNil(this.captionTxt))
            this.captionbar.innerHTML = this.captionTxt;
        this.captionbar.parentForm = this;

        this.drawButtons();
        this.captionbar.ondblclick = this.onButton2Click;
    },
    drawButtons: function() {
        var path = this.imagePath + "Theme" + this.themeIndex + "/";
        for (var x = 1; x <= 3; x++) {
            this["button" + x] = $dh.New("img", { src: path + "button" + x + "1.bmp" });
            $dh.addCh(this.title4, this["button" + x]);
            this["button" + x].parentForm = this;
            this["button" + x].onmouseover = function() {
                var fileName = this.src.substr(this.src.lastIndexOf("/") + 1);
                var ext = fileName.substr(fileName.indexOf(".") + 1);
                var butname = fileName.substr(0, fileName.indexOf("."));
                var index = (butname.charAt(butname.length - 1) == "1") ? "2" : "1";
                this.src = this.src.substr(0, this.src.lastIndexOf("/") + 1) + butname.substr(0, butname.length - 1) + index + "." + ext;
            }
            this["button" + x].onmouseout = this["button" + x].onmouseover;
            this["button" + x].onclick = this["onButton" + x + "Click"];
        }
    },

    drawBottombar: function() {
        this.bottombar = this.rows[2];
        this.bottombar.style.height = this.BOTTOMBAR_HEIGHT + "px";
        this.bottombar.id = this.id + "_bottombar";

        this.bottom1 = this.bottombar.cells[0];
        $dh.css(this.bottom1, { borderWidth: "0px", padding: "0px", backgroundRepeat: "no-repeat", backgroundPosition: "bottom left", size: [this.CORNER_WIDTH, this.BOTTOMBAR_HEIGHT] });

        this.bottom3 = this.bottombar.cells[2];
        $dh.css(this.bottom3, { borderWidth: "0px", padding: "0px", backgroundRepeat: "no-repeat", backgroundPosition: "bottom right", size: [this.CORNER_WIDTH, this.BOTTOMBAR_HEIGHT], right: "0px" });

        this.bottom2 = this.bottombar.cells[1];
        $dh.css(this.bottom2, { borderWidth: "0px", padding: "0px", backgroundRepeat: "repeat-x", backgroundPosition: "bottom left", lineHeight: this.BOTTOMBAR_HEIGHT + "px" });

        if (!$dh.isNil(this.statusTxt))
            this.bottom2.innerHTML = this.statusTxt;
    },

    drawBody: function(obj) {
        this.body = $dh.New("div");
        $dh.css(this.body, { pos: [0, 0, "static"], margin: "0px", overflow: "hidden", display: "block", height: "200px", bg: "#bbbbbb" })
        $dh.addCh(this.rows[1].cells[0], this.body);
        this.rows[1].style.height = "100%";
        $dh.css(this.rows[1].cells[0], { padding: "0px", height: "100%", overflow: "hidden", border: "none" });
        this.body.parent = this;
    },

    onButton1Click: function() { this.parentForm.minimize() },
    onButton2Click: function() {
        var maxSize = this.parentForm.maxSize;
        var currentSize = $dh.size(this.parentForm);
        if (currentSize.width < maxSize.width || currentSize.height < maxSize.height) {
            this.parentForm.button2.src = this.parentForm.imagePath + "Theme" + this.parentForm.themeIndex + "/button42.bmp";
            this.parentForm.maximize();
        }
        else {
            this.parentForm.button2.src = this.parentForm.imagePath + "Theme" + this.parentForm.themeIndex + "/button22.bmp";
            this.parentForm.restore();
        }
    },
    onButton3Click: function() { this.parentForm.show(false) },
    onClose: function() { return true; },
    close: function() {
        if (this.onClose())
            this.parentNode.removeChild(this);
    },
    show: function(flag) {
        this.style.visibility = "hidden";
        this.aniMask.style.visibility = "visible";

        var b1 = $dh.bounds(this);
        if (flag == false) {
            this.srcBounds = b1;
            this.dtaBounds = { width: -b1.width, height: -b1.height, left: Math.floor(b1.width / 2), top: Math.floor(b1.height / 2) };
            this.showMotion.showFlag = "hide";
        } else {
            this.srcBounds = { width: 0, height: 0, left: Math.floor(b1.left + b1.width / 2), top: Math.floor(b1.top + b1.height / 2) };
            this.dtaBounds = { width: b1.width, height: b1.height, left: -Math.floor(b1.width / 2), top: -Math.floor(b1.height / 2) }; ;
            this.showMotion.showFlag = "show";
        }
        //this.showMotion.setParams(DHMotion.Effects.strongEaseOut, 0,100, 0.6);
        this.showMotion.start();
    },

    maximize: function() {
        this.style.visibility = "hidden";
        this.aniMask.style.visibility = "visible";
        var b = this.saveBounds = $dh.bounds(this);

        var mw = this.maxSize.width, mh = this.maxSize.height;
        this.setBounds(0, 0, mw, mh);

        this.srcBounds = this.saveBounds;
        this.dtaBounds = { width: mw - b.width, height: mh - b.height, left: -b.left, top: -b.top };
        this.showMotion.showFlag = "maximize";
        this.showMotion.start();
    },
    minimize: function() { this.show(false) },
    restore: function() {
        this.style.visibility = "hidden";
        this.aniMask.style.visibility = "visible";

        var b = this.saveBounds;
        this.setBounds(b.left, b.top, b.width, b.height);
        var mw = this.maxSize.width, mh = this.maxSize.height;

        this.srcBounds = { left: 0, top: 0, width: mw, height: mh };
        this.dtaBounds = { width: b.width - mw, height: b.height - mh, left: b.left, top: b.top };
        this.showMotion.showFlag = "restore";
        this.showMotion.start();
    }
});

// An interface for form management
$dh.newClass("DHFormManager", null, {
    init: function() {
    }/*,
    selectItem: function(item) {
        this.formItems.push(item);
    },
    removeItem: function(item) {
        for (var x = 0; x < this.items.length; x++)
            if (x ==
    }*/
});
