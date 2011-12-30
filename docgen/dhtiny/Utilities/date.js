DateProcessor = {
    parseDate: function(date) { // 2008/08/08 or 20080808
        if (date.indexOf("/") > 0) {
            var d = date.split("/");
            for (var i = 0; i < d.length; i++)
                d[i] = parseInt(d[i], 10);
        }
        else {
            var d = new Array();
            d[0] = parseInt(date.substr(0, 4), 10);
            if (date.length > 4) d[1] = parseInt(date.substr(4, 2), 10);
            if (date.length > 6) d[2] = parseInt(date.substr(6, 2), 10);
        }
        return d;
    },
    parseTime: function(time) { // Format: 0930, 0820
        return [parseInt(time.substr(0, 2), 10), parseInt(time.substr(2), 10)];
    },
    calculateTime: function(time, h, m) {
        time = this.parseTime(time);
        time[1] += m;
        if (time[1] >= 60) { time[1] -= 60; h++; }
        if (time[1] < 0) { time[1] += 60; h--; }
        time[0] += h;
        if (time[0] > 23) time[0] = time[0] - 24;
        if (time[0] < 0) time[0] = 24 + time[0];
        if (time[0] < 10) time[0] = "0" + time[0];
        if (time[1] < 10) time[1] = "0" + time[1];
        return time.join("") + "";
    },
    arrToDate: function(arr, delimiter) {
        var str = "";
        if ($dh.isNil(delimiter)) delimiter = "";

        for (var x = 0; x < arr.length; x++) {
            if (arr[x] < 10)
                arr[x] = "0" + arr[x];
            str += arr[x] + delimiter;
        }
        if (delimiter != "") str = str.substr(0, str.length - 1);
        return str;
    },
    calculateMonth: function(date, delta) {
        date = this.formatDate(date, "/");
        var t = date.split("/");
        var dir = (delta < 0) ? -1 : 1;
        delta = Math.abs(delta);

        var dy = Math.floor(delta / 12); // delta year
        delta = delta - dy * 12; // delta month

        t[0] = parseInt(t[0], 10) + dy * dir;
        t[1] = parseInt(t[1], 10) + delta * dir;

        if (t[1] < 1) { t[1] = 12; t[0]--; }
        else
            if (t[1] > 12) { t[1] = 1; t[0]++; }
        if (t[1] < 10)
            t[1] = "0" + t[1];
        return t[0] + "/" + t[1];
    },
    formatDate: function(date, deli) {
        date = date.replace(/\//g, "").replace(/\-/g, "");
        deli = deli || "";
        if (date.length > 6)
            return date.substr(0, 4) + deli + date.substr(4, 2) + deli + date.substr(6, 2);
        else
            return date.substr(0, 4) + deli + date.substr(4, 2);
    },
    getMonday: function(midday) {
        midday = this.formatDate(midday, "/");
        var w = new Date(midday).getDay();
        if (w == 0) w = -6;
        else w = -(w - 1);
        return this.calculateDate(midday, w);
    },
    getDateData: function(beginDate, endDate, mode) {
        // Return an array of date in given range
        var bd = this.parseDate(beginDate);
        var ed = this.parseDate(endDate);
        beginDate = this.arrToDate(bd, "/");
        var ret = new Array(); /// Array of date: ["20020807","20020814",....]

        switch (mode) {
            case "month":
                while (bd[0] <= ed[0]) {
                    if (bd[0] == ed[0] && bd[1] > ed[1])
                        break;
                    ret.push(bd[0] + "/" + bd[1]);
                    bd[1]++;
                    if (bd[1] > 12) { // Go to next year now
                        bd[0]++;
                        bd[1] = 1;
                    }
                }
                break;
            case "week":
                var startDate;
                var week = this.newDate(beginDate).getDay() + 1;
                if (week != 1) {
                    if (week == 0) {
                        week = 6;
                    } else {
                        week -= 1;
                    }
                    startDate = this.calculateDate(beginDate, -week);
                } else {
                    startDate = beginDate;
                }

                while (this.compareDate(startDate, endDate) != ">") {
                    ret.push(startDate);
                    startDate = this.calculateDate(startDate, 7);
                }
                break;
            case "day":
                while (this.compareDate(beginDate, endDate) != ">") {
                    ret.push(beginDate);
                    beginDate = this.calculateDate(beginDate, 1);
                }
                break;
        }
        return ret;
    },
    getDateDataLength: function(beginDate, endDate, modeName) {
        var bd = this.parseDate(beginDate);
        var ed = this.parseDate(endDate);
        if (modeName == "month")
            return Math.abs(12 * (ed[0] - bd[0]) + ed[1] - bd[1]) + 1;
        else {
            var days = Math.abs(this.getDateDistance(beginDate, endDate));
            if (modeName == "day")
                return days;
            else
                return Math.floor(days / 7);
        }
    },    
    calculateDate: function(givenDate, days) {
        var gd = this.newDate(givenDate);
        var oneDay = 1000 * 60 * 60 * 24; //Set 1 day in milliseconds
        //Calculate difference btw the two dates, and convert to days
        var ret = new Date(Math.ceil(gd.getTime() + (days + 1) * oneDay));
        ret = ret.FormatDate();
        return ret;
    },
    getDateDistance: function(date1, date2) { // format: 20090909-0909
        date1 = this.newDate(date1.split("-")[0]);
        date2 = this.newDate(date2.split("-")[0]);
        var oneDay = 1000 * 60 * 60 * 24;
        return Math.ceil((date2.getTime() - date1.getTime()) / oneDay);
    },
    getTimeDistance: function(date1, date2) { //  format: 20090909-0909
        date1 = date1.split("-");
        date2 = date2.split("-");
        var time1 = this.parseTime(date1[1]);
        var time2 = this.parseTime(date2[1]);
        date1 = this.parseDate(date1[0]);
        date2 = this.parseDate(date2[0]);
        t1 = new Date(date1[0], date1[1], date1[2], time1[0], time1[1], 0);
        t2 = new Date(date2[0], date2[1], date2[2], time2[0], time2[1], 0);
        var oneHour = 1000 * 60 * 60;
        return (t2.getTime() - t1.getTime()) / oneHour;
    },
    compareDate: function(date1, date2) {
        date1 = this.newDate(date1).getTime();
        date2 = this.newDate(date2).getTime();
        if (date1 == date2) return "==";
        if (date1 < date2) return "<";
        return ">";
    },
    compareMonth: function(date1, date2) {
        date1 = date1.replace(/\//g, "").substr(0, 6);
        date2 = date2.replace(/\//g, "").substr(0, 6);
        if (date1 < date2) return "<";
        if (date1 > date2) return ">";
        return "==";
    },
    newDate: function(dateStr) {
        if (dateStr instanceof Date) return;
        var ds = this.parseDate(dateStr); //    dateStr.split("/");
        if ($dh.isNil(ds[1])) ds[1] = 2;
        if ($dh.isNil(ds[2])) ds[2] = 2;
        return new Date(parseInt(ds[0]), parseInt(ds[1], 10) - 1, parseInt(ds[2], 10) - 1);
    },
    isDifferDate: function(d1, d2) { // Format : 20090908-1200
        return (d1.split("-")[0] != d2.split("-")[0]) ? 1 : 0;
    }
    /*
     *    getLeftFromDate: function(date, beginDate, modeName, cellWidth) { // Date: yyyy/mm/dd
        var d, minus = 1;
        if (modeName == "month") d = 30;
        if (modeName == "week") d = 7;
        if (modeName == "day") d = 1;
        if (this.compareDate(date, beginDate) == "<") {
            minus = -1;
            var temp = date; date = beginDate; beginDate = temp;
        }

        var len = this.getDateDataLength(beginDate, date, modeName) + 1;
        lastMileStone = this.calculateDate(beginDate, (len - 1) * d);

        var distance = this.getDateDistance(lastMileStone, date);
        var num = isNaN(parseFloat(this.theader.style.left)) ? 0 : parseFloat(this.theader.style.left);
        var bleft = isObj(this.bleft) && this.tbody.offsetWidth == 0 ? (this.bleft + num) : $dh.pos(this.body).left;
        var lastCellLeft;
        var row = (this.tbody.offsetWidth == 0 && isObj(this.theader) ? this.theader.tBodies[0].rows[1] : this.tbody.rows[0]);
        if (row.cells[len - 1])
            lastCellLeft = $dh.pos(row.cells[len - 1]).left;
        else {
            var cb = $dh.bounds(row.cells[0]);
            lastCellLeft = cb.left + cb.width * (len - 1);
        }
        left = (lastCellLeft) + Math.floor(distance * (cellWidth / d)) - bleft;
        return left * minus;
    },
    getDateFromLeft: function(left, beginDate, modeName, cellWidth) {
        if (modeName == "month") d = 30;
        if (modeName == "week") d = 7;
        if (modeName == "day") d = 1;

        var bleft = $dh.pos(this.body).left;
        left += bleft;

        var fDate = -1, fLeft, cb = $dh.bounds(this.tbody.rows[0].cells[0]);
        for (var i = 0; i < this.dateData.length; i++) {
            if (this.tbody.rows[0].cells[i])
                cb = $dh.bounds(this.tbody.rows[0].cells[i]);
            else {
                cb.left = cb.left + cb.width;
            }

            if (cb.left <= left && left < cb.left + cb.width) {
                fDate = this.dateData[i].join("/");
                fLeft = cb.left;
                break;
            }
        }

        if (fDate == -1) {
            fDate = this.calculateDate(this.dateData[this.dateData.length - 1].join("/"), d);
            fLeft = cb.left + cb.width;
        }
        var delta = Math.round((left - fLeft) / (cb.width / d));
        //alert(delta+ " days will be plus to "+ fDate)
        return this.calculateDate(fDate, delta);
    },
     **/
}

// Extend existing default Date object
$dh.extend(Date, DateProcessor);