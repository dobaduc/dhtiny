$dh.newClass("XDetailDialog", XPanel, {
	init: function(container, title) {
		XPanel.prototype.init.apply(this,[container, title]);		
		this.canvas.style.zIndex = 99999;
        $dh.dragger.setDragParams(this.canvas, {mode: "MOVE"});
		this.show(false);
		
	
		this.drawButtons();
		
		this.drawImage();
		this.drawArticle();
		this.drawOrderArea();
		this.drawImgset();
		
		this.maxBounds = {width:450, height: 340, left: 180, top:85};
		this.minBounds = {width:1,height:1, left:400, top: 200};
		
		this.setBounds(400, 400 , 5,5);
		
		this.body.style.cssText += ";border: solid 2px #aaccac;background-color: #e2f7e2;";
		this.canvas.style.backgroundColor = this.body.style.backgroundColor;
		
		this.titlebar.style.border = "solid 2px silver";
		this.titlebar.style.borderBottom = "none";
		
		var self = this;
		this.addEv("onmouseover", function() {self.canvas.style.cursor = "pointer";});
		this.addEv("onmouseout", function() {self.canvas.style.cursor = "";});
	},
	
	drawButtons: function() {
		this.closeBut = document.createElement("img");
		this.closeBut.src =  "images/icon_close.jpg";
		this.closeBut.style.cssText = "position: absolute;right:7px;top:3px;";
		$dh.size(this.closeBut, 13, 13);
		
		this.minBut = this.closeBut.cloneNode(true);this.minBut.id = "minbut";
		this.minBut.src = "images/keep.gif";
		this.minBut.style.cssText +=";right: 15px;top:270px;width:142px;height:36px;";
		
		this.titlebar.appendChild(this.closeBut);
		this.body.appendChild(this.minBut);
		
		var self = this;
		$dh.addEv(this.closeBut, "click", function() {
		    DialogManager.hideDialog(self);
		});
		
		$dh.addEv(this.minBut, "click", function() {
		    var tar = BPanel.imgset.addItem(self.src);
		    tar.canvas.style.visibility = "hidden";
		    DialogManager.hideDialog(self, tar, function() {
		        tar.canvas.style.visibility = "visible";
		    });
		});
	},
	drawImgset: function() {
	    var div = document.createElement("div");
	    div.style.cssText= "position:absolute;width:200px;top:230px; left:15px;height:75px;border: solid 1px gray;background-color: #505050;";
	    this.body.appendChild(div);
	    this.imgset = new XImgScroller(div, 60,45,3);
	    
	    // For demo only
	    var self = this;
	    for (var i = 1; i <= 4; i ++) {
	        var item = this.imgset.addItem(i);
	        item.onClickItem = function(src) {
	            self.image.setContent(src);
	        }
	        $dh.opac(item.canvas,100);
	    }
	},
	
	drawImage: function() {
		this.image = new XImgFrame(this.body, 200,200,2);
		this.image.canvas.style.backgroundColor = "#bbccaa";
		$dh.pos(this.image.canvas,15,15);
		$dh.opac(this.image.canvas, 100);
	},
	drawArticle: function() {
		this.article = document.createElement("div");
		this.article.style.cssText += ";position:absolute;right:15px;top:15px;width: 200px;height:200px;text-wrap: break-word;overflow-y:auto;border:solid 1px gray;background-color: white;";
		this.body.appendChild(this.article);
		
		this.article.innerHTML = '<DIV style="line-height:20px;"><SPAN style="FONT-SIZE: 8pt"><STRONG>詳細情報</STRONG><BR />● 製品名:&nbsp;<BR />● ブランド<BR />● ジャンル<BR />● 価格：<BR /><BR /></SPAN><SPAN style="FONT-SIZE: 8pt"><STRONG>製品の説明</STRONG><BR />高品質だし、価格も安いものです。<BR />ｄｆｄｆ ｄｆｄ ｆｄｆｄｆdfｄｆ fdddfdfd<BR />ｄｆｄｆｄｆ</SPAN></DIV>';
	},
	drawOrderArea: function() {
		var div = document.createElement("div");
		div.style.cssText = "position:absolute;font-size:11px;width:200px;top:230px; right: 15px;height:36px;line-height:36px;";
		
		var span = document.createElement("span");
		span.innerHTML= "数量";
		 
		this.itemNum = document.createElement("input");
		this.itemNum.type = "text";
		this.itemNum.value = 1;
		this.itemNum.style.cssText = "width:25px;height:20px;";
		
		this.orderBut = document.createElement("img");
		this.orderBut.src = "images/cart.gif";
		this.orderBut.style.cssText = "position:absolute;top:-5px;right:0px;width:142px;height:36px;";
		
		this.body.appendChild(div);
		div.appendChild(span);div.appendChild(this.itemNum);
		div.appendChild(this.orderBut);
		
		var self = this;
		$dh.addEv(this.orderBut, "click", function() {
			var data = __DATA__.value[self.src];  // For demo only
			var tar = RPanel.addItem(self.src, data[1], self.itemNum.value, parseFloat(data[5].substr(1))*parseFloat(self.itemNum.value));
			if (BPanel.imgset.added[self.src])
				BPanel.imgset.removeItem(self.src);
			tar.canvas.style.visibility ="hidden";
			DialogManager.hideDialog(self, tar, function() {tar.canvas.style.visibility="visible";});
		});	
	},
	setContent: function(src) {
	    if ($dh.isNil(src)) src = 0;
	    this.src = src;
		this.image.setContent(src);
	},
	show: function (flag, time, dest, callback) {
		XPanel.prototype.show.apply(this,arguments);
	},
	onRunning: function() {
		/*this.height = parseInt(this.canvas.style.height,10);
		this.body.style.height = ((this.height - this.titleH >0) ? (this.height - this.titleH) : 0) + "px";*/
	}
});