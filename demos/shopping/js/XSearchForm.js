$dh.newClass("XSearchForm", DHAnimItem, {
	init: function() {
        DHAnimItem.prototype.init.apply(this,[document.body,{}]);
		this.canvas.innerHTML ='<DIV class="HWsliderWin" id="menu1_0" style="LEFT: 0px; OVERFLOW: hidden; WIDTH: 460px; HEIGHT: 200px;POSITION: absolute; TOP: 0px"><DIV id="canvas1" style="LEFT: 5px; OVERFLOW: hidden; WIDTH: 450px; HEIGHT: 200px;POSITION: absolute; TOP: 10px;"><TABLE class="searchForm" id="SearchForm" style="Z-INDEX: 1; LEFT: 0px; WIDTH: 100%; POSITION: absolute; TOP: 0px" Name="table"><TBODY><TR><TD class="searchForm_header" colSpan="2">検索条件指定</TD></TR><TR><TD class="searchForm_section" colSpan="2"></TD></TR><TR><TD class="searchForm_normal" id="sf_title_0">展示会名</TD><TD class="searchForm_rightCell" style="WIDTH: 335px"><INPUT id="sf_0" style="WIDTH: 280px" value="" /></TD></TR><TR><TD class="searchForm_normal" id="sf_title_1">ブランド</TD><TD class="searchForm_rightCell" style="WIDTH: 335px"><SELECT id="sf_2" style="WIDTH: 280px"> <OPTION>－－－選んでください－－－</OPTION><OPTION>TOMMY</OPTION><OPTION>GAP</OPTION></SELECT></TD></TR><TR><TD class="searchForm_normal" id="sf_title_2">ジャンル</TD><TD class="searchForm_rightCell" style="WIDTH: 335px"><SELECT id="sf_2" style="WIDTH: 280px"> <OPTION>－－－選んでください－－－</OPTION> <OPTION">シャツ</OPTION> <OPTION">ジーンズ</OPTION> <OPTION value="3*飲料・嗜好品">飲料・嗜好品</OPTION> <OPTION value="4*薬品・医療用品">薬品・医療用品</OPTION> <OPTION value="5*化粧品・トイレタリー">化粧品・トイレタリー</OPTION> <OPTION value="6*ファッション・アクセサリー">ファッション・アクセサリー</OPTION> <OPTION value="7*精密機器・事務用品">精密機器・事務用品</OPTION> <OPTION value="8*家電・ＡＶ機器">家電・ＡＶ機器</OPTION> <OPTION value="9*自動車・関連品">自動車・関連品</OPTION> <OPTION value="10*家庭用品">家庭用品</OPTION> <OPTION value="11*趣味・スポーツ用品">趣味・スポーツ用品</OPTION> <OPTION value="12*不動産・住宅設備">不動産・住宅設備</OPTION> <OPTION value="13*出版">出版</OPTION> <OPTION value="14*情報・通信">情報・通信</OPTION> <OPTION value="15*流通・小売業">流通・小売業</OPTION> <OPTION value="16*金融・保険">金融・保険</OPTION> <OPTION value="17*交通・レジャー">交通・レジャー</OPTION></SELECT></TD></TR><TR><TD class="searchForm_normal" id="sf_title_3">登録日</TD><TD class="searchForm_rightCell" id="sf_3" style="WIDTH: 335px"><INPUT id="sf_rd_1" style="PADDING-RIGHT: 5px; PADDING-LEFT: 5px; PADDING-BOTTOM: 5px; PADDING-TOP: 5px" type="radio" CHECKED name="sf_chkb1" value="on" /><SELECT id="sfc_1" style="WIDTH: 55px"> <OPTION>----</OPTION> <OPTION value="1998">1998</OPTION> <OPTION value="1999">1999</OPTION> <OPTION value="2000">2000</OPTION> <OPTION value="2001">2001</OPTION> <OPTION value="2002">2002</OPTION> <OPTION value="2003">2003</OPTION> <OPTION value="2004">2004</OPTION> <OPTION value="2005">2005</OPTION> <OPTION value="2006">2006</OPTION> <OPTION value="2007">2007</OPTION> <OPTION value="2008">2008</OPTION> <OPTION value="2009">2009</OPTION> <OPTION value="2010">2010</OPTION> <OPTION value="2011">2011</OPTION> <OPTION value="2012">2012</OPTION> <OPTION value="2013">2013</OPTION> <OPTION value="2014">2014</OPTION> <OPTION value="2015">2015</OPTION> <OPTION value="2016">2016</OPTION> <OPTION value="2017">2017</OPTION> <OPTION value="2018">2018</OPTION></SELECT>&nbsp;年&nbsp;<SELECT id="sfc_2" style="WIDTH: 70px"> <OPTION>------</OPTION> <OPTION>1</OPTION><OPTION>2</OPTION><OPTION>3</OPTION><OPTION>4</OPTION><OPTION>5</OPTION><OPTION>6</OPTION><OPTION>7</OPTION><OPTION>8</OPTION><OPTION>9</OPTION><OPTION>10</OPTION><OPTION>10</OPTION><OPTION>11</OPTION><OPTION>12</OPTION></SELECT>&nbsp;月<BR /></TD></TR><TR><TD class="searchForm_bottun" style="HEIGHT: 30px; TEXT-ALIGN: left" colSpan="2">&nbsp; &nbsp;<BUTTON id="sf_search" style="LEFT: 2px; WIDTH: 84px; POSITION: relative; TOP: 0px" align="left">検索</BUTTON><BUTTON id="sf_reset" style="LEFT: 260px; WIDTH: 84px; POSITION: relative; TOP: 0px" align="right">リセット</BUTTON> </TD></TR><TR><TD style="HEIGHT: 22px" colSpan="2">&nbsp;</TD></TR></TBODY></TABLE></DIV></DIV>',
		this.show(false);        
		
		this.searchBut = document.getElementById("sf_search");
		this.resetBut = document.getElementById("sf_reset");
		this.setActions();
		
		this.setProps({left: -480, top: 120, width: 465, height: 210, style:"position:absolute;z-index: 999;overflow:hidden;"});
	},

	show: function(flag, time, callback) {
		if (time) {
			this.aniCallback= callback || function() {};
			if (flag == false)	
				this.onAnimStop = function() {
					this.show(false);
					this.aniCallback();
				}
			else {
				this.show(true);
				this.onAnimStop = this.aniCallback;
			}
			
			if (flag== false)
				this.draw({left:-480}, time);
			else {
				this.draw({left:10}, time);
            }
		}
		else {
			this.isVisible = flag;
			this.canvas.style.visibility = (flag==false)?"hidden":"visible";
			showXMask(flag,this.canvas);
		}
	},
	
	setActions: function() {
		var self = this;
		$dh.addEv(this.searchBut, "click", function() {
			if (self.onSubmit) self.onSubmit(); 
		});
		$dh.addEv(this.resetBut, "click", function() {
			self.reset();
		});
	},
	reset: function() {
		var txts = document.getElementsByTagName("input");
		for (var i =0; i < txts.length ; i++)   txts[i].value = "";
		var sels = document.getElementsByTagName("select");
		for (var i =0; i < sels.length ; i++)   sels[i].selectedIndex = 0;
	}
});