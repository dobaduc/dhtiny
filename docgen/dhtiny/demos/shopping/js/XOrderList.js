$dh.newClass("XOrderList", XPanel, {
    added: {},
	addItem: function(src, nameTxt, numTxt, costTxt) {
	    var label = nameTxt;
		if (parseInt(src,10) > 9) label += "&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;";
		else label+="&nbsp;&nbsp;&nbsp;x&nbsp;";
	
		if (numTxt.length<2) label += "&nbsp;"+ numTxt + "&nbsp;&nbsp;&nbsp;\￥"+costTxt;
		else label += numTxt + "&nbsp;&nbsp;&nbsp;\￥"+ costTxt;		
	    
		if (this.added[src]) {
			//alert("Return " + src +" = "+ this.added[src] + ", obj = " + this.items[this.added[src]-1]);
			var item = this.items[this.added[src]-1];
			item.setLabel(label);
			this.changeTotal();
			return item;
		}
		
		var item = new XOrderItem(this.body, src, label);
		item.src = src;
		item.nameTxt = nameTxt;
	    item.numTxt = numTxt;
	    item.costTxt = costTxt;		
		this.items.push(item);
		this.added[src] = this.items.length;		
		
		ResultTab.tbody.rows[parseFloat(item.src+"",10)].cells[0].childNodes[0].innerHTML = "<img src='images/cart_flag.png' style='width:17px;height:17px;' />";
		
		var self = this;
		$dh.addEv(item.canvas,"click", function() { self.clickItem(item); });
		$dh.addEv(item.canvas,"mouseover", function() { self.mouseOverItem(item); });
		$dh.addEv(item.canvas,"mouseout", function() { self.mouseOutItem(item); });
		
		this.changeTotal();
		return item;
	},
	removeItem: function(item) { // Or item index
		if (typeof item != "object") 
			item = this.items[this.added[item]-1];
		if (!BPanel.imgset.added[item.src])
		    ResultTab.tbody.rows[parseFloat(item.src+"",10)].cells[0].childNodes[0].innerHTML = "";
        else 
            ResultTab.tbody.rows[parseFloat(item.src+"",10)].cells[0].childNodes[0].innerHTML = "<img src='images/check.png' style='width:17px;height:17px;' />";
            
		var saveIndex = this.added[item.src];
		var saveSrc = item.src;
		this.added[item.src] = false;
		for (var i = saveIndex; i < this.items.length; i++) {
			this.items[i-1].icon.src = this.items[i].icon.src;
			this.items[i-1].label.innerHTML = this.items[i].label.innerHTML;
			this.items[i-1].src = this.items[i].src;
			this.added[this.items[i-1].src] = i;
		}
		
		this.body.removeChild(this.items[this.items.length-1].canvas);
		this.items.pop();	
		this.changeTotal();
		if (DialogManager.dialogs[saveSrc].canvas.display != "none") {
			DialogManager.hideDialog(DialogManager.dialogs[saveSrc]);
		}
	},
	
	clickItem: function(item) { // For demo only
		var dialog = DialogManager.dialogs[item.src];
		if (dialog)
			dialog.minBut.style.visibility = "hidden"; // Do not allow minimize
					
		ResultTab.previewer.show(false);
		DialogManager.showDialog(item.src, item);
	},
	
	mouseOverItem: function(item) {
	    if (DialogManager.isLocked)
	        return;
		var self = this;
		showGCloseBut(true,item.canvas);
		GCloseBut.onclick = function() {
			showGCloseBut(false);
			self.removeItem(item);	
		}
	},
	
	mouseOutItem: function(item) {	showGCloseBut(false); },
	
	changeTotal: function() {
		if (!this.totalArea) {
			this.totalArea = document.createElement("div");
			this.totalArea.style.cssText = "position: absolute;left:5px;bottom:0px;height:100px";
			this.totalArea.style.cssText += ";font-family: Verdana;font-size:15px;padding-left:5px;color:white;";
			
			this.body.appendChild(this.totalArea);
			this.totalArea.innerHTML="<b>合計</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\￥";
			
			this.totalTxt =document.createElement("span");			
			this.totalArea.appendChild(this.totalTxt);
			
			this.totalArea.appendChild(document.createElement("br"));
		    
		    this.orderButton = document.createElement("button");
		    this.orderButton.style.cssText += 'FONT-WEIGHT: bold; FONT-SIZE: 14px; BACKGROUND: url(images/hd_row_bg.gif); WIDTH: 80%; HEIGHT: 40px;">';
		    this.totalArea.appendChild(this.orderButton);
		    this.orderButton.innerHTML = "購入";
		   
		    var self = this;		
		        $dh.addEv(this.orderButton, "click", function() {
		        self.printOrderList();
		    });
		}
		
		var total =0;	
		for (var i =0; i < this.items.length; i++) {
		    if (this.items[i] && this.items[i].canvas && this.items[i].canvas.parentNode == this.body) {
			    var lb = this.items[i].label.innerHTML;
			    var num = lb.substr(lb.indexOf("\￥")+1);
			    total += parseFloat(num);
			}
		}

        this.totalTxt.innerHTML = total;
	},
	printOrderList: function() {    
	    DialogManager.hideAllDialogs();
	    showXMask();
	    __xmask__.style.zIndex = 500;
	    
	    if (!this.lastList) {
	        this.lastList = new XLastList(document.body, this);
	    }
	    this.lastList.show(true);
	}
});

$dh.newClass("XOrderItem", null, null, {
	iwidth: 35, iheight: 35,
	init: function(container, icon, label) {
		this.canvas = document.createElement("div");
		this.canvas.style.cssText = "cursor:pointer;margin-top:5px;float:left;position:relative;width: 100%;padding-left: 5px;";
		this.canvas.style.height = this.iheight + "px";
				
		container.appendChild(this.canvas);
		this.drawIcon(icon);
		this.drawLabel(label);
	},
	drawIcon: function(icon) { // icon name = [Images/]imageName [.jpg]
		this.icon = document.createElement("img");
		$dh.bounds(this.icon, [2, 2, this.iwidth, this.iheight]);
		
		this.setIcon(icon);
		this.canvas.appendChild(this.icon);
	},
	drawLabel: function(label) {
		this.label = document.createElement("div");
		this.label.style.cssText = "position: absolute;left:35px;top:0px;";
		this.label.style.cssText += ";font-family: Verdana;font-size:10px;padding-left:5px;color:white;";
		this.label.style.cssText += ";height:"+this.iheight+"px;";
		
		this.setLabel(label);
		this.canvas.appendChild(this.label); 
	},
	drawCloseIcon: function(icon) {
		this.closeIcon = document.createElement("img");
		this.closeIcon.src =  "images/icon_closei.jpg";
		this.closeIcon.style.cssText = "position: absolute;right:5px;top:0px;";
		$dh.size(this.icon, 13, this.iheight);
		this.canvas.appendChild(this.closeIcon);
		
		var self = this;
		$dh.addEv(this.closeIcon, "click", function() {
			self.canvas.parentNode.removeChild(self.canvas); // Take care of remove item later
		});
	},
	
	setLabel: function(title) {
		this.label.innerHTML = title;
	},
	setIcon: function(src) { // icon name = [Images/]imageName [.jpg]
		this.icon.src = "images/"+src+".jpg";
	}
});

$dh.newClass("XLastList", "XTable",null, {		
	init: function(container, srcList) {
		var div = document.createElement("div");
		div.style.cssText = "position:absolute;boder: solid 2px #9fbfef;left:60px;top:30px; width: 710px;height:450px;margin: auto 0px 0px;z-index:900;background-color:white;font-size:13px;font-family: Verdana;";
		
        this.canvas = document.createElement("div");
        this.srcList = srcList;
                
        container.appendChild(div);
        div.appendChild(this.canvas);
        
        this.canvas.id = "lastList";
        this.canvas.style.cssText += ";background-color:white;left:1%;width:98%;top:0%;height:100%; margin: auto 0px 0px;position:absolute;";
        
        this.drawParts();
	},
	drawParts: function() {
	    this.title = document.createElement("div");
	    this.canvas.appendChild(this.title);
	    this.title.innerHTML = "購入リスト";	    
	    this.title.style.cssText = ";font-size: 17px; color: #115566; font-weight: bold; text-align: center;padding-top: 20px;";
	    this.canvas.appendChild(this.title);
	    
	    this.body = document.createElement("div");
	    this.body.style.cssText +=";position:absolute; top:70px;width:100%;border: solid 1px #9fafbf;";
	    this.canvas.appendChild(this.body);	    
	},
	
	show: function(flag) {
	    if (flag == false) {
	        this.canvas.parentNode.style.display = "none";
            showXMask(false);
        } else {
            this.canvas.parentNode.style.display = "";
	        this.canvas.parentNode.style.zIndex = 999;
	        this.displayData();
	    }
	},
	addItem: function(cells, nameTxt, numTxt, costTxt) {
	    var item = document.createElement("div");
	    item.style.cssText +=";position:relative;padding-left:25px;height:40px;line-height:40px;";
	    
	    
	    var num = document.createElement("div"); 
	    var cost = document.createElement("div"); 	    
	    this.body.appendChild(item);
	    	    
	    item.innerHTML = nameTxt; //name.style.cssText = "eft:0px;top:0px;";
	    item.appendChild(num);  num.innerHTML = numTxt;   num.style.cssText +=";position:absolute; right: 200px;height:40px;top:0px;";
	    item.appendChild(cost); cost.innerHTML = costTxt; cost.style.cssText +=";position:absolute; right: 25px;height:40px;top:0px;";
	    
	    if (nameTxt.indexOf("製品") > 0) {
	    	item.style.cssText +=";border-bottom:solid 1px black;background-color:#efefef;";
	    }
	    else if (nameTxt.indexOf("合計") < 0) {
	    	item.style.borderBottom = "dotted 1px black";
	    }
	    else item.style.fontSize = "15px";
	},
	
	displayData: function() {
		// Clear data
		this.srcList.items.push({nameTxt:"合計", numTxt:"", costTxt:this.srcList.totalTxt.innerHTML});
				
		// Create table
		var nRow = this.srcList.items.length, nCol = 4;		
		var cWidth = [25,460,40,100];
		var cTitle = ["No","製品名","量数","価格"];
		
		if (!this.table) {
			this.body.innerHTML = this._tempHTML_;
					
			this.table = this.body.childNodes[0];
			this.tbody = this.table.tBodies[0];
			this.thead = this.table.tHead;
				
			var TR = this.tbody.rows[0], TD = TR.childNodes[0];		
			TR.removeChild(TD);
			for (var j =0; j < nCol; j++) {
				var td =  TD.cloneNode(true);
				TR.appendChild(td);
				td.style.width = cWidth[j] + "px";
			}
			
			// Header
			this.thead.appendChild(TR.cloneNode(true));
			for (var x=0; x < nCol; x++) {
				this.thead.rows[0].cells[x].className = "";
				this.thead.rows[0].cells[x].innerHTML = cTitle[x];
			}
		}
		else {
			while(this.tbody.rows[1])
				this.tbody.deleteRow(1);
		}
		
		var TR = this.tbody.rows[0];
		this.setItem(0,TR.childNodes);
		
		for (var i=1; i < nRow; i++)  {
			var tr = TR.cloneNode(true) 
			this.tbody.appendChild(tr);
			if (i%2 ==1) 
				tr.style.backgroundColor = "#F3F6F5";
			this.setItem(i,tr.childNodes);
		}
		        
        this.srcList.items.pop();
        
        if (!this.button) {
        	// Draw button
			var bc = document.createElement("div");	    
	        bc.style.cssText = "text-align:center;width:100%;paddingLeft:25px;position:absolute;bottom: 20px;";	        
	        var button = this.button = document.createElement("button");
	        button.style.cssText = "height:30px;line-height:30px;width:100px;";
	        button.innerHTML = "閉じる";
	        
	        this.canvas.appendChild(bc);	        
	        bc.appendChild(button);
	        
	        var self = this;
	        $dh.addEv(button,"click",function() {    
	            self.show(false);
	        });
        }
	},
	
	setItem: function(i, cells) {
		cells[1].innerHTML = this.srcList.items[i].nameTxt;
		cells[2].innerHTML = this.srcList.items[i].numTxt;
		cells[3].innerHTML = "\￥" + this.srcList.items[i].costTxt;
		if (i < this.srcList.items.length-1) {
			cells[0].innerHTML = i;
		}
		else {
			cells[0].innerHTML = "";
			cells[0].parentNode.style.height = "30px";
			cells[1].parentNode.style.fontSize = "15px";
		}
	}
});


/*$dh.newClass("XLastList", null, null, {
	init: function(container, srcList) {
		var div = document.createElement("div");
		var bs = AFM.DOM.bodySize();		
		
		div.style.cssText = "position:absolute;boder: solid 2px #9fbfef;left:5%;width:90%;top:10%;height:80%;margin: auto 0px 0px;z-index:900;background-color:white;";
		
        this.canvas = document.createElement("div");
        this.srcList = srcList;
                
        container.appendChild(div);
        div.appendChild(this.canvas);
        
        this.canvas.id = "lastList";
        this.canvas.style.cssText += ";background-color:white;font-size:13px;font-family: Verdana;left:5%;width:90%;top:0%;height:100%; margin: auto 0px 0px;position:absolute;";
        
        this.drawParts();
	},
	drawParts: function() {
	    this.title = document.createElement("div");
	    this.canvas.appendChild(this.title);
	    this.title.innerHTML = "購入リスト";	    
	    this.title.style.cssText = ";font-size: 17px; color: #115566; font-weight: bold; text-align: center;padding-top: 20px;";
	    this.canvas.appendChild(this.title);
	    
	    this.body = document.createElement("div");
	    this.body.style.cssText +=";position:absolute; top:70px;width:100%;border: solid 1px #9fafbf;";
	    this.canvas.appendChild(this.body);	    
	},
	
	addItem: function(nameTxt, numTxt, costTxt) {
	    var item = document.createElement("div");
	    item.style.cssText +=";position:relative;padding-left:25px;height:40px;line-height:40px;";
	    
	    
	    var num = document.createElement("div"); 
	    var cost = document.createElement("div"); 	    
	    this.body.appendChild(item);
	    	    
	    item.innerHTML = nameTxt; //name.style.cssText = "eft:0px;top:0px;";
	    item.appendChild(num);  num.innerHTML = numTxt;   num.style.cssText +=";position:absolute; right: 200px;height:40px;top:0px;";
	    item.appendChild(cost); cost.innerHTML = costTxt; cost.style.cssText +=";position:absolute; right: 25px;height:40px;top:0px;";
	    
	    if (nameTxt.indexOf("製品") > 0) {
	    	item.style.cssText +=";border-bottom:solid 1px black;background-color:#efefef;";
	    }
	    else if (nameTxt.indexOf("合計") < 0) {
	    	item.style.borderBottom = "dotted 1px black";
	    }
	    else item.style.fontSize = "15px";
	},
	
	show: function(flag) {
	    if (flag == false) {
	        this.canvas.parentNode.style.display = "none";
            showXMask(false);
        } else {
            this.canvas.parentNode.style.display = "";
	        this.canvas.parentNode.style.zIndex = 999;
	    
	        this.body.innerHTML = "";
	        
	        this.addItem("<b>製品</b>","<b>数量</b>","<b>価格</b>");
	        for (var i = 0; i < this.srcList.items.length; i ++) {	            	            
                this.addItem((i+1)+ ".&nbsp;&nbsp;" + this.srcList.items[i].nameTxt,this.srcList.items[i].numTxt,"\￥"+this.srcList.items[i].costTxt);
	        }
	        this.addItem("<br/><b>合計</b>","<br/>","<br/>\￥"+this.srcList.totalTxt.innerHTML);
	        
	        
	        var bc = document.createElement("div");	    
	        bc.style.cssText = "text-align:center;width:100%;paddingLeft:25px;position:absolute;bottom: 20px;";	        
	        var button = document.createElement("button");
	        button.style.cssText = "height:30px;line-height:30px;width:100px;";
	        button.innerHTML = "閉じる";
	        
	        this.canvas.appendChild(bc);	        
	        bc.appendChild(button);
	        
	        var self = this;
	        $dh.addEv(button,"click",function() {    
	            self.show(false);
	        });
	    }
	}
});*/