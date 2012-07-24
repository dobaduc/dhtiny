// Set window as global container
(function(){
var WIN = window,
    DOC = WIN.document;
    DOCE = DOC.documentElement;

DOM = {
    // All in one creator
    New: function(_what, _props, _deep) {
        if (typeof _what == "string") {
            if (!$dh.isFunc($dh.scope[_what])) {
                return $dh.set(DOC.createElement(_what), _props);
            }
            _what = $dh.scope[_what];            
        }
        return $dh.construct({}, _what, _props);
    },
    
    //==== Loaders
    loaders: [],
    addLoader: function(func) {$dh.loaders.push(func);},
    root: (function() { //--- Detect DHTiny path----
        var scripts = DOC.getElementsByTagName("script");
        for (var x = 0; x < scripts.length; x++)
            if (scripts[x].src.toUpperCase().indexOf("DHTINY.JS") >= 0)
            return scripts[x].src.substr(0, scripts[x].src.toUpperCase().indexOf("DHTINY.JS"));
    })(),
    //=========================================================
    // Simple browser detector - Save browser info in global vairable "$dh.browser"
    // Refered source code by Peter-Paul Koc, link: http://www.quirksmode.org/js/detect.html
    browser: {
        name:null, version:null,
        init: function() {
            // Use $dh.browser.name and $dh.browser.name to determine browser information   
            this.name = this.getName(this.bsNameVer) || "UnknownBrowser";
            // Enable checker like this: $dh.browser.ie 
            this[this.name] = true;
            this.version = this.getVer(navigator.userAgent) || this.getVer(navigator.appVersion) || "UnknownVersion";
        },
        mode: (function(){
            var mode= DOC.compatMode;
            if(mode){
                if(mode=='BackCompat') {
                    return 'quirks';
                }
                else if(mode=='CSS1Compat') {
                    return 'Standards Compliance';
                }
                else {
                    return 'Almost Standards Compliance';
                }
            }
        })(),
        getName: function(data) {
            for (var i = 0; i < data.length; i++) {
                this.verDetectStr = data[i].verStr || data[i].bsName;
                if (data[i].prop) {
                    return data[i].bsName;
                }
                else if (data[i].str && (data[i].str.toUpperCase().indexOf(data[i].vdName.toUpperCase()) != -1)) {
                    return data[i].bsName;
                }
            }
        },
        getVer: function(verStr) {
            var index = verStr.toUpperCase().indexOf(this.verDetectStr.toUpperCase());
            if (index == -1) return;
            return parseFloat(verStr.substring(index + this.verDetectStr.length + 1));
        },
        bsNameVer: [
	        {prop: WIN.opera, bsName: "opera"},
		    {str: navigator.userAgent, vdName: "Chrome", bsName: "chrome"},
		    {str: navigator.vendor, vdName: "Apple", bsName: "safari", verStr: "version"},
		    {str: navigator.vendor, vdName: "KDE", bsName: "konqueror"},
		    {str: navigator.userAgent, vdName: "Firefox", bsName: "firefox"},
		    {str: navigator.userAgent, vdName: "MSIE", bsName: "ie", verStr: "MSIE"}
	    ]
    },
    
    //===================================================================
    //===== AJAX SECTION ================================================
    //===================================================================
    // $dh.ajax is a stand-alone XmlHttpRequest management object.
    // This is written in order to make many XmlHttpRequests run concurrently.
    ajax: {
        XHRs: [],
        newXHR: function() {
            return {isFree: true, xmlhttp: this.newXmlHttpObj()};
        },
        newXmlHttpObj: function() {
            if (XMLHttpRequest) {
                return new XMLHttpRequest();
            }
            else if (ActiveXObject) {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
            else {
                throw "Error: Your browser does not support ActiveXObject!";
            }
        },
        getFreeXHR: function() {
            for (var i = 0; i < this.XHRs.length; i++) {
                if (this.XHRs[i].isFree == true) return i;
            }
            var XHR = $dh.ajax.newXHR();
            XHR.requestIndex = this.XHRs.length;
            this.XHRs.push(XHR);
            return this.XHRs.length - 1;
        },
        sendRequest: function(url, methodtype, postdata, callBack) {
            var pos = this.getFreeXHR();
            var xhr = this.XHRs[pos];
            xhr.callBack = callBack;

            if (xhr.xmlhttp) { // Do what old xmlhttp object does
                if (!methodtype || methodtype == 'GET') {
                    xhr.xmlhttp.open('GET', url + (url.indexOf("?") < 0 ? '?' : '&'), callBack ? true : false);
                }
                else {
                    xhr.xmlhttp.open('POST', url, callBack ? true : false);
                    xhr.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                }
                xhr.isFree = false;  // Mark that this is in use
                xhr.xmlhttp.onreadystatechange = function() {
                    $dh.ajax.onXmlHttpChange(pos);
                }
            }
            if (!methodtype || methodtype == 'GET') {
                xhr.xmlhttp.send(null);
            }
            else {
                xhr.xmlhttp.send(postdata);
            }
            return pos; // IMPORTANT!!!: Return the index of request inside XHR array 
        },

        onXmlHttpChange: function(pos) {
            var xhr = this.XHRs[pos];
            if (!$dh.isNil(xhr) && !xhr.isFree && (xhr.xmlhttp.readyState == 4)) {
                xhr.responseHeaders = xhr.xmlhttp.getAllResponseHeaders();
                xhr.status = xhr.xmlhttp.status;
                xhr.statusText = xhr.xmlhttp.statusText;
                if (xhr.xmlhttp.status == 200 || xhr.xmlhttp.status == 304) {
                    if (xhr.callBack) xhr.callBack(xhr.xmlhttp.responseText, xhr); // XML???
                }
                else {
                    if (xhr.callBack) xhr.callBack("ERROR: " + xhr.xmlhttp.responseText, xhr);
                }
                xhr.isFree = true;
            }
        },
        GET: function(url, async_cb) {
            if (async_cb) {
                return $dh.ajax.sendRequest(url, "GET", null, async_cb);}
            else {
                return $dh.ajax.XHRs[$dh.ajax.sendRequest(url, "GET")].xmlhttp.responseText;
            }
        },
        POST: function(url, postdata, async_cb) {
            if (async_cb)
                return $dh.ajax.sendRequest(url, "POST", postdata, async_cb);
            else
                return $dh.ajax.XHRs[$dh.ajax.sendRequest(url, "POST", postdata)].xmlhttp.responseText;
        }
    },    
    
    //==== Import external file (JS, CSS, etc) ============
    isLoaded: function(filePath, flag) {        
        if (!$dh.isStr(filePath)) {
            return false;
        }
        if (!$dh._isLoaded) {
            $dh._isLoaded = {};
        }
        filePath = filePath.toLowerCase();
        if (flag == true) { // Set
            $dh._isLoaded[filePath] = true;
        }
        else { // Get
            return $dh._isLoaded[filePath] || $dh._isLoaded[filePath +".js"] || $dh._isLoaded[filePath.replace(/\.js$/,"")];
        }
    },
    Require: function(file, type) { // Import js, css
        if ($dh.isStr(file)) {
            type = type || "js";
            file = file.toLowerCase();
            if (file.indexOf(",") > 0) { // Multiple file
                var files = file.split(",");
                for (var i= files.length-1; i>0; i--){
                    files[i] = files[0].replace(/\/([^,]*)$/,"/"+ files[i]);
                }
                $dh.Require(files, type);
            }
            else if (!$dh.isLoaded(file)) {
                if ( !file.match( new RegExp("\."+type+"$", "i")) ) { // Check extension
                    file += "."+type;
                }
                if ($dh.Eval(file, type, true)) {
                    $dh.isLoaded(file, true);
                }
            }
        }
        else if ($dh.isArr(file)){
            for (var i=0; i < file.length; i++) {
                $dh.Require(file[i], type);
            }
        }
    },
    Eval: function(data, type, isFilePath) { // Evaluate an expression which is a javascript/css string or a JS/CSS filename
        var head = DOC.getElementsByTagName("head")[0] || DOCE;
        var tag;
        if (type != "css") {
            var tag = DOC.createElement("script");     
            tag.type = "text/javascript";
        }
        else {
            var tag = DOC.createElement("style");
            tag.type = "text/css";
        }
        if (isFilePath) { // Data is a file path            
            isFilePath = data;
            data = $dh.ajax.GET($dh.root + data);           
        }              
        if ( $dh.browser.name=="ie"){
            tag.text = data;
        }
        else {
            tag.appendChild( DOC.createTextNode( data ) );
        };
        
        head.appendChild( tag );
        if (type == "js") {
            head.removeChild( tag );
        }
    },

    //=======================================================================
    //===== DOM METHODS ==============================================
    //=======================================================================
    msPos: function(ev) { // GET mouse/event position
        ev = ev || WIN.event;
        if (ev.pageX || ev.pageY) {
            return {left: ev.pageX, top: ev.pageY};
        }
        else {
            var sx = 0, sy = 0;
            if (DOCE.scrollTop) {
                sx = DOCE.scrollLleft;
                sy = DOCE.scrollTop;
            }
            return {
                left: ev.clientX + DOC.body.scrollLeft + sx - DOC.body.clientLeft,
                top: ev.clientY + DOC.body.scrollTop + sy - DOC.body.clientTop
            };
        }
    },
    msOffset: function(ev, _obj) { // GET mouse's offset position within an object
        ev = ev || WIN.event;
        var objPos = $dh.pos(_obj), msPos = $dh.msPos(ev);
        return {left: msPos.left - objPos.left, top: msPos.top - objPos.top};
    },
    bodySize: function(fullsizeFlag) {   // GET document body's size
        if (fullsizeFlag) {
            var de = DOCE;
            var st = de.scrollTop, sl = de.scrollLeft;
            de.scrollTop = de.scrollLeft = 99999999;
            d = {w: de.scrollLeft, h: de.scrollTop};
            de.scrollTop = st;
            de.scrollLeft = sl;
        }
        else { d = {w: 0, h: 0}; };
        return !$dh.isNil(WIN.innerWidth) ? {width: d.w + WIN.innerWidth, height: d.h + WIN.innerHeight} : 
                    (!$dh.isNil(DOCE) && !$dh.isNil(DOCE.clientWidth) && DOCE.clientWidth != 0 ?
                    {width: d.w + DOCE.clientWidth, height: d.h + DOCE.clientHeight} :
                    {width: d.w + DOC.body.clientWidth, height: d.h + DOC.body.clientHeight}
            )
    },
    //============ 2-way callable functions ====================================
    css: function(_obj, _props) {
        if ($dh.isStr(_props)) {
            $dh.el(_obj).style.cssText += ";" + _props;
        }
        else {
            $dh.set(_obj.style, _props);
        }
    },
    getCssProp: function(obj, prop) {        
        if (obj.currentStyle) return obj.currentStyle[prop]; // IE
        // FF, Opera...
        prop = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
        return WIN.getComputedStyle(obj, null).getPropertyValue(prop);
    },
    
    hasClass: function(el, cls) {
        var classes = el.className;
        return classes && new RegExp("(^|\\s)" + cls + "(\\s|$)").test(classes);
    },
    
    addClass: function(el, cls) {
        if(!this.hasClass(el, cls)) el.className += " " + cls;
    },
        
    rmClass: function(el, cls) {
        if (this.hasClass(el, cls)) el.className=el.className.replace(new RegExp("(^|\\s)"+cls+"(\\s|$)")," ");
    },

    addCh: function(pa, children) { // Append a list of children
        pa = $dh.el(pa);
        if ($dh.isArr(children)) {
            for (var i = 0; i < children.length; i++) pa.appendChild($dh.el(children[i]));
        }
        else {
            pa.appendChild($dh.el(children));
        }
    },
    rmCh: function(pa, children) { // Remove a list of children
        pa = $dh.el(pa);
        if ($dh.isArr(children)) {
            for (var i = 0; i < children.length; i++) pa.removeChild($dh.el(children[i]));
        }
        else {
            pa.removeChild($dh.el(children));
        }
    },
    el: function(prop, option) { // Select elements that match givent options
        if (prop && prop.tagName)
            return prop; // Already got an element object
        if (!option) {
            if ($dh.isStr(prop)) {
                return DOC.getElementById(prop);
            }
            else {
                return null;
            }
        }
        else {
            if (option.toLowerCase() === "tag") {
                return DOC.getElementsByTagName(prop);
            }
            else if (option.toLowerCase() == "name") {
                return DOC.getElementsByName(prop);
            }
        }
    },
    opac: function(_obj, _opac) { // GET/SET opactity        
        if (arguments.length == 2) { // SET _obj's opacity            
            if (_obj.tagName) {
                $dh.set(_obj.style, {opacity: _opac / 100, MozOpacity: _opac / 100, KhtmlOpacity: _opac / 100, filter: "alpha(opacity=" + _opac + ")"});
            }
            else {
                $dh.set(_obj, {opacity: _opac / 100, MozOpacity: _opac / 100, KhtmlOpacity: _opac / 100, filter: "alpha(opacity=" + _opac + ")"});
            }
            return _obj;
        }
        // GET _id's opacity
        var styleObj = _obj.style;
        if (styleObj.opacity) return styleObj.opacity * 100;
        if (styleObj.MozOpacity) return styleObj.MozOpacity * 100;
        if (styleObj.KhtmlOpacity) return styleObj.KhtmlOpacity * 100;
        // IE - Special things lead to stupid things
        if (!$dh.isNil(styleObj.filter) && styleObj.filter != "") {
            var str = styleObj.filter;
            var str2 = str.substr(14);
            return parseInt(str2.substr(0, str2.length - 1));
        }
        else return 100; // Nothing to get
    },

    pos: function(_obj, _pos) { // GET/SET the absolute position of object
        switch (arguments.length) {
            case 1: // GET OBJ's position
                var curleft = 0, curtop = 0;
                if (_obj.offsetParent)
                    while (1) {
                    curleft += _obj.offsetLeft;
                    curtop += _obj.offsetTop;
                    if (!_obj.offsetParent)
                        break;
                    _obj = _obj.offsetParent;
                }
                else {
                    if (_obj.x) curleft += _obj.x;
                    if (_obj.y) curtop += _obj.y;
                }
                return {left: curleft, top: curtop};
                
            case 2: // SET position for OBJ
                if (_obj.tagName) { // Working with OBJ                    
                    _obj.style.left = _pos[0] + "px";_obj.style.top = _pos[1] + "px";
                }
                else { // Working with OBJ's style
                    _obj.left = _pos[0] + "px";_obj.top = _pos[1] + "px";
                };
                return _obj; // For inline call

            default:
                return $dh.pos(_obj,[arguments[1], arguments[2]]);
        }
    },
    size: function(_obj, _size) { // GET/SET object's size
        switch (arguments.length) {
            case 1: // GET OBJ's size
                return {width: !$dh.isNil(_obj.offsetWidth) ? _obj.offsetWidth : (!$dh.isNil(_obj.clientWidth) ? _obj.clientWidth : parseInt(_obj.style.width, 10)),
                    height: !$dh.isNil(_obj.offsetHeight) ? _obj.offsetHeight : (!$dh.isNil(_obj.clientHeight) ? _obj.clientHeight : parseInt(_obj.style.height, 10))
                }

            case 2: // SET size for OBJ
                if (_obj.tagName) { // Working with OBJ
                    _obj.style.width = _size[0] + "px";_obj.style.height = _size[1] + "px"
                }
                else { // Working with OBJ's style
                    _obj.width = _size[0] + "px";_obj.height = _size[1] + "px"
                }
                return _obj; // For inline call
                
            default:// SET size for OBJ with parameters in a row
                return $dh.size(_obj, [arguments[1], arguments[2]]);
        }
    },

    bounds: function(_obj, _bounds) {  // GET/SET object's boundraries
        switch (arguments.length) {
            case 1: // GET OBJ's bounds
                if ($dh.isNil(_obj)) return {left: -1, top: -1, width: -1, height: -1};
                var os = $dh.size(_obj), ap = $dh.pos(_obj);
                return {left: ap.left, top: ap.top, width: os.width, height: os.height};
            case 2: // SET bounds for OBJ with parameters given in an array
                $dh.pos(_obj, [_bounds[0], _bounds[1], _bounds[4]]); // left, top, style.position value
                $dh.size(_obj, [_bounds[2], _bounds[3]]); // width, height
                return _obj;            
            default: // SET bounds for OBJ with parameters in a row
                return $dh.bounds(_obj, [arguments[1], arguments[2], arguments[3], arguments[4]]);
        }
    },
    innerTxt: function(_obj, _txt) { // GET/SET inner text
        if (arguments.length == 2) { // SET inner text for OBJ
            if ($dh.isNil(_txt)) _txt = "";
            if (_obj.innerText) _obj.innerText = _txt;
            else if (_obj.textContent) _obj.textContent = _txt;
            else if (_obj.text) _obj.text = _txt;
            return _obj; // For inline call
        }
        if (!$dh.isNil(_obj.innerText)) return _obj.innerText;
        else if (!$dh.isNil(_obj.textContent)) return _obj.textContent;
        else if (_obj.nodeValue) return _obj.nodeValue;
        else if (!$dh.isNil(_obj.text)) return _obj.text;
        else return undefined;
    },
    
    // Disable selection on given area
    disableSelect: function(target) {                
        if (typeof target.onselectstart!="undefined") {//IE route
            target.onselectstart=function() {return false;};
        }
        else if (typeof target.style.MozUserSelect!="undefined") {//Firefox route
            target.style.MozUserSelect="none";
        }
        else {//All other route (ie: Opera)
            target.onmousedown=function() {return false;}
        }
    },
    
    //==== EVENT =====================
    evt: function(evt) {
        if (!evt.stopPropagation) {
            evt.stopPropagation = function() {this.cancelBubble = true;};
            evt.preventDefault = function() {this.returnValue = false;};
        }
        // Stop event bubbling
        evt.stop = evt.stop || function() {this.stopPropagation();this.preventDefault();};
        // Get key code
        if (evt.type == "keypress") {
            if (evt.charCode === 0 || evt.charCode == undefined) {
                evt.code = event.keyCode;
            }
            else {
                evt.code = event.charCode;
            }
        }
        // Mouse position
        evt.pos = $dh.msPos(evt);
        // Event target
        if (!evt.target) evt.target = evt.srcElement;
        return evt;
    },
    addEv: function(_obj, _ev, _handler) {  // Traditional attach event method
        if (_ev.substr(0, 2) == "on") _ev = _ev.substr(2);
        if (_obj.addEventListener) {
            _obj.addEventListener(_ev, _handler, false);
        }
        else {
            _obj.attachEvent('on' + _ev, _handler);
        }
    },
    rmEv: function(_obj, _ev, _handler) {  // Traditional remove event method
        if (_ev.substr(0, 2) == "on") _ev = _ev.substr(2);
        if (_obj.detachEvent) {
            _obj.detachEvent('on' + _ev, _handler);
        }
        else {
            _obj.removeEventListener(_ev, _handler, false);
        }
    },    
    preventLeak: function(obj, prop) {
        $dh.addEv(WIN, "unload", function() {
            if (obj && obj[prop]) obj[prop] = null;
        });
    }
};
// End of DOM

// Extend DHTiny
$dh.init(WIN);
$dh.extend($dh, DOM);
// Mark this file as loaded
$dh.isLoaded("dhtiny-dom", true);

// "SHORTCUT" interfaces. Easy to remember, easy to use, easy to extend later ---
$dh.set($dh.shortcuts, {
    pos: $dh.pos, size: $dh.size, bounds: $dh.bounds, opac: $dh.opac, txt: $dh.innerTxt,
    bg: function(_obj, _info) {
        if (_obj.tagName) {
            _obj.style.background = _info;
        }
        else {
            _obj.background = _info;
        }
    },
    color: function(_obj, _c) {
        if (_obj.tagName) {
            _obj.style.color = _c;
        }
        else {
            _obj.color = _c;
        }
    },
    html: function(_obj, _HTML)  {_obj.innerHTML = _HTML;},
    style: function(_obj, _info) {$dh.css(_obj, _info);},
    parentNode: function(_obj, _pa) {$dh.el(_pa).appendChild(_obj);}
});

// Add event shortcuts
(function() {
    var evs = "click,dbclick,blur,focus,mousedown,mouseup,mouseover,mouseout,mousemove,keydown,keypress,keyup,scroll,change,select,resize,error,submit,load,unload".split(",");
    for(var i=0; i < evs.length;i++) {
        var temp = "function(obj, func) {obj.on___ = func;$dh.preventLeak(obj, 'on___')}";
        eval("temp = "+ temp.replace(/___/g,evs[i]));
        $dh.addShortcut(evs[i], temp);
    }
})();

//---------- Create an "Access point" to global script  ------//
$dh.addEv(WIN,"load", function() {
    // Call loaders
    if ($dh.loaders) {
        for (var x=0; x < $dh.loaders.length; x++) {
            if ($dh.isFunc($dh.loaders[x])) {
                $dh.loaders[x]();
            }
            else if ($dh.isStr($dh.loaders[x])) {// Evaluate string
                eval($dh.loaders[x]);
            }
        }
    }
});
// Get browser information
$dh.browser.init();

})();