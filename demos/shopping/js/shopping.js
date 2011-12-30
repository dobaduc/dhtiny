var SearchForm, ResultTab, MenuBut, GCloseBut;
var RPanel, BPanel, DialogManager;
var Mask;

document.onselectstart = function() {return false;}
document.onmousedown = function() {return false;}

$dh.addLoader(function() {
	createXMask();
	drawRightPanel();
	drawBottomPanel();	
	SearchForm = new XSearchForm();
	ResultTab = new XTable();
	MenuBut = document.getElementById("menuButton");
	DialogManager = new XDialogManager();
	setSearchActions();
		
	// Global close button
	var cb = GCloseBut = document.createElement("img");
	cb.src =  "images/icon_close2.jpg";
	cb.style.cssText = "position: absolute;width:13px;height:13px;display:none;z-index:999;";
	document.body.appendChild(cb);
	cb.onmouseover = function() {this.style.display = "";};
});

function showGCloseBut(flag, tar) {
	var cb = GCloseBut;
	if (flag == false) {
		cb.style.display = "none";
	}
	else {
		cb.style.display = "";
		var tb = $dh.bounds(tar);
		cb.style.top = (tb.top+2) + "px";
		cb.style.left = (tb.left+2) + "px";		
	}
}

function setSearchActions() {
	SearchForm.onSubmit = function() {	
		this.show(false, 0.5, function() {
		    
			ResultTab.show(true,0.5, function() {
				ResultTab.displayData(__DATA__);
				ShowPanels(true);				
			});
		});
	};
	
	SearchForm.addEv("onanimation", function() {
		var b= $dh.bounds(this.canvas);        
		var nLeft =(b.left+b.width);
		if (nLeft <10) nLeft = 10;
		MenuBut.style.left = (nLeft-5)+"px";
        
	});
}

function createXMask() {
	window.__xmask__ = document.createElement("input");
	window.__xmask__.type = "text";
	window.__xmask__.disabled = "disabled";/**/
	
	//window.__xmask__ = document.createElement("iframe");
	__xmask__.style.display = "none";
	document.body.appendChild(__xmask__);
	__xmask__.style.cssText = "background-color:black;border:none;width:100%;height:100%;display:none;border:none;top:0px;left:0px;position:absolute;z-index:100;";
	__xmask__.frameBorder= "0";	
	$dh.opac(__xmask__, 60);
	
	/*var doc = __xmask__.contentWindow.document;
	doc.open();
	doc.write("<html><body style='background:black;'></body></html>");
	doc.close();/**/
}
function showXMask(flag, target) {
	window.__xmask__.style.display = (flag==false)? "none":"";
	window.__xmask__.style.zIndex = 100;
	if (flag && target) target.style.zIndex = 200;
}

function showSearchForm() {    
	if (SearchForm.isVisible == false) { // show search form
		if (ResultTab.isVisible) {
			ResultTab.show(false,1, function() {
			    DialogManager.hideAllDialogs();
			    SearchForm.show(true, 1.5);
			});
		} else {
			SearchForm.show(true,0.9);
		}
	}
	else { // hide search from		
		SearchForm.show(false,0.9);
	}
}

function drawRightPanel() {
	RPanel = new XOrderList(document.body,"発注");
	RPanel.canvas.style.cssText +=";right:0px;height:100%;width:18px;z-index:200;";
	RPanel.repairSize();
	RPanel.canvas.onDragStop = function() { // Dont care about leak
		var w = parseInt(RPanel.canvas.style.width,10);
		if (w > 250) w = 250; 
		if (w < 140) w = 140;
		
		RPanel.canvas.style.cssText += ";left:auto;width:"+w +"px";
		BPanel.canvas.style.width = (RPanel.canvas.offsetLeft-1) +"px";
	}
	RPanel.show(false);
	//RPanel.show(true,300, {width:200});
	//RPanel.addItem(1,"fdfdfd");
	//RPanel.addItem(2,"33fdfdfd");
}

function drawBottomPanel() {
	BPanel = new XPanel(document.body,"選択した項目");
    BPanel.canvas.style.cssText +=";bottom:0px;width:"+ ($dh.bodySize().width-300)+"px;height:18px;z-index:200;";
	BPanel.repairSize();
	$dh.dragger.setDragParams(BPanel.canvas, {mode: ""});
	
	BPanel.imgset = new XImgScroller(BPanel.body, 80,60,3, true);

	BPanel.show(false);
}

function ShowPanels(flag) {
	if (flag != false && !window.isPanelShown) { // Show panels
		window.isPanelShown = true;
		DialogManager.isLocked = true;
		BPanel.show(true,0.7, {height: 100}, function() {
		    DialogManager.isLocked = false;
		});		
		RPanel.show(true,0.7, {width:300});
	}
	if (flag==false) { // Hide panels
		BPanel.show(false,0.7, {height: 18}, function() {
			RPanel.show(false,0.7, {width:18});
		});
	}
}

__DATA__ = { // Generate dummy data
	title: ["製品CD", "製品名", "ブランド", "ジャンル", "サイズ","単価"],
	value: []
};

for (var p=0; p < 20; p++) {
	var BRAND = ["GAP","UNIQLO","FENDI","BALENCIAGA","LOUIS VUITTON","GUCCI","CHLOE","CHANEL"];
	var GENRE = ["スカート","ジーンズ","スーツ"];
	var SIZE = ["S","M","L","XL","XXL"];

	var brand = BRAND[Math.floor(Math.random()*8)];
	var genre = GENRE[Math.floor(Math.random()*3)];
	var size = SIZE[Math.floor(Math.random()*5)];
	var cost = 3000+ Math.floor(Math.random()*30000);
	__DATA__.value.push(["000"+p, "Product"+p, brand, genre, size, '\￥'+cost]);
}