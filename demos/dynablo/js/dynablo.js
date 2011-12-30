$dh.Require("ctrl/dockpanel,slider,imgbutton,modalcanvas");

$dh.addLoader(function() {DEMO.init()});
DEMO = {
    init: function() {
        this.createEditor();
    },

    createEditor: function(){
        DEMO.Editor = new DHDockPanel(document.body, {
            cssText: "background:black;color:white;border-right:solid 4px #303030;overflow:hidden;z-index:10;",
            width: "100%", height: "200px", dockpos: "top", opacity: 40,
            innerHTML: "Content editor"
        });
    },

    createResultPage: function() {
        var id = this.canvas.id;
		var scriptStr = "<script type='text/javascript' src='"+ $dh.root + "/dhtiny.js'>";
        scriptStr += "<script type='text/javascript'>";
        scriptStr += "$dh.addLoader(function(){ ";
        
        scriptStr += "})";

		scriptStr += "</script>";

		var doc = this.canvas.contentWindow.document;
		doc.open();
		doc.write(
            "<html><head>" +
                scriptStr + // CSS_Str : why not?
            "</head><body style='margin:0px;padding:0px;' onload='setupHandlers()'>"+
            "</body></html>"
        );
		doc.close();
    }
}