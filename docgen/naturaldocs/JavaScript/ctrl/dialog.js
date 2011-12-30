$dh.Require(["util/dragmanager.js","util/imglist.js", "ctrl/animitem.js"]);
$dh.isLoaded("ctrl/dialog", true);
$dh.newClass("DHDialog", DHAnimItem, {
    init: function(container, props) { // Title = "Title1;;;Title2"
        this.__defaults__ = {cornerWidth: 6, titlebarHeight: 24, bottombarHeight: 15};
        DHAnimItem.prototype.init.apply(this, arguments);

        this.id = this.canvas.id;
        this.canvas.style.fontSize = "1px"; // For animation
        this.canvas.style.overflow = "hidden";

        this.drawTitlebar();
        this.drawBottombar();
        this.drawBody();
        this.redraw();

        this.setEnableDrag();
        this.setEnableResize();
    },
    setEnableResize: function(flag) {
        //this.canvas.dragParams.resize = (flag == false) ? false : true;
    },
    setEnableDrag: function(flag) {
        flag = (flag == false) ? false : true;
        if (!this.canvas.dragParams) {
            $dh.dragger.setDrag(this.canvas, {mode: "RESIZE,MOVE", minwidth: 4 * this.cornerWidth, minheight: this.titlebarHeight + this.bottombarHeight, ghostDrag: true});
            var self = this;
            $dh.dragger.addEv("ondragging", function(sender, target, ev) {
                if (target != self.canvas) {
                    return;
                }
                if ($dh.dragger.hasDragMode($dh.dragger.activeObj, "RESIZE")) self.redraw();
            });
            /*$dh.dragger.addEv("ondragstart", function(sender, target, ev) {
                if ($dh.dragger.activeObj != self.canvas)
                    return;
                if ($dh.dragger.dragSource != self.title && $dh.dragger.hasDragMode($dh.dragger.activeObj, "RESIZE")) {
                    $dh.dragger.activeObj = null;
                    $dh.dragger.dragStarted = false;
                    $dh.dragger.modes["RESIZE"].onDragStop(sender, target, ev);
                }
            });*/
            $dh.dragger.addEv("ondragstop", function(sender, target, ev) {
                if (target != self.canvas)
                    return;
                if (!$dh.browser.name != "ie") { // Prevent FF error
                    $dh.dragger.dragSource.style.display = "none";
                    setTimeout('$dh.dragger.dragSource.style.display = ""', 5);
                }
                self.redraw();
            });
        }
        else
            this.canvas.draggable = flag;

        var pt = ["bottom", "title"];
        for (var p = 0; p < 2; p++) {
            var name = pt[p];
            for (var i = 1; i <= 3; i++) {
                $dh.dragger.setDragTarget(this[name + i].canvas, this.canvas);
                this[name + i].canvas.draggable = flag;
            }
            $dh.dragger.setDragTarget(this[name], this.canvas);
            this[name].draggable = flag;
        }
        $dh.dragger.setDragTarget(this.bodypart.canvas, this.canvas);
        this.bodypart.canvas.draggable = flag;
    },
    setProp: function(p, value) {
        this[p] = value;
        switch (p) {
            case "titleTxt":
                if (this.title)
                    this.title.innerHTML = this.titleTxt;
                break;
            case "bottomTxt":
                if (this.bottom)
                    this.bottom.innerHTML = this.bottomTxt;
                break;
            default:
                DHAnimItem.prototype.setProp.apply(this, arguments);
                break;
        }
    },
    drawTitlebar: function() {
        this.titlebar = new DHRichCanvas(this.canvas, {
            id: this.id + "_titlebar",
            cssText: "position:relative;top:0px;left:0px;",
            height: this.titlebarHeight,
            className: this.className + "_titlebar"
        });

        this.title1 = new DHRichCanvas(this.titlebar.canvas, {
            id: this.id + "_title1",
            cssText: "position:absolute;top:0px;left:0px;",
            height: this.titlebarHeight,
            backgroundRepeat: "no-repeat", backgroundPosition: "top left",
            width: this.cornerWidth,
            className: this.className + "_title1",
            backgroundImage: $dh.imgList.getItem(this.imgPath + "title1.gif").src
        });

        this.title3 = new DHRichCanvas(this.titlebar.canvas, {
            id: this.id + "_title3",
            cssText: "position:absolute;right:0px;",
            height: this.titlebarHeight,
            backgroundRepeat: "no-repeat", backgroundPosition: "top 0px right 0px",
            width: this.cornerWidth,
            className: this.className + "_title3",
            backgroundImage: $dh.imgList.getItem(this.imgPath + "title3.gif").src
        });

        this.title2 = new DHRichCanvas(this.titlebar.canvas, {
            id: this.id + "_title2",
            cssText: "position:absolute;font-size:12px;",
            height: this.titlebarHeight,
            backgroundRepeat: "repeat-x", backgroundPosition: "top left",
            width: this.width - 2 * (this.cornerWidth),
            lineHeight: this.titlebarHeight,
            left: this.cornerWidth,
            className: this.className + "_title2",
            backgroundImage: $dh.imgList.getItem(this.imgPath + "title2.gif").src
        });

        this.title = document.createElement("span");
        this.title.style.cssText += ";position:absolute;width:100%;height:98%;left:0px;top:0px;";
        this.title2.canvas.appendChild(this.title);

        this.butClose = document.createElement("img");
        this.title2.canvas.appendChild(this.butClose);
        this.butClose.style.cssText = "position:absolute;width:14px;height:14px;top: 10px;right:15px;cursor:pointer;";
        this.butClose.title = "閉じる";
        $dh.imgList.setImage(this.butClose, this.imgPath + "butclose.gif");

        var self = this;
        self.animation.addEv("onstop", function() {
            if (self.width < 10) self.show(false);
            self.title.style.visibility = "visible";
        });
        self.animation.addEv("onstart", function() {
            self.title.style.visibility = "hidden";
        });
        $dh.addEv(this.butClose, "click", function() {
            self.close();
        });

        if (!$dh.isNil(this.titleTxt))
            this.title.innerHTML = this.titleTxt;
    },
    drawBottombar: function() {
        this.bottombar = new DHRichCanvas(this.canvas, {
            id: this.id + "_bottombar",
            cssText: "overflow:hidden;position:relative;top:100px;left:0px;",
            height: this.bottombarHeight,
            className: this.className + "_bottombar"
        });

        this.bottom1 = new DHRichCanvas(this.bottombar.canvas, {
            id: this.id + "_bottom1",
            cssText: "position:absolute;top:0px;left:0px;",
            height: this.bottombarHeight,
            backgroundRepeat: "no-repeat", backgroundPosition: "bottom left",
            width: this.cornerWidth,
            className: this.className + "_bottom1",
            backgroundImage: $dh.imgList.getItem(this.imgPath + "bottom1.gif").src
        });

        this.bottom3 = new DHRichCanvas(this.bottombar.canvas, {
            id: this.id + "_bottom3",
            cssText: "position:absolute;right:0px;",
            height: this.bottombarHeight,
            backgroundRepeat: "no-repeat", backgroundPosition: "bottom right",
            width: this.cornerWidth,
            className: this.className + "_bottom3",
            backgroundImage: $dh.imgList.getItem(this.imgPath + "bottom3.gif").src
        });

        this.bottom2 = new DHRichCanvas(this.bottombar.canvas, {
            id: this.id + "_bottom2",
            cssText: "position:absolute;font-size:12px;",
            height: this.bottombarHeight,
            backgroundRepeat: "repeat-x", backgroundPosition: "bottom left",
            width: this.width - 2 * (this.cornerWidth),
            left: this.cornerWidth,
            lineHeight: this.bottombarHeight,
            className: this.className + "_bottom2",
            backgroundImage: $dh.imgList.getItem(this.imgPath + "bottom2.gif").src
        });

        this.bottom = document.createElement("span");
        this.bottom.style.cssText += ";position:absolute;width:100%;left:0px;top:0px;";
        this.bottom2.canvas.appendChild(this.bottom);

        if (!$dh.isNil(this.bottomTxt))
            this.bottom.innerHTML = this.bottomTxt;
    },
    drawBody: function() {
        this.bodypart = new DHRichCanvas(this.canvas, {
            id: this.id + "_body",
            cssText: "overflow:hidden;position:absolute;left:0px;font-size:12px;width:100%;cursor:default;",
            top: this.titlebarHeight,
            className: this.className + "_body"
        });
        this.body = new DHRichCanvas(this.bodypart.canvas, {
            id: this.id + "_bodycontent",
            cssText: "overflow:hidden;position:absolute;left:0px;top:0px;font-size:12px;margin:" + this.cornerWidth + "px",
            className: this.className + "_bodycontent"
        });

        this.body.parent = this;
    },
    redraw: function() {
        var size = $dh.bounds(this.canvas);

        var title2NewW = size.width - 2 * (this.cornerWidth);
        var bottomNewT = size.height - this.bottombarHeight - this.titlebarHeight;
        var bodyNewH = size.height - this.bottombarHeight - this.titlebarHeight;

        title2NewW = title2NewW > 0 ? title2NewW : 0;
        bottomNewT = bottomNewT > 0 ? bottomNewT : 0;
        bodyNewH = bodyNewH > 0 ? bodyNewH : 0;

        this.title2.setProp("width", title2NewW);
        this.bottom2.setProp("width", title2NewW);
        this.bottombar.setProp("top", bottomNewT);

        this.bodypart.setProps({ /* width: size.width,*/height: bodyNewH});
        this.body.setProp("width", size.width - 2 * this.cornerWidth);
        this.body.setProp("height", bodyNewH - 2 * this.cornerWidth);

        this.top = size.top;this.left = size.left;
        this.width = size.width;this.heigh = size.height; //this.setProps({ top: size.top, left: size.left, width: size.width, height: size.height });

        this.raise("ondraw");
    },
    draw: function() {
        DHAnimItem.prototype.draw.apply(this, arguments);
        if (this.titlebar)
            this.redraw();
    },
    close: function() {
        if (this.canvas.style.visibility == "hidden")
            return;
        if (this.onClosing() != false) {
            this.top = parseInt(this.canvas.style.top, 10);
            this.left = parseInt(this.canvas.style.left, 10);
            this.width = parseInt(this.canvas.style.width, 10);
            this.height = parseInt(this.canvas.style.height, 10);

            this.addEv("onanimstop", function(sender) {
                sender.show(false);
                sender.rmEv("onanimstop", arguments.callee);
            });
            this.draw({left: this.left + (this.width / 2), top: this.top + (this.height / 2), width: 0, height: 0}, 1);
        }
    },
    onClosing: function() {
        return true;
    },
    onAnimationStart: function() {}
});