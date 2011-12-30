/* DIV-type form class - Written using DHTiny Javascript library by DO BA DUC */

/*MIT LICENSE

Copyright (c) 2008 Do Ba Duc  All Rights Reserved

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge, 
publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
to whom the Software is furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in all copies or 
substantial portions of the Software. 

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var TITLEBAR_HEIGHT  = 24;
var BOTTOMBAR_HEIGHT = 15;
var CORNER_WIDTH     = 6;

$dh.newClass("DHForm", [], {
    _elementType : "div",
    
    caption: null,
    status: null,
    themeIndex: null,
    
    body: null,
    titlebar: null,
    bottombar: null,
    init: function (container, props) {
        $dh.set(this,props);
        if (!$dh.isNil(container)) $jump(this,container);
        this.initContent();
        this.redraw();
    },
    
    initContent: function() {
        if ($dh.isNil(this.id)) 
            this.id = this.className + "_" + $listOf[this.className].length;
        $dh.css(this,{display: "none", overflow: "visible"});
        this.drawTitlebar();
        this.drawBottombar();
        this.drawBody();

        this.setTheme(this.themeIndex);
        $dh.css(this,{bounds: [0,0,100,100], display: ""});
        
        this.redraw();
    },
    
    setTitlebarHeight : function(_h) {  this.titlebar.style.height = _h + "px"; this.redraw();}, 
    setBottombarHeight: function (_h) { this.bottombar.style.height = _h + "px"; this.redraw();},
    resizeTo: function(w,h) { $dh.css(this,{size:[w,h]});this.redraw();},
    moveTo: function(l,t) { $dh.css(this,{pos:[l,t]}); this.redraw();},
    setBounds: function(l,t,w,h){ this.resizeTo(w,h); this.moveTo(l,t);/*$dh.css(this,{bounds: [l,t,w,h]});*/},
    setTheme: function(ti) {
        if ($dh.isNil(ti)) return;
        var fixedPath = "url("+$dh.root+"images/DHForm/Theme";
        var part =["title", "bottom"];
        
        this.themeIndex = ti;
        this.body.className = "DHForm_body"+this.themeIndex;
        
        for (var i=0; i<=1; i++) {
            this[part[i]+"bar"].className = "DHForm_"+part[i]+"bar"+this.themeIndex;
            for (var j=1; j<= 3; j++)
                this[part[i]+j].style.backgroundImage = fixedPath + this.themeIndex + "/"+part[i]+j+".gif)";
        }                
    },
    
    drawTitlebar: function() {
        this.titlebar = $dh.New("div", {id: this.id + "_titlebar"});
        this.titlebar.$dh.css({overflow:"hidden",pos:[0,0], width: "100%", height: TITLEBAR_HEIGHT + "px"});
        
        this.title1 = $dh.New("div", {id: this.id + "_title1"}).$dh.css({backgroundRepeat:"no-repeat",backgroundPosition: "top left"});
        this.title1.$dh.css({bounds: [0,0,CORNER_WIDTH, TITLEBAR_HEIGHT]});
        
        this.title3 = $dh.New("div", {id: this.id + "_title3"}).$dh.css({backgroundRepeat:"no-repeat",backgroundPosition: "top right"});
        this.title3.$dh.css({size:[CORNER_WIDTH,TITLEBAR_HEIGHT],position:"absolute", right: "0px"});
            
        this.title2 = $dh.New("div", {id: this.id + "_title2"}).$dh.css( {backgroundPosition: "top left",backgroundRepeat: "repeat-x", 
                bounds: [CORNER_WIDTH,0,90, TITLEBAR_HEIGHT], lineHeight: TITLEBAR_HEIGHT + "px"});
        if (!$dh.isNil(this.captionTxt)) {
            this.title2.innerHTML = this.captionTxt;
        }
                   
        this.titlebar.$dh.addCh([this.title1, this.title3, this.title2]).$jump(this);
    },
    
    drawBottombar : function() {
        this.bottombar = $dh.New("div", {id : this.id + "_bottombar"})
        this.bottombar.$dh.css({overflow:"hidden", width : "100%", height: BOTTOMBAR_HEIGHT + "px", pos:[0,100]});
        
        this.bottom1 = $dh.New("div", {id: this.id + "_bottom1"}).$dh.css({backgroundRepeat:"no-repeat",backgroundPosition: "bottom left"});
        this.bottom1.$dh.css({bounds: [0,0,CORNER_WIDTH, BOTTOMBAR_HEIGHT]});        
        
        this.bottom3 = $dh.New("div", {id: this.id + "_bottom3"}).$dh.css({backgroundRepeat:"no-repeat",backgroundPosition: "bottom right"});
        this.bottom3.$dh.css({size:[CORNER_WIDTH, BOTTOMBAR_HEIGHT], position:"absolute", right: "0px"});
            
        this.bottom2 = $dh.New("div", {id: this.id + "_bottom2"});
        this.bottom2.$dh.css( {backgroundRepeat: "repeat-x", backgroundPosition: "bottom left",
                bounds: [CORNER_WIDTH, 0, 50, BOTTOMBAR_HEIGHT], lineHeight: BOTTOMBAR_HEIGHT + "px"});
        
        if (!$dh.isNil(this.statusTxt)) 
            this.bottom2.innerHTML = this.statusTxt;
        
        this.bottombar.$dh.addCh([this.bottom1, this.bottom3, this.bottom2]).$jump(this);
    },
    
    drawBody: function(obj) {
        this.body = $dh.New("div", {id : this.id + "_body",className: "DHForm_body"+this.themeIndex}).$dh.css({pos:[0,TITLEBAR_HEIGHT],
            overflow:"visible", borderBottomStyle: "none", borderTopStyle: "none"}).$jump(this);
        this.body.parent = this;
    },
    
    redraw: function() {
        var size = $dh.size(this);
        
        var title2NewW= size.width - 2* CORNER_WIDTH;
        var title3NewL= size.width - CORNER_WIDTH;
        var bottomNewT = size.height - BOTTOMBAR_HEIGHT;
        var bodyNewH = size.height - BOTTOMBAR_HEIGHT - TITLEBAR_HEIGHT;
        
        title2NewW = title2NewW>0? title2NewW:0;
        title3NewL = title3NewL>0? title3NewL:0;
        bottomNewT = bottomNewT>0? bottomNewT:0;
        bodyNewH =   bodyNewH>0? bodyNewH:0;
                        
        this.title2.style.width = title2NewW + "px";
        
        this.bottom2.style.width = title2NewW + "px";
        this.bottombar.style.top = bottomNewT   + "px";          
        
        $dh.css(this.body, {size:[size.width-2, bodyNewH]});
   }
});