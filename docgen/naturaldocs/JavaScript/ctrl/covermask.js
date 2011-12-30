$dh.Require("ctrl/richcanvas");
$dh.isLoaded("ctrl/covermask", true);

$dh.newClass("DHCoverMask", DHRichCanvas, {
    init: function(props) {
		if (!props) props = {};
		props._canvasElementType_ = "iframe";
		if (!props.cssText) props.cssText ="";
		props.cssText = ";border:none;position:absolute;z-index:9999;left:0px;top:0px;" + (props.cssText ||"");
		props.opacity = props.opacity || 40;

		DHRichCanvas.prototype.init.apply(this,[document.body, props]);
		this.setupListeners();
		this.canvas.style.visibility = "hidden"; // hide canvas first
	},
	setupListeners: function() {
		var id = this.canvas.id;
		var scriptStr = "<script type='text/javascript'>";
        
        scriptStr += "function setupHandlers(){ ";
            var events = ["click","mousedown", "mouseover", "mouseup","mouseout"];
            for (var i=0; i < events.length; i++) {
                var ev =events[i];
                var str = "document.on"+ev+"=function(ev){"+
                        "var maskcv = window.top.document.getElementById('"+id+"');"+
                        "if( maskcv && maskcv.ownerObj){"+
                            "maskcv.ownerObj.raise('onmask"+ev+"');"+
                        "}"+
                    "};";
                scriptStr += str;
            }
        scriptStr += "}";
        
		scriptStr += "</script>";
		
		var doc = this.canvas.contentWindow.document;
		doc.open();
		doc.write("<html><head>" + scriptStr + "</head><body style='margin:0px;padding:0px;"+ (this.canvas.style.cssText) +"' onload='setupHandlers()'></body></html>");
		doc.close();
	},
	show: function(flag, zIndex) {
		if (flag!= false) {
			var bz = $dh.bodySize(true);
			this.setProps({width:bz.width, height: bz.height}); //{width: document.body.offsetWidth, height: document.body.offsetHeight});
			if (zIndex)	{
                this.setProp("zIndex",zIndex);
            }
		}
		this.canvas.style.visibility = (flag== false) ? "hidden" : "visible";
	}
});