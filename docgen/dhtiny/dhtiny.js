/**
* Title: DHTiny core module
* 
* *Author*:   Do Ba Duc
* 
* *Current version*: 1.1.0
* 
* *Last modified*: March 11th, 2011
* 
* Group: Introduction
* 
* DHTiny core contains following main functions:
*  - cross browser DOM processing
*  - convenient OOP support
*  - on-fly modules loader
*  - AJAX request handler
* 
* Class: $dhtiny
* 
* Namespace calling:
*  By including dhtiny.js to your HTML document, you can call DHTiny under 2 names: *$dhtiny* or just *$dh*.
*  It must be cool and short to use just *$* as a namespace entry point, but I think we'd better not to use it
*  to prevent unwanted confliction with other library (Such as Prorotype.js or jQuery)
*    
*/
$dhtiny = {
	/**
	 * Section: Basic methods and properties within $dhtiny namespace
	 * 
	 */
			    
	/**
	* Group: Namespace properties 
	*    
	* String: version
	* Library version information
	* 
	*/
	version: "1.1.0",
	    
	/**
	 * Object: shortcuts
	 *  
	 *  A set of frequently used functions with a very short and easy to remember names.
	 *  In general, they can be called through <set> function. 
	 *  Developers can also define shortcuts by themself using <addShortcut> function.
	 *  
	 *  Some simple default shortcuts:
	 *    pos - Set element's position. Corresponding value of this shortcut is specified by a 2-elements array *[left, top]*. See <pos> function for more details.
	 *    size - Set element's size. Value is a 2-elements array *[width, height]*. See <size> function for more details.
	 *    bounds - Set element's boundaries. Value is a 4-elements array *[left, top, width, height]*. See <bounds> function for more details.
	 *    opac - Set element's opacity. See <opac> function for more details.
	 *    on[event_name] - Set event handler. Value is a function reference.
	 *  
	 *  See also:
	 *  <set>, <addShortcut>
	 *  
	 *  Example: See examples for <set>, <New> functions   
	 *  
	 */
    shortcuts: {
    		shortcutName1: method1,
    		shortcutName2: method2,
    		...
    },
    /**
	 * Array: loaders
	 * A list of functions will be called after document loaded. Developers can add more functions freely using <addLoader> function.
	 *  
	 */
    loaders: [function1, function2, ....],
       
	/**
	 * Function: root
	 *  Detect root path of DHTiny library  
	 * 
	 * Returns:
	 *  Absolute base URL that *dhtiny.js* has been found
	 *  
	 */
    root,
    
    /**
     * Group: Value testing functions 
     * 
     * Function: isNil
     *  Check if given object/value is null/undefined or not  
     * 
     * Parameters:
     *   obj - The value to check
     *   
     * Returns: true if given parameter is null or undefined, and false if not.    
     *  
     */    
    isNil: function(obj) {},

    /**
     * 
     * Function: isArr
     *  Check if given object/value is an array or not  
     * 
     * Parameters:
     *   a - The object/value to check
     *   
     * Returns: true if given parameter is an array, and false if not.
     *  
     */        
    isArr: function(a) {},
    
    /**
     * Function: isFunc
     *  Check if given object/value is a function or not  
     * 
     * Parameters:
     *   ff - The object/value to check
     *   
     * Returns: true if given parameter is a function, and false if not.
     *  
     */
    isFunc: function(ff) {},
    
    /**
     * Function: isStr
     *  Check if given object/value is a string or not  
     * 
     * Parameters:
     *   ss - The object/value to check
     *   
     * Returns: true if given parameter is a string, and false if not.
     *  
     */
    isStr: function(ss) {},
    
    /**
     * Function: isNum
     *  Check if given object/value is a number or not  
     * 
     * Parameters:
     *   nn - The object/value to check
     *   
     * Returns: true if given parameter is a number, and false if not.
     *  
     */
    isNum: function(nn) {},

    /**
     * Function: isObj
     *  Check if given value is an object or not  
     * 
     * Parameters:
     *   v - The value to check
     *   
     * Returns: true if given parameter is an object, and false if not.
     *  
     */    
    isObj: function(v) {},

    
	/**
	 * Group: Some core functions
	 * 
	 * Function: set
	 *  Set multiple properties of an ojbect by a single function call  
	 * 
	 * Parameters:
	 * 	obj - Object whose propeties will be set
	 *  props - A set of property : value
	 *  deepFlag - When deepFlag is set to *true*, array/object properties will be set recursively. By defaut just one level of property will be set.
	 *
	 * Returns:
	 *  obj after setting given properties
	 * 
	 * Example 1:
	 *   Setting normal object properties
	 * 	(start code)
	 *  	person = {name: "Johnny Doe"};
	 *  	person = $dh.set(person, {age: "26", height:"1.75m", mail:"mail@test.com"});
	 *  	var str= "";
	 *  	for (var p in person) str += p+": "+ person[p]+ "\n";
	 *  	alert("Person properties: \n"+ str);
	 *  (end)
	 * 
	 * Example 2:
	 * 	Setting properties through DHTiny's <shortcuts>
	 *  (start code)
	 *   <html>
     *   <body>
     *     <div id="test"></div>
     *     <script type="text/javascript" src="dhtiny.js"></script>
     *     <script type="text/javascript">   
     *   	$dh.addLoader(function() {
     *    		var obj = $dh.el("test");
     *    		$dh.set(obj, {
     *    			style: "position:absolute; border: solid 1px red;",
     *    			bg: "yellow",
     *    			pos: [100,100],
     *    			size: [150,200],
     *    			html: "Hello world!!"    			
     *    		});
     *   	});
     *   </body>
     *   </html>
	 *  (end)
	 */
    set: function(obj, props, deepFlag) {},
    
    
    /**
     * Function: New
     *  Create a DOM element/class instance  
     * 
     * Parameters:
     *   _what - Specify creation target.
     *           If _what is tag name (string), a DOM element will be created.
     *           If _what is an existing class, a class instance will be created  
     *   _props - Properties for the new object. You can wrap all available HTMLElement properties and DHTiny's <shortcuts> inside this.
     *   _deep -  if deepFlag is true, properties will be set recursively.
     *   
     * Returns: true if given parameter is an object, and false if not.
     * 
     * Example:
     * 
     * (start code)
     *   <html>
     *   <body>
     *   <script type="text/javascript" src="dhtiny.js"></script>
     *   <script type="text/javascript">   
     *   	$dh.addLoader(function() {
     *   		// Create a div and add it to document body
     *   		$dh.New("div", { 
     *   			 // DOM element properties
     *   			id : "MyDiv",
     *   			parentNode: document.body,
     *   			title: "Test element",
     *   
     *   			// DHTiny shortcuts 
     *   			css: "position:absolute;width:100px;height:100px;background:red;color:yellow;",
     *   			pos: [150, 120],
     *   			size: [100, 100],
     *				
     *				// Supported events
     *   			onclick: function() {
     *   				alert("You've clicked on "+ this.id);
     *   			},
     *				onmouseover: function() {
     *					this.style.background = "blue";
     *					this.innerHTML ="Hello, buddy!";
     *				}
     *   		});
     *   	});
     *   </script>
     *   </body>
     *   </html>
     * (end)
     * 
     */
    New: function(_what, _props, _deep) {},

    /**
     * Function: addShortcut
     *  Create new DHTiny shortcut function, so as it will be called automatically through <set> function.  
     * 
     * Parameters:
     *   name - Shortcut name
     *   method -  Target method
     *   
     * See also:
     * <shortcuts> , <set>
     * 
     * Example:
     *   <html>
     *   <body>
     *   <script type="text/javascript" src="dhtiny.js"></script>
     *   <script type="text/javascript">      	
     *   	$dh.addShortcut("wrap", function(obj, boxWidth) {
     *   		obj.style.border = "";
     *   	});
     *   	$dh.addLoader(function(){
     *   		
     *   	});
     *   </script>
     *   </body>
     *   </html>
     */
    addShortcut: function(name, method) {}, // Add new function to DHTShorcut list
        
    /**
     * Function: addLoader
     * Add a new function that will be called as soon as document body is loaded.
     * The function will be stored in <loaders> array.
     * 
     * Example:
	 *   (start code)
     *   <html>
     *   <body>
     *   <script type="text/javascript" src="dhtiny.js"></script>
     *   <script type="text/javascript">   
     *   	$dh.addLoader(function() {
     *   		alert("Yay, document is now loaded!!");
     *   	});
     *   	$dh.addLoader(function() {
     *   		alert("This is a function added later");
     *   	});
     *   </script>
     *   <body>
     *   </html>
     *   (end)
     */
    addLoader: function(func) {}
    
    /**
     * 
     * Function: namesp
     * Create/set a namespace with given structure to a target value. This function is generally used for specify nested class packages.
     * 
     * Parameters:
     *   namespace - namespace/path declaration string. Sub namespaces are separated by "." (Eg: "core.util.module1")
     *   target - the value will be set to given path. 
     * 
     * Example:
     * 	 (start code)
     *      $dh.namesp("core.util.version", "1.1");
     *      $dh.namesp("core.util.greeting", function() {
     *      	alert("Hello world!");
     *      })
     *      
     *      alert(core.util.version);  // => 1.1
     *      core.util.greeting();      // => Hello world! 
     *   (end)
     */
    namesp: function(namespace, target) { },
    
    /**
     * Function: preventLeak
     *   Delete specific property of an object to prevent memory leak
     * 
     * Parametes:
     *   obj - The object of which the value belongs to
     *   prop - The property name
     */
    preventLeak: function(obj, prop) {},
    
    /**
     * Function: delegate
     *   Create a delegate of specific method
     *   
     * Parameters:
     *   _scope - Where the function is located. In general, _scope is an object/class instance
     *   _method - Method name 
     */
    delegate: function(_scope, _method) { },
    
    /**
     * Function: setTime
     *    Do the same thing as setTimeout / setInterval
     *    
     * Parameters:
     *  owner - Scope of the function (Eg: An object)
     *  funcName - Method name
     *  args - Arguments which will be passed to function call
     *  length - Timeout/interval value
     *  type - Default: null. If type ="loop", this function works like setInterval()
     */
    setTime: function(owner, funcName, args, delay, type) { // Type = loop : setInterval, else: setTimeout       
    },
    
    
    /**
     * 
     * Funcion: Require
     * 	Including external files (JS or CSS) at runtime
     * 
     * Parameters:
     *   file - Path to one file or array of filepaths
     *   type - Type of loading file (s). Default is "js".
     *          In case of loading DHTiny's module, you can use relative path instead of absolute path.  
     *   
     * Example:
     *   
     */
    Require: function(file, type) { // Import js, css       
    },
    
    /**
     * 
     * Funcion: isLoaded
     * 	Get/set including status of an external module
     * 
     * Parameters:
     *   filePath - Path to the module
     *   flag - If flag = true,
     *   
     * Return: True if the module has been loaded
     */
    isLoaded: function(filePath, flag) {},
    
    
    /**
     * 
     * Funcion: Eval
     * 	Evaluate an expression which is a javascript string or a JS/CSS filename
     * 
     * Parameters:
     *  data - JS expression or a file name
     *  type - "js" or "css"
     *  isFilePath - If this is *true*, given *data* will be treated as a file name
     */
    Eval: function(data, type, isFilePath) {},
    
    //===============================================================
    //===== CLASS MANAGEMENT SECTION ================================
    //===============================================================
    /**
     * Group: Object oriented section 
     * 
     * Array: instOf
     *   Contains all instance references of classes which created by <newClass> function.
     * 
     * Example:
     * (start code)
     * $dh.newClass("TestClass", {
     * 	 init: function() {
     * 		instanceIndex = $dh.instOf["TestClass"].length || 0;
     *      alert("Creating instance "+ instanceIndex );
     *      this.name = "Instance"+instanceIndex ;
     *   }
     * });
     * 
     * ist1= new TestClass();
     * ist2= new TestClass();
     * ist3= new TestClass();
     * 
     * alert("Intance 1 of TestClass's name is: "+ $dh.instOf["TestClass"][1].name);
     * 
     * (end)
     */
    instOf: {[]}, // Global variable to count number of instance of an object
    
    
    // Each class has following basic properties:
    //  1. _class: Class name (String)
    //  2. _super: Super class reference (Function / undefined)
    //  3. _inherited: Array of interface reference that this class is implementing
    /**
     * Function: newClass
     *   Create a new DHTiny-style class. This function support most of frequently used functionalities (inherit, override,... )of Object Oriented Programming.
     * 
     * Parameters:
     *   _className - A string specifies the class name
     *   _super - (Optional) super class
     *   _interface - (Optional) interface/object of which properties will be set for new class
     *   ...  - Unlimited parameters
     * 
     *  Notice:
     *  DHTiny-style classes have following common properties/methods
     *  
     *  - *init* method : class constructor
     *  - _class : class name
     *  - _super: reference of super class
     *  - _inherited: Array of object/class reference that this class has inherited properties from
     * 
     * Example:
	 *  (start code)
	 *   $dh.newClass("Test1", {
	 *   	init: function(name) {
	 *   		this.name= name;
	 *   	},
	 *   	hello: function() {
	 *   		alert("Hello! My name is " + this.name);
	 *   	}
	 *   });
	 *   $dh.newClass("Inter1", {
	 *   	inter1: function() {
	 *   		alert("Class " + this._class + " implementing interface Inter1 ");
	 *   	}
	 *   });
	 *   Inter2 = {
	 *   	inter2: function() {
	 *   		alert("Class " + this._class + " implementing interface Inter2 ");
	 *   	}
	 *   }
	 *
	 *
	 *  $dh.newClass("Test2","Test1", "Inter1", Inter2, {
	 *	  hello: function() {
	 *		alert( "Hello! My BIG name is: " + this.name.toUpperCase() +"\n"+
	 *			   ". My className is " + this._class +"\n"+
	 *			   ". My superclass is " + this._super.prototype._class);
	 *		
	 *		alert("Class Test2 is implementing " + this._inherited.length + " interfaces.");
	 *	  }
	 *  });
	 *  
	 *  var t1 = new Test1("Class number 1");
	 *  t1.hello();
	 *  var t2 = new Test2("Class number 2");
	 *  t2.hello();
	 *  t2.inter1();
	 *  t2.inter2();
	 *  
	 *  (end)
     */
    newClass: function(_className, _super, _interface1, _proplist2, ...) {},    
    
    /**
     * Function: extend
     *    Extend an object / class 
     * 
     * Paramaters:
     *    _obj - The object will be extended. 
     *    _props - The properties will be set to _obj. If _props is a class/function, its prototype will be apply to _obj.
     *           (Be careful of this. If you just want to set properties for _obj, use <set> function instead)
     * 
     * Returns:
     *    Extended object
     *    
     */
    extend: function(_obj, _props) {},
   
    /**
     * Function: construct
     *    Take an object and set all necessary conditions to make it an instance of specified class 
     * 
     * Parameters:
     *    _obj - The object will be constructed. 
     *    _class - The class of which _obj will become an instance
     *    _args - Argument array that you want to pass to _class's contructor
     * 
     * Returns:
     *    Built object
     *    
     */
    construct: function(_obj, _class, _args) {},

    //===================================================================
    //===== AJAX SECTION ================================================
    //===================================================================
    // $dh.ajax is a stand-alone XmlHttpRequest management object.
    // This is written in order to make many XmlHttpRequests run concurrently.
    /**
     * Group: AJAX related functions
     * 
     * Property: ajax
     *   Containing very simple AJAX functions.
     *   It temprarily supports concurrent multiple GET and POST requests. 
     * 
     */
    ajax: {
    	
        XHRs: [],
        newXHR: function() {
            return {isFree: true, xmlhttp: this.newXmlHttpObj()};
        },
        newXmlHttpObj: function() {
            if (window.XMLHttpRequest) return new XMLHttpRequest();
            else if (window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
            else {alert("Error: Your browser does not support ActiveXObject!");return null;}
        },
        getFreeXHR: function() {
            for (var i = 0; i < this.XHRs.length; i++)
                if (this.XHRs[i].isFree == true)
                return i;
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
                if (!methodtype || methodtype == 'GET')
                    xhr.xmlhttp.open('GET', url + (url.indexOf("?") < 0 ? '?' : '&'), callBack ? true : false);
                else {
                    xhr.xmlhttp.open('POST', url, callBack ? true : false);
                    xhr.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                }
                xhr.isFree = false;  // Mark that this is in use
                xhr.xmlhttp.onreadystatechange = function() {
                    $dh.ajax.onXmlHttpChange(pos);
                }
            }
            if (!methodtype || methodtype == 'GET')
                xhr.xmlhttp.send(null);
            else
                xhr.xmlhttp.send(postdata + (postdata.length > 0 ? "&" : ""));

            return pos; // IMPORTANT!!!: Return the index of request inside XHR array 
        },

        onXmlHttpChange: function(pos) {
            var xhr = this.XHRs[pos];
            if (!$dh.isNil(xhr) && !xhr.isFree && (xhr.xmlhttp.readyState == 4)) {
                if (xhr.xmlhttp.status == 200 || xhr.xmlhttp.status == 304) {
                    if (xhr.callBack) xhr.callBack(xhr.xmlhttp.responseText, xhr); // How about XML???
                }
                else {
                    if (xhr.callBack) xhr.callBack("ERROR: " + xhr.xmlhttp.responseText, xhr);
                }
                xhr.isFree = true;
            }
        },
        /**
         * Function: ajax.GET
         *    Send a GET request
         * 
         * Parameters:
         *    url - Request URL
         *    callback - XMLHttpRequest's callback function.
         *               If callback is not specified, this function will return the response content.
         * 
         * Examples:
         * 	(start code)
         *		var txt = $dh.ajax.GET($dh.root + "dhtiny.js");
         *		alert("Without callback: " + txt);
         *
         *		var txt2 = $dh.ajax.GET($dh.root+ function(res) {
         *   		alert("(Callback)\n Response text: " + res);
         *   	});
         *   	
         *  (end)
         *  
         */
        GET: function(url, callback) {  
        },
        
        /**
         * Function: ajax.POST
         *    Send a POST request
         * 
         * Parameters:
         *    url - Request URL
         *    postdata - Data will be posted
         *    callback - XMLHttpRequest's callback function.
         *               If callback is not specified, this function will return the response content.
         * 
         */
        POST: function(url, postdata, callback) {            
        }
    }, 

    //=========================================================
    //===== DOM METHODS =======================================    
    //=========================================================
    // Simple browser detector - Save browser info in global vairable "$dh.browser"
    // Refered source code by Peter-Paul Koc, link: http://www.quirksmode.org/js/detect.html
    
    /**
     * Property: browser
     *   Current browser information.
     *
     * Subproperties:
     *   browser.version - current version
     *   browser.name - Browser name. Possible values are: "ie", "chrome", "firefox", "konqueror", "opera", "safari".
     *                  You can also check browser name using: $dhtiny.browser.[above_value]
     *   
     * Example:
     *   (start code)
     *   alert("Current browser is " + $dhtiny.browser.name+ ", version " + $dhtiny.browser.version);
     *   alert("You are " + ($dhtiny.browser.firefox ? "" : "not") + " using Firefox");   	
     *   (end)
     */
    browser: {},
    
    /**
     * Group: DOM processing methods
     * 
     * Funcion: msPos
     * 	Get mouse/event position
     * 
     * Parameters:
     *   ev - Event reference
     */
    msPos: function(ev) {},
    
    /**
     * Funcion: msOffset
     * 	Get relative position (offset) between mouse/event position and an object
     * 
     * Parameters:
     *   ev - Event reference
     *   _obj - The HTML element
     * 
     * Return: 
     *   Offset in this format: {left: leftvalue, top: topvalue}
     *   
     */
    msOffset: function(ev, _obj) {},
    
    /**
     * Function: bodySize
     *    Get document body's size
     * 
     * Parameters:
     *    fullsizeFlag - If this parameter is true, scrollbars' position will be calculated
     *     
     * Returns:
     *    Size in this format: {width: widthValue, height: heightValue}
     */
    bodySize: function(fullsizeFlag) {}
    
    /**
     * Function: css
     *   Set style properties for an object
     * 
     * Parameters:
     *   _obj - HTML Element whose style will be set
     *   _props - Style properties. This can be a string or a hash.
     * 
     * Example:
     *   (start code)
     *    div = $dh.el("someElement");
     *    $dhtiny.css(div, { position: "absolute", height:"100px", width: "100px", background: "red"});
     *   (end)
     */
    css: function(_obj, _props) {},
    
    /**
     * Function: getCssProp
     *   Get calculated style of an HTML element
     * 
     * Parameters:
     *   obj - HTML Element
     *   prop - Style property
     * 
     * Returns:
     *   Calculated value of given property
     */
    getCssProp: function(obj, prop) {}
    
    /**
     * Function: addCh
     *   Do almost the same thing as document.appendChild method
     * 
     * Parameters:
     *   pa - Parent HTML Element
     *   ch - Single HTML element or a list of HTML elements which will be appended to parent element
     * 
     * Example:
     *   (start code)
     *   div = $dh.new("div", {html: "Test div", style: "border:solid 1px black;"});
     *   $dh.addCh(document.body, div)
     *   (end)
     * 
     * See also:
     *   <rmCh>
     */
    addCh: function(pa, ch) {},
    
    /**
     * Function: rmCh
     *   Do almost the same thing as document.removeChild method
     * 
     * Parameters:
     *   pa - Parent HTML Element
     *   ch - Single HTML element or a list of HTML elements which will be remove from parent element
     * 
     * 
     */
    rmCh: function(pa, ch) {},
        
    /**
     * Function: el
     *   Get HTML element with given options
     * 
     * Parameters:
     *   prop - The string specified as element id or tagname..
     *   option - (Optional) This can be "name" or "tag"
     * 
     * Returns:
     *   The result of document.getElementById r document.getElementsByTagName, document.getElementsById;
     * 
     */
    el: function(prop, option) {},
    
    /**
     * Function: opac
     *   Set HTML element's opacity
     * 
     * Parameters:
     *   _obj - HTML element
     *   _opac - Opacity (min: 0, max: 100)
     * 
     */    
    opac: function(_obj, _opac) { },

    /**
     * Function: pos
     *   Get/Set HTML element's position
     * 
     * Parameters:
     *   _obj - HTML element
     *   _pos - A [left, top] array.
     *         You can also call this function this way: $dh.pos(obj, left, top)
     *         If _pos has not given, this function will return current position of _obj
     *         
     * NOTES:
     *   The element's position might not change if its style.position="static"
     * 
     */
    pos: function(_obj, _pos) {}
    
    /**
     * Function: size
     *   Get/Set HTML element's size
     * 
     * Parameters:
     *   _obj - HTML element
     *   _size - A [width, height] array. You can also call this function this way: $dh.size(obj, width, height)
     *          If _size has not given, this function will return current size of _obj
     * 
     */    
    function size(_obj, _size) {}
    
    /**
     * Function: bounds
     *   Get/Set HTML element's boundariess
     * 
     * Parameters:
     *   _obj - HTML element
     *   _bounds - A [left, top, width, height] array. You can also call this function this way: $dh.bounds(obj, left, top, width, height)
     *             If _size has not given, this function will return current size of _obj
     */
    function bounds(_obj, _bounds) {}
    
    /**
     * Function: innerTxtfunction
     *   Get/Set HTML element's inner text content
     * 
     * Parameters:
     *   _obj - HTML element
     *   _size - A [width, height] array. You can also call this function this way: $dh.size(obj, width, height)
     *          If _size has not given, this function will return current size of _obj
     * 
     */    
    innerTxt: function( _obj, _txt) {}
        
    /**
     * Function: disableSelect
     *   Disable selection by mouse on given area
     * 
     * Parameters:
     *   target - Within this object, all selection will be canceled
     * 
     * Example:
     *   (start code)
     *    // Disable drag & drop to select text in document body
     *    $dh.disableSelect(document.body);
     *   (end)
     */
    disableSelect: function(target) {},
    
    //==== EVENT =====================
    /**
     * Function: evt
     *  Normalize event object between browsers
     *  
     * Parameters:
     *   evt - Event object to be normalized
     *   
     * Returns:
     *   Normalized event object
     */
    evt: function(evt) {},
    
    /**
     * Function: addEvt
     *  Add an element event handler
     *  
     * Parameters:
     *   _obj - HTML element
     *   _ev  - Event name (onclick, onmouseover, ....)
     *   _handler - Handler reference
     *   
     */
    addEv: function(_obj, _ev, _handler) {},
    
    /**
     * Function: rmEvt
     *  Remove an element event handler
     *  
     * Parameters:
     *   _obj - HTML element
     *   _ev  - Event name (onclick, onmouseover, ....)
     *   _handler - Handler reference
     *   
     */
    rmEv: function(_obj, _ev, _handler) {},

    //=== SOME EXTRA FUNCTIONS =================================
    //==========================================================
    each: function(obj, func) {
        if ($dh.isArr(obj)) {
            for (var i = 0; i < obj.length; i++) {
                if (func.apply(obj, [i, obj[i]]) == false)
                    return false;
            }
            return true;
        }
        else if ($dh.isObj(obj)) {
            for (var p in obj) {
                if (func.apply(obj, [p, obj[p]]) == false)
                    return false;
            }
            return true;
        }
        else return false;
    },   
    hasClass: function(_ele, _cls) { },
    itemIdx: function(_col, _item) { }
        return -1;
    }
};