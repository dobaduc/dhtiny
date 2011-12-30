$dh.newClass("DHVMLGraph", DHRichCanvas, {
    init: function(container, props) { // top, left, width, height
        var doc = document;
        if (!__VMLGraph.VMLinitialized) {
            __VMLGraph.VMLinitialized = true;
            doc.createStyleSheet().addRule("v\\:*", "behavior:url(#default#VML);");
        }
        try {
            if (!doc.namespaces.v) {
                doc.namespaces.add("v", "urn:schemas-microsoft-com:vml");
            }
            this.createGNode = function(tagName) {
                return doc.createElement('<v:' + tagName + '/>');
            };
        } catch (e) {
            this.createGNode = function(tagName) {
                return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" />');
            };
        }
        DHRichCanvas.prototype.init.apply(this, [container, props]);
        this.canvas.style.cssText += ";overflow: hidden;position:absolute;";
    },
    draw: function(what, props) {
        var node = this.createGNode(what);
        this.canvas.appendChild(node);
        this.setGNodeProps(node, props);
        return node;
    }
});

$dh.newClass("DHSVGGraph", DHRichCanvas, {
    init: function(container, props) { // top, left, width, height               
        DHRichCanvas.prototype.init.apply(this, [container, props]);
        this.canvas.style.cssText += ";overflow: hidden;position:absolute;";
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        this.canvas.appendChild(svg);
        svg.appendChild(defs);

        this.svg = svg;
        svg.setAttribute("width", props.width || 100);
        svg.setAttribute("height", props.height || 100);
        svg.setAttribute("top", 0);
        svg.setAttribute("left", 0);
    },
    draw: function(what, props) {
        var node = document.createElementNS("http://www.w3.org/2000/svg", what);
        this.svg.appendChild(node);
        this.setGNodeProps(node, props);
        return node;
    }
});

if ($dh.isNil(window.DHGraph)) {
    if ($dh.browser.name == "ie") window.DHGraph = DHVMLGraph;
    else window.DHGraph = DHSVGGraph;
}

$dh.extend(DHGraph, {
    setGNodeProps: function(node, props) {
        for (var x in props) {
            if (x == "cssText")
                node.style.cssText += ";" + props[x];
            else
                node.setAttribute(x, props[x]);
            if (this.svg && (x == "width" || x == "height"))
                this.svg.setAttribute(x, props[x]);
        }
    },
    drawLine: function(x1, y1, x2, y2, width, color) {
        var props;
        if ($dh.browser.ie) {
            props = { from: x1 + "," + y1,
                to: x2 + "," + y2,
                strokeweight: width + "px",
                strokecolor: color
            }
        }
        else {
            props = { x1: x1, x2: x2, y1: y1, y2: y2, stroke: color, "stroke-width": width };
        }
        return this.draw("line", props);
    },
    drawArc: function() {
        
    }
});