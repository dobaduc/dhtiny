$dh.Require("util/event");
$dh.isLoaded("util/dragmanager", true);

$dh.dragger = DHDrag = new DHEvent();
$dh.extend($dh.dragger, {
    mouseOffset: null, activeObj: null, mask: null, dragStarted: false,

    init: function() {        
        $dh.addEv(document, "mousemove", $dh.dragger.mouseMove);
        $dh.addEv(document, "mouseup", $dh.dragger.mouseUp);
        $dh.addEv(document, "mousedown", $dh.dragger.mouseDown);
        $dh.addEv(document, "mouseout", $dh.dragger.mouseOut);

        // Further use as an DHT object
        $dh.setDrag = $dh.dragger.setDrag;
        $dh.disableDrag = $dh.dragger.disableDrag;
        // Create mask
        $dh.dragger.mask = $dh.New("div", {id: "_$dh.draggerMask_"});
        $dh.css($dh.dragger.mask, {zIndex: 1000000, background: "yellow", opac: 30, position: "absolute", display: "none"});
        $dh.addCh(document.body, $dh.dragger.mask);
    },

    setDrag: function(obj, dragParams) { //Eg: {mode : "MOVE", dragSource:parent, maskStyle:"", limit:{}, ghostDrag:true}    
        $dh.dragger.setDragParams(obj, dragParams);
        $dh.dragger.raise("_oninitdrag", obj);
    },
    enableDrag: function(obj) {
         $dh.dragger.setDragParams(obj, obj.dragParams);
    },
    setDragTarget: function(src, tar) {
        src.dragTarget = tar;
        $dh.dragger.enableDrag(src);
    },
    setDragParams: function(obj, dragParams) {
        dragParams = dragParams || {};
        dragParams.dragOrigin = dragParams.dragOrigin || obj.parentNode || document.body;
        var src = dragParams.dragSource || obj;
        src.draggable = true;
        if (src != obj) src.dragTarget = obj;
        obj.dragParams = dragParams;
        $dh.preventLeak(obj, "dragParams");
    },
    disableDrag: function(obj) {
        obj.draggable = false;
        obj.dragParams = null;
    },

    mouseDown: function(ev) {
        ev = $dh.evt(ev);
        var src = ev.target;
        if (src.draggable != true) return false;
        ev.stop();
        $dh.dragger.activeObj = src.dragTarget || src;
        $dh.dragger.dragSource = src;
        $dh.dragger.dragStarted = false;
    },

    mouseUp: function(ev) {
        if ($dh.isNil($dh.dragger.activeObj)) return;
        $dh.dragger.dragStarted = false;
        $dh.dragger.raise("_ondragstop", $dh.dragger.activeObj, $dh.evt(ev));
        $dh.dragger.activeObj = null;
    },

    mouseMove: function(ev) {
        ev = $dh.evt(ev);
        // Raise public mouse move event
        if (ev.target.draggable == true && $dh.isNil($dh.dragger.activeObj))
            $dh.dragger.raise("_onmousemove", ev.target.dragTarget || ev.target, ev);
        // Raise drag start event       
        if ($dh.isNil($dh.dragger.activeObj)) return;
        if ($dh.dragger.dragStarted != true) {
            $dh.dragger.dragStarted = true;
            $dh.dragger.raise("_ondragstart", $dh.dragger.activeObj, ev);
        }
        if ($dh.dragger.dragStarted)
            $dh.dragger.raise("_ondragging", $dh.dragger.activeObj, ev);
    },
    mouseOut: function(ev) {
        var tar = $dh.evt(ev).target;
        if (!$dh.dragger.dragStarted && tar.saveSrcCursor) {
            tar.style.cursor = tar.saveSrcCursor;
        }
        if (!$dh.dragger.dragStarted) document.body.style.cursor = "";
    },

    addMode: function(name, modeObj) {
        if ($dh.isNil($dh.dragger["modes"]))
            $dh.dragger.modes = new Array();
        $dh.dragger.modes[name] = modeObj;
        modeObj.name = name;

        for (var p in modeObj) {
            if (p.indexOf("on") == 0) {
                var func = (modeObj[p] + "");
                var header = func.substr(0, func.indexOf("{") + 1);

                var newFunc = header +
                            "if (!$dh.dragger.hasDragMode(arguments[1],'" + name + "')) return false;" +
                            "if ($dh.dragger.modes['" + name + "']['" + p + "'].apply($dh.dragger,arguments) != false)" +
                                "$dh.dragger.raise('" + p.toLowerCase() + "',arguments[1],arguments[2]);" +
                            "}";
                // _ondragstop, _ondragstart, _ondragging
                eval("$dh.dragger.addEv('_" + p.toLowerCase() + "', " + newFunc + ")");
            }
        }
    },
    hasDragMode: function(obj, mode) {
        if (obj.dragParams && $dh.isStr(obj.dragParams.mode))
            return obj.dragParams.mode.match(new RegExp("(^|,\s*)"+ mode+"(\s*,|$)","ig"));
        else
            return false;
    },
    msOffset: function(ev, obj) {
        ev = ev || window.event;
        var objPos = $dh.pos(obj), msPos = $dh.msPos(ev);
        return {left: msPos.left - objPos.left, top: msPos.top - objPos.top};
    }
});

// Register $dh.dragger to window.onload
$dh.addLoader($dh.dragger.init);
$dh.addEv(window,"unload",function(){
    if ($dh.dragger) {
        $dh.rmEv(document,"mousemove",$dh.dragger.mouseMove);
        $dh.rmEv(document,"mouseup",$dh.dragger.mouseUp);
        $dh.rmEv(document,"mousedown", $dh.dragger.mouseDown);
        for (var x in $dh.dragger)
            if (!$dh.isNil($dh.dragger[x])) $dh.dragger[x] = null;
        $dh.dragger = null;
    }
});

// Register built-in effects
$dh.dragger.addMode("RESIZE", {
    onInitDrag: function(sender, target) {
        var pp = ["width", "height"];
        for (var i = 0; i < pp.length; i++) {
            target.dragParams["min" + pp[i]] = target.dragParams["min" + pp[i]] || 0;
            target.dragParams["max" + pp[i]] = target.dragParams["max" + pp[i]] || 99999;
        }
    },
    onMouseMove: function(sender, target, ev) {
        if ($dh.dragger.dragStarted)
            return false;

        var dragSource = ev.target;
        if (!target.saveSrcCursor)
            dragSource.saveSrcCursor = dragSource.style.cursor || "";

        var b = $dh.bounds(target);
        var pos = ev.pos;
        var d = target.dragParams.dResize || 6;

        var dx = 0, dy = 0;
        if (target.dragParams.dragOrigin) {
            dx = target.dragParams.dragOrigin.scrollLeft;
            dy = target.dragParams.dragOrigin.scrollTop;
        }

        document.body.style.cursor = "";
        var dir = {s: false, n: false, w: false, e: false};
        if (Math.abs(pos.left+ dx - b.left) <= d) {dir["w"] = true;}
        if (Math.abs(pos.left+ dx - b.left - b.width) <= d) {dir["e"] = true;}
        if (Math.abs(pos.top + dy - b.top ) <= d) {dir["n"] = true;}
        if (Math.abs(pos.top + dy - b.top - b.height) <= d) {dir["s"] = true;}

        // Set cursor
        var csr = "";
        for (var p in dir) if (dir[p]) csr += p;
        if (csr != "") document.body.style.cursor = csr + "-resize";

        if (document.body.style.cursor.indexOf("-") > 0) {
            dragSource.style.cursor = document.body.style.cursor;
        }
        else {
            if ($dh.dragger.activeObj == target)
                dragSource.style.cursor = dragSource.saveSrcCursor;
            else {
                dragSource.style.cursor = "";
                dragSource.saveSrcCursor = null;
            }
        }
    },
    onDragStart: function(sender, target, ev) {
        if (document.body.style.cursor.indexOf("resize") < 0)
            return false;
        $dh.dragger.mouseOffset = $dh.dragger.msOffset(ev, target);
        $dh.dragger.saveBounds = $dh.bounds(target);
        $dh.dragger.saveMousePos = $dh.msPos(ev);
        if (target.dragParams.noMask != true)
            $dh.dragger.mask.style.display = "";
    },

    onDragStop: function(sender, target, ev) {
        if (document.body.style.cursor.indexOf("resize") < 0)
            return false;
        target.style.display = "";
        if ($dh.dragger.mask.style.display == "none")
            return;
        var newBounds = $dh.bounds($dh.dragger.mask);
        $dh.css(target, {display: "", size: [newBounds.width, newBounds.height], pos: [newBounds.left, newBounds.top]});
        $dh.dragger.mask.style.display = "none";
    },

    onDragging: function(sender, target, ev) {
        if (document.body.style.cursor.indexOf("resize") < 0) {
            return false;
        }
        var mousePos = ev.pos;
        var mb = {left: $dh.dragger.saveBounds.left, top: $dh.dragger.saveBounds.top, width: $dh.dragger.saveBounds.width, height: $dh.dragger.saveBounds.height};
        var dw = mousePos.left - $dh.dragger.mouseOffset.left - $dh.dragger.saveBounds.left;
        var dh = mousePos.top - $dh.dragger.mouseOffset.top - $dh.dragger.saveBounds.top;
        var dl = 0, dt = 0, lim = "";
        // Set delta for all sides
        var rsm = document.body.style.cursor;
        switch (rsm.substr(0, rsm.indexOf("-"))) {
            case "w":dl = dw;dw = -dw;dh = 0;lim = "left&&width";break;
            case "sw":dl = dw;dw = -dw;lim = "left&&width";break;
            case "e":dh = 0;lim = "width";break;
            case "ne":dt = dh;dh = -dh;lim = "top&&left&&height";break;
            case "n":dt = dh;dh = -dh;dw = 0;lim = "top&&height";break;
            case "s":dw = 0;lim = "height";break;
            case "nw":dl = dw;dw = -dw;dt = dh;dh = -dh;lim = "top&&height&&width&&left";break;
        }

        mb.width = dw + $dh.dragger.saveBounds.width;
        mb.height = dh + $dh.dragger.saveBounds.height;
        mb.top = dt + $dh.dragger.saveBounds.top;
        mb.left = dl + $dh.dragger.saveBounds.left;

        // Recheck limits
        var xlim = lim.split("&&");
        var related = {"width": "left", "height": "top", "top": "height", "left": "width"};
        for (var x in mb) {
            if (mb[x] < target.dragParams["min" + x]) {
                if (lim.indexOf(x) >= 0) {
                    for (var k = 0; k < xlim.length; k++)
                        if (related[x] == xlim[k])
                        mb[xlim[k]] += mb[x] - target.dragParams["min" + x];
                }
                mb[x] = target.dragParams["min" + x];
            }
            if (mb[x] > target.dragParams["max" + x]) {
                if (lim.indexOf(x) >= 0) {
                    for (var k = 0; k < xlim.length; k++)
                        if (related[x] == xlim[k])
                        mb[xlim[k]] += mb[x] - target.dragParams["max" + x]; ;
                }
                mb[x] = target.dragParams["max" + x];
            }
        }

        if (target.dragParams.ghostDrag != true) {
            $dh.pos(target, [mb.left, mb.top]);
            $dh.size(target, [mb.width, mb.height]);
        }
        //if ($dh.dragger.mask.style.display != "none") {
        $dh.pos($dh.dragger.mask, [mb.left, mb.top]);
        $dh.size($dh.dragger.mask, [mb.width, mb.height]);
        //}
    }
});

// Define drag effects
$dh.dragger.addMode("MOVE", {
    onInitDrag: function(sender, target) {
        var pp = ["left", "top"];
        for (var i = 0; i < pp.length; i++) {
            target.dragParams["min" + pp[i]] = target.dragParams["min" + pp[i]] || -99999;
            target.dragParams["max" + pp[i]] = target.dragParams["max" + pp[i]] || 99999;
        }
    },
    onDragStart: function(sender, target, ev) {
        if (document.body.style.cursor.indexOf("resize") > 0)
            return false;
        $dh.dragger.mouseOffset = $dh.dragger.msOffset(ev, target);
        if (target.dragParams.noMask != true) {
	        $dh.dragger.mask.style.cursor = "move";
	        $dh.dragger.mask.style.display = "";
	    }
	    var size = $dh.size(target);
	    $dh.size($dh.dragger.mask, [size.width, size.height]);
    },
    
    onDragStop: function(sender, target, ev) {
        target.style.display = "";
        if (target.dragParams.ghostDrag == true)
            $dh.css(target, {left: $dh.dragger.mask.style.left, top: $dh.dragger.mask.style.top});
        $dh.dragger.mask.style.display = "none";
    },

    onDragging: function(sender, target, ev) {
        if (document.body.style.cursor.indexOf("resize") > 0)
            return false;
        var mousePos = ev.pos;
        var dx = 0, dy = 0;
        if (this.activeObj.dragParams.dragOrigin) {
            dx = -$dh.pos(target.dragParams.dragOrigin).left + target.dragParams.dragOrigin.scrollLeft;
            dy = -$dh.pos(target.dragParams.dragOrigin).top +  target.dragParams.dragOrigin.scrollTop;
        }

        var newPos = {};
        newPos.left = mousePos.left + dx - $dh.dragger.mouseOffset.left;
        newPos.top  = mousePos.top  + dy - $dh.dragger.mouseOffset.top;
        for (var p in newPos) {
            if (newPos[p] > target.dragParams["max"+p]) newPos[p] = target.dragParams["max"+p];
            if (newPos[p] < target.dragParams["min"+p]) newPos[p] = target.dragParams["min"+p];
        }
    	$dh.pos($dh.dragger.mask,[newPos.left, newPos.top]);
    	if (target.dragParams.ghostDrag != true)
    	    $dh.pos(target, [newPos.left, newPos.top]);
    }
});