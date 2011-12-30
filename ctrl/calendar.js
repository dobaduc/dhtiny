// Calendar table
$dh.Require(["util/date","ctrl/richcanvas","ctrl/modalcanvas"]);
$dh.isLoaded("ctrl/calendar",true);
$dh.newClass("DHCalendar", {
    now: new Date(),
	__defaults__: {lang: "en_us" /*, currentmonth:(new Date()).FormatDateMonth()*/},
    init: function(container, props) {
		if (!props) props = {};
		if (props.popupmode) {
            props.hideOnMaskClick = true;
			this._doExtend(DHModalCanvas);
			DHModalCanvas.prototype.init.apply(this,[container, props]);
			var self = this;
			this.addEv("onhide", function() {
				self.clearSelected();
			});
		}
		else{
			this._doExtend(DHRichCanvas);
			DHRichCanvas.prototype.init.apply(this,arguments);
		}

        // Make calendar table without rows
        this.createTable();
        // Draw day bar only
        this.createDayBar();
        // Draw full calendar
        this.draw();
    },

    _doExtend : function (_class ){
    	for (var p in _class.prototype)
    		if (p != "init") this[p] = _class.prototype[p];
    },

    // Create table element to display whole calendar
    createTable: function() {
        this.table = document.createElement("table");
        this.table.style.cssText += ";position:relative;height:100%;border-collapse:collapse;table-layout:fixed;margin:0px;padding:0px;border:none;";
        this.table.className = "CalendarTable";
        this.table.style.width = "100%";
        this.canvas.appendChild(this.table);

        // Create tbody
        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.tbody);
    },
    // Create weekday area
    createDayBar: function() {
        var days = DHCalendar.lang[this.lang].days; // Default is from Monday to Sunday
        this.daybar = this.table.createTHead();
        //this.daybar.className = "DayBar";
        var row = this.daybar.insertRow(-1);
        row.className = "DayBar";
        row.style.height = this.daybarheight; // Calendar header cell height

        for (var i = 0; i < days.length; i++) {
            var cell = this.createCell();
            cell.childNodes[0].innerHTML = "<span class='dateLabel'>" + days[i] + "</span>";
            row.appendChild(cell);
        }
    },
    // Just return a cell with inner div
    createCell: function() {
        var cell = document.createElement("td");
        cell.style.cssText += ";vertical-align:top;padding:0px;margin:0px;overflow:hidden;width:" + (100 / 7) + "%;";
        cell.innerHTML = "<div style='position:relative;display:block;overflow:hidden;width:100%;height:100%;'></div>";
        return cell;
    },
    // Return an array of dates to display on table
    getDateData: function() {
        var c = this.currentmonth.split("/");
        var year = parseInt(c[0], 10), month = parseInt(c[1], 10) - 1;
        var firstDate = new Date(year, month, 1);
        var lastDateOfLastMonth = new Date(year, month, 0).getDate();
        var lastDate = new Date(year, month + 1, 0);
        var data = [];

        // Fill first week's data
        for (var i = firstDate.getDay() - 1; i >= 0; i--)
            data.push("-" + (lastDateOfLastMonth - i));
        // Fill this month's data
        for (var i = 1; i <= lastDate.getDate(); i++) data.push(i);
        // Fill last week's data
        for (var i = lastDate.getDay() + 1; i < 7; i++)
            data.push("+" + (i - lastDate.getDay()));

        if ((data[0] + "").indexOf("-") == 0) {
            this.firstDate = $dh.date.calculateMonth(this.currentmonth, -1) + "/" + ("" + data[0]).replace(/\-/g, "");
        }
        else {
            this.firstDate = this.currentmonth + "/" + data[0];
        }
        if ((data[data.length - 1] + "").indexOf("+") == 0) {
            this.lastDate = $dh.date.calculateMonth(this.currentmonth, +1) + "/" + ("" + data[data.length - 1]).replace(/\+/g, "");
        }
        else {
            this.lastDate = this.currentmonth + "/" + data[data.length - 1];
        }
        return data;
    },
    // Create a cell with date label and event container
    makeDateCellData: function(date, day, row) {
        var className = "";
        date = "" + date;

        if (date.length == 1) date = "0" + date;
        var fullDate = this.currentmonth + "/" + date;

        if (date.indexOf("-") == 0 || date.indexOf("+") == 0) {
            var xdate = date.substr(1);
            if (xdate.length == 1) xdate = "0" + xdate;
            if (date.charAt(0) == "-") {
                className = "LastMonth";
                fullDate = $dh.date.calculateMonth(this.currentmonth, -1) + "/" + xdate;
            }
            else {
                className = "NextMonth";
                fullDate = $dh.date.calculateMonth(this.currentmonth, +1) + "/" + xdate;
            }
            date = parseInt(date.substr(1), 10);
        }
        else
            date = parseInt(date, 10);

        if (day!= 0 && day != 6) className += " Weekday";
        else className += " Weekend";

        var now = new Date();
        month = now.getMonth()+1;
        today = now.getFullYear()+ "/"+ (month<10? "0"+month: month) +"/"+ now.getDate();
        if (fullDate == today) // Today
        	className += " Today";
        return {"dateLabel": date, "day": day, "fullDate": fullDate, "className": className};
    },

    // Draw calendar body
    drawBody: function() {
        this.dateData = this.getDateData();
        this.nrow = nrow = Math.floor(this.dateData.length / 7);
        this.cellheight = Math.floor((this.height - this.daybarheight) / nrow); // Calendar cell height

        for (var i = this.nrow; i < this.tbody.childNodes.length; i++)
            //this.tbody.childNodes[i].style.display = "none";
        	this.tbody.deleteRow(this.tbody.rows.length-1);

        // Make calendar table
        for (var i = 0; i < nrow; i++) {
            this.drawRow(i);
        }

        // Get real cell width
        this.cellwidth = this.tbody.rows[0].cells[0].offsetWidth; // Calendar cell width
    },
    drawRow: function(i) {
        var row = this.tbody.rows[i];
        if (!row) {
            row = document.createElement("tr");
            this.tbody.appendChild(row);
            for (var j = 0; j < 7; j++) {
            	var cell = this.createCell();
                row.appendChild(cell);
                this.setCellEvents(i, j);
            }
        }
        else
            row.style.display = "";

        // Change cell data
        for (var j = 0; j < 7; j++) {
            row.cells[j].dateData = this.makeDateCellData(this.dateData[i * 7 + j], j, i);
            this.drawCell(i, j);
        }
        // Reset row height
        row.style.height = this.cellheight + "px";
    },

    drawCell: function(row, col) { // NOTE: Overwrite this method to make other kind of cell
    	var cell = this.tbody.rows[row].cells[col];
    	var div = cell.childNodes[0];
    	div.style.lineHeight = this.cellheight + "px";
    	div.innerHTML = cell.dateData.dateLabel;
    	div.className = cell.dateData.className;
    },
    setCellEvents: function(row, col) {
    	var cell = this.tbody.rows[row].cells[col];
    	var self = this;
    	$dh.addEv(cell, "onmousedown", function(ev) {
    		var xcell = $dh.evt(ev).target;
    		while (xcell.tagName.toLowerCase() != "td")
    			xcell = xcell.parentNode;
    		var pos = self.getCellPos(xcell.dateData.fullDate);
    		self.onCellClick(ev, pos.row, pos.col);
    	});
    	$dh.addEv(cell, "oncontextmenu", function(ev) {
    		return false;
    	});
    },

    // i, j : position of cell
    onCellClick: function(ev, i, j) {
    	var cell = this.tbody.rows[i].cells[j];
    	var c = cell.childNodes[0].className || "";

    	// Default selection mode is single selection mode
    	this.setCellStatus(i, j, "selected");
    	for (var x=0; x < this.tbody.rows.length; x++)
    		for (var y =0; y < 7; y++)
    			if ((x!= i || y!= j) && this.tbody.rows[x].cells[y].childNodes[0].className.indexOf("Selected") >=0) // Clear all other selected
    				this.tbody.rows[x].cells[y].childNodes[0].className = this.tbody.rows[x].cells[y].childNodes[0].className.replace(/Selected/g,"");
    	this.raise("onselected", cell.dateData.fullDate);
    },

    // Status : null/"" or "selected"
    // i, j : position of cell
    // OR: i == date, j = status
    setCellStatus: function(i, j, status) {
    	if (!$dh.isNum(i)) { // i is a date string
    		status = j;
    		var pos = this.getCellPos(i);
    		i = pos.row;
    		j = pos.col;
    	}
    	var cell = this.tbody.rows[i].cells[j];
    	var c = cell.childNodes[0].className;
    	if (status == "selected" && c.indexOf("Selected") <0)
    		cell.childNodes[0].className +=" Selected";
    	else if (status != "selected")
    		cell.childNodes[0].className = c.replace(/Selected/g,"");
    },
    getSelectedDates: function() {
    	var d = [];
    	for (var x=0; x < this.tbody.rows.length; x++)
    		for (var y =0; y < 7; y++)
    			if (this.tbody.rows[x].cells[y].childNodes[0].className.indexOf("Selected") >=0)
    				d.push(this.tbody.rows[x].cells[y].dateData.fullDate);
    	return d;
    },
    clearSelected: function() {
    	for (var x=0; x < this.tbody.rows.length; x++)
    		for (var y =0; y < 7; y++)
    			if (this.tbody.rows[x].cells[y].childNodes[0].className.indexOf("Selected") >=0) // Clear all other selected
    				this.tbody.rows[x].cells[y].childNodes[0].className = this.tbody.rows[x].cells[y].childNodes[0].className.replace(/Selected/g,"");
    },
    draw: function() {
    	this.raise("onbeforedraw");
        this.drawBody();
        this.raise("onafterdraw");
    },

    getCellPos: function(date) {
        for (var i = 0; i < this.nrow; i++)
            for (var j = 0; j < 7; j++) {
            	//alert("Comparet "+ this.tbody.rows[i].cells[j].dateData.fullDate.replace(/\//g, "") + " to "+ date.replace(/\//g, ""))
            	if (this.tbody.rows[i].cells[j].dateData.fullDate.replace(/\//g, "") == date.replace(/\//g, ""))
            		return {row: i, col: j};
            }
        return null;
    },

    isInCalendar: function(date) {
        var c1 = $dh.date.compareDate(date, this.firstDate), c2 = $dh.date.compareDate(date, this.lastDate);
        return ((c1 == "==" || c1 == ">") && (c2 == "==" || c2 == "<"));
    },

    setCurrentMonth: function(month) {
    	this.currentmonth = month;
    	this.draw();
    },
    setLanguage: function(lang) {
    	this.lang = lang;
    	this.draw();
    },
    goNext: function(dir, yearMode) {
        dir = $dh.isNil(dir) ? 1: dir;
        var tarMonth;
        if (!yearMode)
        	tarMonth= $dh.date.calculateMonth(this.currentmonth, dir);
        else
        	tarMonth= $dh.date.calculateMonth(this.currentmonth, 12*dir);

        var saveMonth = this.currentmonth;
        this.raise("onbeforechangemonth", saveMonth, tarMonth);
        this.setCurrentMonth(tarMonth);
        this.raise("onafterchangemonth", saveMonth, tarMonth);
    },
    goPrevious: function(dir, yearMode) {
    	dir = $dh.isNil(dir) ? 1: dir;
    	this.goNext(-dir, yearMode);
    }
});

DHCalendar.lang = {
	"jpn": {
		days: ["日", "月", "火", "水", "木", "金", "土"],
		year: "年", month: "月", today: "今日", next: "次へ", previous:"前へ"
	},
	"en_us": {
		days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		months: ["Jan","Feb","Mar","Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		year: "Year", month: "Month", today: "Today", next: "Next", previous:"Previous"
	}
};