// Required event class
$dh.Require("util/event");
$dh.isLoaded("ctrl/richcanvas", true);

$dh.newClass("DHRichCanvas", DHEvent, {
    init: function(container, props) {
        // If no container element is specified
        if ($dh.isNil(props)) { // Single parameters
            return this.init(null, container);
        }
        container = $dh.el(container);
        props = props || {};
        props.id =props.id || (this._class + "" + $dh.instOf[this._class].length);

        if (props._canvas) {
            this.canvas = $dh.el(props._canvas);
            props._canvas = undefined;
        } else {
            if (props.roundrectProps) {
                this.canvas = $dh.createRoundrect(props.roundrectProps);
            }
            else {
                this.canvas = $dh.New(props._canvasElementType_ || "div");
            }
            if (container) {
                container.appendChild(this.canvas);
            }
        }

        this.canvas.ownerObj = this;
        $dh.preventLeak(this.canvas, "ownerObj");
        this.setDefaultProps();
        this.setDefaultEvents();
        this.setProps(props);
    },

    setProps: function(props) {
        for (var p in props) {
            this.setProp(p, props[p]);
        }
    },

    // Overridable method
    setProp: function(p, value) {
        this[p] = value; // By default, all given properties will be instance's properties

        // This method will be overwritten by user-defined set[PropName] method
        if (this["set"+p.charAt(0).toUpperCase()+p.substr(1)])
            return (this["set"+p.charAt(0).toUpperCase()+p.substr(1)])(value);

        if (p.match(/^(id|className|title|innerHTML)/)) {
            this.canvas[p] = value;
        }
        else if (p == "opacity") {
            $dh.opac(this.canvas, value);
        }
        else if (p == "style" || p == "cssText") { // Accept even cssText definition
            $dh.css(this.canvas, value);
        }
        else if (p == "backgroundImage" && !value.match(/url/i) ) {
            this.canvas.style[p] = "url(" + value + ")";
        }
        else if (p.match(/^(left|top|width|height|right|bottom|fontSize|padding|margin|lineHeight|min|max)/)) {
            try {
                this.canvas.style[p] = $dh.isNum(value) ? Math.floor(value)+"px ": value;
            } catch (err){}
        }
        else {
            // By default, given properties will be set as style properties
            try {               
                this.canvas.style[p] = value;
            } catch (err) {
            } // Prevent error on IE8+
        }

         // For roundrect
        if (this.canvas && this.roundrectProps && $dh.browser.ie) {
            var bgcolor = $dh.getCssProp(this.canvas, "backgroundColor");
            if (bgcolor.indexOf("#")== 0) {
                this.canvas.setAttribute("fillcolor",""+bgcolor);
                this.canvas.style.backgroundColor = "transparent";
                this.canvas.style.borderStyle = "none";
            }
        }
    },
    setDefault: function(p, value) { // Do nothing with p, let supper class set it
        this._super.prototype.setProp.apply(this, arguments);
    },

    getProp: function(p) {
        // This method will be overwritten by user-defined set[PropName] method
        if (this["get"+p.charAt(0).toUpperCase()+p.substr(1)]) {
            return (this["get"+p.charAt(0).toUpperCase()+p.substr(1)])();
        }

        if (p == "opacity"){
            return this.opacity || $dh.opac(this.canvas);
        }
        else if (p.match(/^(left|top|width|height|right|bottom|fontSize|padding|margin|lineHeight|zIndex)/)) {
            return this[p] || parseInt($dh.getCssProp(this.canvas, p), 10);
        }
        else return this[p];
    },

    show: function(flag) {
        this.visible = (flag == false) ? false: true;
        this.canvas.style.visibility = (flag == false) ? "hidden" : "visible";
    },

    setDefaultProps: function() {
        if (this.__defaults__) {
            for (var p in this.__defaults__) this[p] = this.__defaults__[p];
        }
        this.canvas.className = this._class;
    },

    setDefaultEvents: function() {
        var self = this;
        var evList = {mousedown: "MouseDown", mouseup: "MouseUp", mouseover: "MouseOver", mouseout: "MouseOut", mousemove: "MouseMove", click: "Click",
                focus: "Focus", blur: "Blur", scroll: "Scroll", keydown: "KeyDown", keypress: "KeyPress", keyup: "KeyUp"
        };
        for (var p in evList) {
            eval("self.on" + evList[p] + " = self.on" + evList[p] + " || function(){}"); // Create a default blank function
            eval("self." + p + "= function(ev) {self.on" + evList[p] + "(ev);self.raise('on" + p + "',ev);};");
            eval("$dh.addEv(self.canvas,'" + p + "', self." + p + ")");
        }
    }
});


// Gonna cut this part to a graphic module
// Enable VML
if (!$dh.isVMLEnabled) {
    $dh.isVMLEnabled = true;
    if ($dh.browser.ie) {
        if (document.documentMode != 8) {
            document.namespaces.add("dhtiny", 'urn:schemas-microsoft-com:vml');
        }
        else {
            document.namespaces.add('dhtiny', 'urn:schemas-microsoft-com:vml', "#default#VML");
        }
        // Create behavior for roundrect
        var style = document.createElement('style');
        var head = document.getElementsByTagName("head")[0];
        if (head.childNodes[0])
            head.appendChild(style);
        else
            head.insertBefore(style,head.childNodes[0]);
        document.documentElement.firstChild.insertBefore(style, document.documentElement.firstChild.firstChild);
        if (style.styleSheet) {
            try {
                var styleSheet = style.styleSheet;
                styleSheet.addRule('dhtiny\\:*', '{behavior:url(#default#VML); background-color: transparent;}');
            } catch(err) {}
        }
    }
}

$dh.createRoundrect = function(props) { // color, radius, width (style is solid only)
    var rect;

    if (!$dh.browser.ie) {
        rect = document.createElement("div");
        rect.style.cssText += ";" +
            "-moz-border-radius:" + props.radius + "px;-webkit-border-radius:" + props.radius + "px;" +
            "border: solid " + (props.width || 0) + "px " + (props.color || "") + ";";
    }
    else {
        rect = document.createElement("<dhtiny:roundrect/>");
        rect.setAttribute("arcsize", 0.6 / props.radius); //".1");//props.radius/20); // 10 is default border size
        rect.setAttribute("strokeweight", props.width);
        if (props.color) rect.setAttribute("strokecolor", props.color);
    }
    return rect;
}