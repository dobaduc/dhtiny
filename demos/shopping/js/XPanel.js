$dh.Require(["util/dragmanager","util/animation"]);

$dh.newClass("XPanel", DHAnimItem, {
	width: 2, height: 2, 
	titleH: 20, // Titlebar's height
	lineHeight: 30, // For item vertical spacing	
	init: function(container, title) {
		this.items = [];
		DHAnimItem.prototype.init.apply(this,[container,{}]);
		this.canvas.style.cssText +=";position:absolute; overflow: hidden";

		this.drawTitlebar(title||"");
		this.drawBody();
		this.setDragActions();
	},
	setDragActions: function() {
		$dh.dragger.setDrag(this.canvas, {mode:"RESIZE", mask: true, ghostFlag: true} );
		$dh.dragger.setDragTarget(this.titlebar, this.canvas);
        this.titlebar.draggable = true;
		$dh.dragger.setDragTarget(this.caption, this.canvas);
        this.caption.draggable = true;
		$dh.dragger.setDragTarget(this.body, this.canvas);
		
		var self = this; // For demo only
		$dh.dragger.addEv("ondragstop", function(sender, target, ev) {
			if (sender == self)
                self.repairSize();
		});
	},
	
	onRunning: function() {
		//this.repairSize();
	},
	
	show: function(flag, time, dest, callback) {
		if (time) {
			this.showBodyContent(false);
			this.aniCallback= callback || function() {};
			if (flag == false)	
				this.onAnimStop = function() {
					this.show(false);					
					this.aniCallback();
					this.showBodyContent(true);	
				}
			else {
				this.show(true);
				this.onAnimStop = function() {
					this.showBodyContent(true);
					this.aniCallback();
				}
			}
            if (time > 0) {
                this.draw(dest, time);
            }
		}
		else {
			this.isVisible = flag;
			this.canvas.style.display = (flag==false)?"none":"";
		}
	},
	
	showBodyContent: function(flag) {
		/*var visi = (flag == false) ? "hidden": "visible";
		this.titlebar.style.visibility = visi;
		for (var x =0; x < this.body.childNodes.length; x++)
			this.body.childNodes[x].style.visibility = visi;*/
		var visi = (flag == false) ? "none": "";
		this.titlebar.style.display = visi;
		for (var x =0; x < this.body.childNodes.length; x++)
			this.body.childNodes[x].style.display = visi;
			
		if (flag!= false)
		    this.repairSize();
	}, 

	setBounds: function(l,t,w,h, th) {
        this.setProps({left: l, top: t, width: w, height: h, titleH: th || this.titleH});				
		
		/// For saving tree node position only		
		this.titlebar.style.height = this.titleH + "px";
		this.body.style.height = (this.height-this.titleH>0? (this.height-this.titleH) : 0) + "px";
	},
	drawTitlebar: function(title) {
		this.titlebar = document.createElement("div");
		this.titlebar.style.cssText += ";height:"+this.titleH + "px;position:static;font-size:11px;overflow:hidden;"
		this.titlebar.style.cssText += ";border: solid 2px gray; border-bottom:none;padding:3px;"; 

		this.titlebar.style.backgroundImage = "url(images/hd_row_bg.gif)";
		this.titlebar.style.backgroundPositionY = "-3px";
				
		this.caption = document.createElement("div");
		this.caption.style.overflow = "hidden";
		this.titlebar.appendChild(this.caption);
		
		this.canvas.appendChild(this.titlebar);
		this.setTitle(title);
	},
	
	drawBody: function() {
		this.body = document.createElement("div");
		this.body.style.height = (this.height - this.titleH> 0?this.height - this.titleH : 0)+ "px";
		this.body.style.lineHeight = this.lineHeight+"px";  
		
		this.body.style.cssText += ";background-color:#505050;position:relative;border: solid 2px gray;overflow:hidden;";		
		this.canvas.appendChild(this.body);
	},
	
	setTitle: function(title) {
		//this.titlebar.style.backgroundImage = "url(images/"+title+"_title.jpg)";
		this.caption.innerHTML = title || "";
	},
	
	repairSize: function() {
        var size = $dh.size(this.canvas)
		this.height = size.height;
		this.width = size.width;
		this.body.style.height = ((this.height - this.titleH >0) ? (this.height - this.titleH) : 0) + "px"; 
	}
});
