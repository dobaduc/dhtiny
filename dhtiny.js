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

// Basically prepare DHTiny's namespace. Full name: $dhtiny, short name: $dh 
if (typeof $dhtiny == "undefined") {
$dhtiny = $dh = {    
    // Library information
    version: "1.1.5",
    // Library container (scope) - Useful to use DHTiny inside child IFRAME
    scope: {},
    // Shortcut methods
    shortcuts: {},
    // Initialize DHTiny with a scope
    init: function(scope) { $dh.scope = scope || {}; },
    // Extend an object's property set
    set: function(obj, props, deepFlag) {
        if ($dh.isNil(props)) return obj;
        if (typeof props != "object") { // Single property
            obj = props;
        }
        else {
            if (!obj) obj = (props instanceof Array) ? [] : {};
            for (var p in props) {
                if (props[p] == obj || props[p] == undefined) continue;
                if ($dh.shortcuts[p]) { // Shorcuts always have highest priority                    
                    $dh.shortcuts[p](obj, props[p]);
                }
                else {
                    obj[p] = (deepFlag == true) ? $dh.set(obj[p], props[p]) : props[p];
                }
            }
        }
        // Return the extended object
        return obj;
    },
    // Basic validators
    isNil: function(_obj) {return (_obj == null || _obj == undefined);},
    isArr: function(a) {return !$dh.isNil(a) && (a instanceof Array);},
    isFunc: function(func) {return !$dh.isNil(func) && (func instanceof Function || typeof func == "function");},
    isStr: function(_obj) {return !$dh.isNil(_obj) && (_obj instanceof String || typeof _obj == "string");},
    isNum: function(_obj) {return !$dh.isNil(_obj) && (_obj instanceof Number || typeof _obj == "number");},
    //TODO: isHash: function(){},
    isObj: function(_obj) {return (_obj instanceof Object || typeof _obj == "object") && (!$dh.isArr(_obj));},
    
    // All in one creator
    New: function(_what, _props, _deep) {
        if (typeof _what == "string") {
            _what = $dh.scope[_what];
        }
        return $dh.construct({}, _what, _props);
    },
    addShortcut: function(name, method) {$dh.shortcuts[name] = method;}, // Add new function to DHTShorcut list

    //===== CLASS MANAGEMENT SECTION ================================
    instOf: [], // Global variable to count number of class instances
    // Each class has following basic properties:
    //  1. _class: Class name (String)
    //  2. _super: Super class reference (Function / undefined)
    //  3. _extended: Array of interface reference that this class is implementing
    newClass: function(_className, _super) { // All arguments after 2nd one will be treated as normal class/objects
        // 1. Create class        
        var args = arguments, k,
            C = $dh.scope[_className] = function() {
                if (this.init) this.init.apply(this, arguments);
                $dh.instOf[_className].push(this);
            };

        // 2. Inheriting super class/ user-defined methods and properties
        if ($dh.isStr(_super))  _super = $dh.scope[_super];
        $dh.extend(C, _super);
        if ($dh.isFunc(_super)) C.prototype._super = _super;

        // 3. Implementing o in given order
        C.prototype._extended = [];
        for (k = args.length - 2; k >= 2; k--) {
            if ($dh.isStr(args[k])) {
                args[k] = $dh.scope[args[k]];
            }            
            C.prototype._extended.push(args[k]); // Save objects' information for later access
            $dh.extend(C, args[k]);
        }

        // 4. Finally set all given methods and properties, overwrite the same methods/properties
        C.prototype._class = _className;
        $dh.instOf[_className] = [];
        if (args.length > 2) {
            $dh.set(C.prototype, args[args.length - 1]);
        }

        // 5. Make it callable from namespace        
        $dh.namesp(_className, $dh.scope[_className]);
    },

    // Create/set namespace with given structure
    namesp: function(nsp, target) {
        if (nsp.indexOf(".") < 0) return;
        var pr = $dh.scope, np = nsp.split(".");
        for (i= 0; i < np.length -1 ; i++) {
            if (!pr[np[i]]) pr[np[i]] = {};
            pr = pr[np[i]];
        }
        pr[np[np.length -1]] = target ? target: (pr[np[np.length -1]] || {});
        
        return pr[np[np.length -1]];
    },
    
    // Extend a class/object
    extend: function(_obj, _props) {
        if ($dh.isFunc(_obj)) { // Extending a class
            return $dh.isFunc(_props) ? $dh.set(_obj.prototype, _props.prototype, true) : $dh.set(_obj.prototype, _props, true);
        }
        else {
            return $dh.isFunc(_props) ? $dh.set(_obj, _props.prototype, true): $dh.set(_obj, _props, true);
        }
    },

    // Treat an object as an instance of a given class
    construct: function(_obj, _class, _args, _overwrite) {
        _obj = $dh.extend(_obj, _class, _overwrite);
        if (_obj.init) _obj.init.apply(_obj, _args);
        if (_class.prototype._class) $dh.instOf[_class.prototype._class].push(_obj);
        return _obj;
    },
    
    //=== SOME EXTRA FUNCTIONS =================================
    //==========================================================
    each: function(obj, func) {
        if ($dh.isArr(obj)) {
            for (var i = 0; i < obj.length; i++) {
                func.apply(obj, [obj[i], i]);
            }
        }
    },
    
    delegate: function(_scope, _method) { // Create delegate // dh.method
        _scope = _scope || $dh.scope;
        return function() {_scope[_method].apply(_scope, arguments);}
    },
    
    setTime: function(scope, funcName, args, length, type) { // Type = loop : setInterval, else: setTimeout
        var func = (scope || $dh.scope)[funcName],
            newFunc = function() {func.apply(scope, args);}
        if (type == "loop") {
            return setInterval(newFunc, length);
        }
        else {
            return setTimeout(newFunc, length);
        }
    }
};
}