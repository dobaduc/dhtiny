// Manage all dialog on the screen
$dh.newClass("XDialogManager",  {
  init: function() {
      this.dialogs = new Array();
      this.currentdialog = null;        
  },

  showDialog: function(src, fromObj, callback) {
	    var dialog;
	    if (!this.dialogs[src]) {  
	        dialog = this.dialogs[src] = new XDetailDialog(document.body, "製品詳細:"+ __DATA__.value[src][0]);
            dialog.canvas.id = "dialog_"+src;
	        dialog.src = src;
	        dialog.setContent(src);
	        this.setClickSources(dialog, dialog.canvas, dialog.titlebar, dialog.caption); 
	    }
	    else {
	        dialog = this.dialogs[src];
	        if (dialog.canvas.style.display != "none" || this.isLocked == true) {
	            if (callback) callback();
	        	return; // Already shown
	        }
        }
        
        // If zooming dialog from table row...
        if (fromObj && fromObj._newDFlag) {        	        	
        	dialog.minBounds = {width:20,height:20, left:400, top: 200};
        	dialog.maxBounds = {width:450, height: 340, left: 180, top:85};
        	dialog.setBounds(dialog.minBounds.left,dialog.minBounds.top,dialog.minBounds.width,dialog.minBounds.height);
        	fromObj = null;
        }
        // Set dialog pos so as not to cover other ones
	    for (var ss in this.dialogs) {
	        if (ss != src && this.dialogs[ss].canvas.style.display != "none" 
	            && (this.dialogs[ss].maxBounds.top - dialog.maxBounds.top) <= 10) {
	               dialog.maxBounds.top+= 10;
	               dialog.maxBounds.left+= 10;
	         }
	    }	    
        	
	    if (fromObj)
	        dialog.fromObj = fromObj;
	  
	    var self = this;
	    this.isLocked = true;
	      
	    this.setCurrentDialog(dialog);
	    showXMask(true);
	    
	    dialog.onStopped= callback;
	    dialog.show(true, 1.0, dialog.maxBounds, function() {
	        self.isLocked = false; // Just one dialog can be opened at a moment
	        if (this.onStopped) this.onStopped();
	    });
		
		return dialog;
	},
	
	hideDialog: function(dialog, fromObj, callback) {
	    var self = this;
	    if (fromObj) dialog.fromObj = fromObj;
	    
	    this.isLocked = true;
	    dialog.onStopped = callback;
	    
	    var cb = $dh.bounds(dialog.canvas);
	    dialog.maxBounds.left = cb.left;  // For next show
	    dialog.maxBounds.top = cb.top;
        dialog.left = cb.left;
        dialog.top = cb.top;       
	    
	    if (dialog.fromObj) {
	        var tb = $dh.bounds(dialog.fromObj.canvas);

	        if (tb.left <= -5) { // Being scrolled
				tb.left = cb.left + Math.floor( cb.width/2);
				tb.top  = cb.top  + Math.floor( cb.height/2);				
			}

	        dialog.show(false, 1.0, tb, function() {
	            dialog.fromObj = null;
	            self.checkHideMask();
	            self.isLocked = false;
	            if (dialog == self.currentDialog)
	                self.setCurrentDialog();
	            if (dialog.onStopped) dialog.onStopped ();
	        });
		}
		else {
			var mb = dialog.minBounds;
			var cb = $dh.bounds(dialog.canvas);
			mb.left = cb.left + Math.floor( cb.width/2);
			mb.top  = cb.top  + Math.floor( cb.height/2);
			mb.width = 4;
			mb.height = 4;

              dialog.show(false, 1.0 , mb, function() {
                  self.checkHideMask();
                  self.isLocked = false;
                  if (dialog == self.currentDialog)
                      self.setCurrentDialog();
                  if (dialog.onStopped) dialog.onStopped ();
              });
	  }
	},
	
	checkHideMask: function() {
	    for (var x in this.dialogs)
	        if (this.dialogs[x].canvas.style.display == "") return false;
	    showXMask(false);
	},
	
	setClickSources: function(dialog) {
	    var self = this;
	    for (var x=1; x< arguments.length; x++) {
	        $dh.addEv(arguments[x],"mousedown", function() {
	            self.setCurrentDialog(dialog);
	        });
	    }
	},
	
	setCurrentDialog: function(dialog) { // For demo only
	    if (!dialog) {
	        this.currentDialog = null;
	        for (var x in this.dialogs)
	            if (this.dialogs[x].canvas.style.display != "none") {
	                dialog = this.dialogs[x];
	                break;
	            }
	        if (!dialog)
	            return;
	    }
	    if (this.currentDialog && this.currentDialog != dialog) {
	        this.currentDialog.canvas.style.zIndex = 900;
	        this.currentDialog.body.style.backgroundColor = "gray";
	        
	        this.currentDialog.titlebar.style.backgroundColor = "silver";
	        this.currentDialog.titlebar.style.backgroundImage = "";
	    }
	    this.currentDialog = dialog;
	    dialog.canvas.style.zIndex = 902;
	    this.currentDialog.body.style.backgroundColor = "#e2f7e2";
	    
	    this.currentDialog.titlebar.style.backgroundColor = "";
	    this.currentDialog.titlebar.style.backgroundImage = "url(images/hd_row_bg.gif)";
	    //showXMask();
	},
	
	onClosedDialog: function(dialog) {	
	    if (dialog == this.currentDialog) 
	        this.currentDialog = null;
	},
	hideAllDialogs: function() {
		for (var i in this.dialogs)
			this.dialogs[i].show(false);
		this.isLocked = false;
	}
	/*,
	
	moveDialogTo: function(dialog, x, y, aniFlag) {
	    //dialog.show(true, {left: x, top : y});
	    dialog.setBounds(x, y, null, null);
        dialog.onStop = function() {
            alert("moved dialog "+ dialog + " to position of (" + x + ", y " + " )" );            
        }
	},
	
	sortDialog: function() {
	    var dX = 200, dY = 200;
	    var bs = AFM.DOM.bodySize();
	    
	    var list = [];
	    // Find all visible dialogs
	    for (var x  in this.dialogs) {
	        if (this.dialogs[x].canvas.style.display != "none") {
	            list.push(this.dialogs[x].src);
	        }
	    }
	    // Calculate position & delta position
        for (var i = 0 ; i < 10; i ++) {
        }	    
	}*/
});