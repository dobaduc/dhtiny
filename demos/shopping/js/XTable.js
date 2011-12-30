$dh.newClass("XTable", DHAnimItem, {
	_tempHTML_ : '<TABLE class="view" id="sheet1view" style="WIDTH: 100%"><THEAD class="sheetHeader"></THEAD><TBODY id="sheet1tbody"><TR class="trs" id="row_0" style="HEIGHT: 24px"><TD class="tds" style="CURSOR: pointer"><DIV class="headerTitle"></DIV></TD></TR></TBODY></TABLE>',		
	init: function() {
		DHAnimItem.prototype.init.apply(this,[document.body, {}]);
        this.setProps({left: 60, top: 100, width: 700, height: 20, style:";overflow:hidden;border: solid 1px #EBEADB;background-color: #EBEADB; border: solid 4px  #EBEADB;"});
		this.show(false);
		
		// previewer
		this.previewer = new XImgFrame(document.body);
		this.previewer.canvas.style.zIndex = 9999;
		this.previewer.show(false);
		// detail
		//this.detail = new XDetailDialog(document.body, "製品詳細");	
	},
	
	loadData: function(data) {
		if (typeof data == "object")	 {this.data = data;}
		else if (typeof data =="string") {this.data = eval('('+ $dh.ajax.GET(data)+')');}	
	},
	show: function(flag, time, callback) {
		if (time) {
			this.animCallback= callback || function() {};            
			if (flag == false)	
				this.onAnimStop = function() {
					this.show(false);					
					this.animCallback();
				}
			else {
				this.show(true);
				this.onAnimStop = this.animCallback;
			}
			
			if (flag== false) {
                this.draw({height:20}, time);
            }
			else {
                this.draw({height:440}, time);
            }
		}
		else {
			this.isVisible = flag;
			this.canvas.style.display = (flag==false)?"none":"";
		}		
	},
	
	createTable: function(nRow, nCol) {
		// Create table
		this.canvas.innerHTML = this._tempHTML_;
		this.table = this.canvas.childNodes[0];
				
		this.tbody = this.table.tBodies[0];
		this.thead = this.table.tHead;
		
		var TR = this.tbody.rows[0], TD = TR.childNodes[0];
		for (var j =0; j < nCol; j++) {TR.appendChild(TD.cloneNode(true));}
		for (var i=1; i < nRow; i++)  {
			var tr = TR.cloneNode(true) 
			this.tbody.appendChild(tr);
			if (i%2 ==1) tr.style.backgroundColor = "#F3F6F5";
		}
		
		// Header
		this.thead.appendChild(TR.cloneNode(true));
		for (var x=0; x < nCol; x++) {
			this.thead.rows[0].cells[x].className = "";
			div = this.thead.rows[0].cells[x].childNodes[0];
			if (x == 0) {
			    div.innerHTML = "※";
			    this.thead.rows[0].cells[0].style.width = "40px";
			}
			else
			    div.innerHTML = this.data.title[x-1];
		}
	},
	
	displayData: function(data) {
		if (data) this.loadData(data);
		if (this.table) {
			this.table.display = "";
			return; // FOR DEMO ONLY
		}
		
		var nRow = this.data.value.length, nCol = this.data.title.length;		
		var title = this.data.title;
		this.createTable(nRow, nCol);
	
		var self = this;		
		for (var i =0; i< nRow; i++) {
			for(var j=0; j<= nCol; j++) {
			    if (j == 0) {
			        this.tbody.rows[i].cells[j].childNodes[0].innerHTML = "";
			        this.tbody.rows[i].cells[j].style.width = "40px";
			    }
			    else
				    this.tbody.rows[i].cells[j].childNodes[0].innerHTML = this.data.value[i][j-1];
			}
				
			$dh.addEv(this.tbody.rows[i],"mouseover", function(ev) {
				if (DialogManager.isLocked)
				    return;
				
				var tar = $dh.evt(ev).target;
				while(tar.tagName.toUpperCase() !="TR") tar = tar.parentNode;
				tar.style.backgroundColor = "#d3d6d5";
				
				self.previewer.show(true);

				self.previewer.setContent(tar.rowIndex-1);	
				var xb = $dh.bounds(tar);                
			    $dh.css(self.previewer.canvas, {left: $dh.msPos(ev).left, top: xb.top + xb.height});
                //document.title = $dh.msPos(ev).left+ " vs " + (xb.top + xb.height)+ " => "+ self.previewer.canvas.style.cssText;
                //self.previewer.canvas.style.cssText += ";display:block;position:absolute;visibility:visible;"
			});
			$dh.addEv(this.tbody.rows[i],"mouseout", function(ev) {
				var tar = $dh.evt(ev).target;	
				while(tar.tagName.toUpperCase() !="TR") tar = tar.parentNode;
				if (tar.rowIndex % 2 == 0)
					tar.style.backgroundColor = "#F3F6F5";
				else
					tar.style.backgroundColor = "";
			});		
			$dh.addEv(this.tbody.rows[i],"click", function(ev) {
			    if (DialogManager.isLocked)
			        return;
			        
				var tar = $dh.evt(ev).target;
				while(tar.tagName.toUpperCase() !="TR") tar = tar.parentNode;

				showXMask(true);
				self.previewer.show(false);
				
				var mb = null; 
				// If showing this dialog for the first time
				if (!BPanel.imgset.added[tar.rowIndex-1] && !RPanel.added[tar.rowIndex-1]) {
					if (DialogManager.dialogs[tar.rowIndex-1])
						DialogManager.dialogs[tar.rowIndex-1].fromObj = null;
					var pos = $dh.evt(ev).pos;
					mb = {_newDFlag : true}; 
				}

				DialogManager.showDialog(tar.rowIndex-1, mb, function() {
				    if (DialogManager.dialogs[tar.rowIndex-1]) {
				    	DialogManager.dialogs[tar.rowIndex-1].minBut.style.display  = "none";
					    DialogManager.dialogs[tar.rowIndex-1].minBut.style.visibility = "hidden";
				    	if (!BPanel.imgset.added[tar.rowIndex-1] && !RPanel.added[tar.rowIndex-1]) {
				    		DialogManager.dialogs[tar.rowIndex-1].minBut.style.display  = "";   		
					    	DialogManager.dialogs[tar.rowIndex-1].minBut.style.visibility = "visible";
					    }
				    }
				});
			});			
		}
		
		//this.setDragTarget(this.table, this.canvas);
		this.setActions();
	},
	
	setActions: function() {
		var self = this;
		$dh.addEv(this.tbody,"mouseout", function(ev) {
			self.previewer.show(false);
		});	
	}
});