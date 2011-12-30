$dh.console = {
	dconsoleStyle: ";display:none;position:absolute;overflow:auto;background-color: #000000;color:#ffffff;font-size:11px;z-index: 900;",
	dcmdboxStyle : ";display:none;z-index:999;height:70px;color:yellow;border:inset 2px gray;background:#131313;",
	init: function() {        
		if (this.dconsole) return;
		
		var dconsole = $dh.New("textarea", {id: "_dconsole"});
		this.dconsole = dconsole;
		dconsole.style.cssText = this.dconsoleStyle;
		$dh.bounds(dconsole, 25, 320, 600, 260);

		$dh.addCh(document.body, dconsole);
		dconsole.parent = this;
		// Set events
        
        $dh.addEv(dconsole, "ondblclick", function () {            
			dconsole.parent.showCmdbox();
		});
		$dh.addEv(dconsole, "onclick",  function () {
			if (!$dh.isNil(dconsole.parent.dcmdbox))
				dconsole.parent.dcmdbox.style.display = "none";
		});
		this.writeln("----  You're using Javascript DConsole ----"+"\n(Double click to evaluate some expressions)");/**/
	},
	showCmdbox: function() {
		var dcmdbox;
		if ($dh.isNil(this.dcmdbox)) {
			dcmdbox = this.dconsole.cloneNode(true);
			this.dcmdbox = dcmdbox;
			dcmdbox.parent = this;

            $dh.addCh(document.body, dcmdbox);
			dcmdbox.style.cssText += ";"+this.dcmdboxStyle;
			dcmdbox.value = "alert('welcome')";
            dcmdbox.title = "DOUBLE CLICK this to run javascript expressions";

			dcmdbox.ondblclick = function() {
				this.parent.evalInput(this.value);
			}
			//dcmdbox.onblur = function() {this.style.display = "none";}
		}
		else {
			this.dcmdbox.style.display = "";
		}
	},

	evalInput: function(value) {
		if (value != "")
		try {
			var displayVal = value.substr(0,30);
			if (value.length > 30)
				displayVal += " ... ";
			this.writeln("--- Evaluating: {{{ " + displayVal +" }}}");
			eval(value);
			this.writeln("--- Evaluation completed!");
		} catch(_e_$) {this.writeln("Error '"+_e_$.name+ "', "+_e_$.description+ " "+_e_$.message+ " ")}
	},

	write: function(msg) {
		if ($dh.isNil(this.dconsole))
			this.init();
		this.dconsole.value += msg;
		this.dconsole.scrollTop = 1000000;
	},
	writeln: function(msg) {
		this.write(msg + "\n");
	},
	flush: function() {
		this.dconsole.value = "";
	},
	show: function(flag) {        
		if ($dh.isNil(this.dconsole))
			this.init();
		this.dconsole.style.display = (flag== false)? "none" : "";
	},
    bounds: function(left, top, width, height) {
       $dh.bounds(this.dconsole,[left, top,width,height]);
    }
}