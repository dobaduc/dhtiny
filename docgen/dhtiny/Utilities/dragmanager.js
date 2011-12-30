/**
 * Title: DHDrag - Drag & drop management module 		
 *
 * *Author*:   Do Ba Duc
 * 
 * *Implemented*: <DHEvent>
 * 
 * *Usage*:
 *  (start code)
 *  	$dhtiny.Require("util/dragmanager");
 *  (end)
 * 
 * Group: Introduction
 * 		DHDrag make it easy to drag & drop elements. It's now supporting very basic effects, but extensible and customizable.
 *   	You can call this module through *DHDrag* or $dh.dragger object.  
 * 
 * Inherited classes:
 * 		<DHEvent>
 *  
 */

/**
 * Group: Properties
 * 
 * Variable: activeObj
 *   Currently being dragged object
 *   
 * Variable: dragMask
 *   The mask will be used to cover target object  
 *   
 * Group: Methods
 * 
 * Variable: canvas
 *   A HTMLElement used in this class as the main object 
 * 
 */
$dh.extend($dh.dragger, {
	/**
	 * Function: setDrag
	 * 		Enable drag&drop and set parameters for an object
	 * 
	 * Parameters:
	 * 		obj - Target object
	 * 		dragParams - Parameter set.
	 * 
	 * NOTE:
	 *   Available properties that can be set through *dragParams* are:
	 * 	
	 *  	mode - Drag mode that will be applied. DHTiny has 2 default drag mode: "MOVE" and "RESIZE"
	 *  	dragOrigin - The object that will be treated as original coordinate when calculating object position.
	 *                   Specifying this is important to prevent miscalculating scrollbars' position.
	 *      ghostDrag - Use a mask instead of real object while dragging (true/false) 
	 * 		maskStyle - If ghostDrag is enabled, the mask's style will be specified by this property	 
	 */
    setDrag: function(obj, dragParams) { //Eg: {mode : "MOVE", dragSource:parent, maskStyle:"", limit:{}, ghostDrag:true}    
    },
    
    /**
     * Function: setDragParams
     * 		Change current drag& drop parameters for an object
     * 
     * Parameters:
     * 		obj - Target object
     * 		dragParams - New drag& drop parameters for obj
     * 
     */
    setDragParams: function(obj, dragParams) {},
    
    /**
	 * Function: setDrag
	 * 		Enable drag&drop on an object
	 * 
	 * Parameters:
	 * 		obj - Target object
	 */
    enableDrag: function(obj) {},
    
    /**
	 * Function: setDrag
	 * 		Disable drag&drop on an object
	 * 
	 * Parameters:
	 * 		obj - Target object
	 */
    disableDrag: function(obj) {},
    
    /**
	 * Function: setDragTarget
	 * 		Set the drag target for an object.
	 *      Drag target is the object whose properties (position, size, ...) will be affected directly while drag & drop the source object.  
	 * 
	 * Parameters:
	 * 		obj - Given object
	 * 		tar - Target object
	 */
    setDragTarget: function(src, tar) {},

    /**
     * Function: addMode
     * 		Add an user defined drag & drop mode
     * 
     * Parameters:
     * 		name - Mode name
     * 		modeObj - The user defined object which contains required methods
     * 
     * NOTE: Format of a drag mode
     *	User can define following custom methods:
     * 		- onDragStart
     * 	 	- onDragStop
     * 		- onDragging
     * 		- onInitDrag
     * 
     * Example:
     * (start code)
	 *  // Define drag effects
	 *   $dh.dragger.addMode("MOVE", {
	 *    onInitDrag: function(sender, target) {
	 *        var pp = ["left", "top"];
	 *        for (var i = 0; i < pp.length; i++) {
	 *            target.dragParams["min" + pp[i]] = target.dragParams["min" + pp[i]] || -99999;
	 *            target.dragParams["max" + pp[i]] = target.dragParams["max" + pp[i]] || 99999;
	 *        }
	 *    },
	 *    onDragStart: function(sender, target, ev) {
	 *        if (document.body.style.cursor.indexOf("resize") > 0)
	 *            return false;
	 *        $dh.dragger.mouseOffset = $dh.dragger.msOffset(ev, target);
	 *        if (target.dragParams.noMask != true) {
	 *	        $dh.dragger.mask.style.cursor = "move";
	 *	        $dh.dragger.mask.style.display = "";
	 *	    }
	 * 	    var size = $dh.size(target);
	 *	    $dh.size($dh.dragger.mask, [size.width, size.height]);
	 *    },
	 *    
	 *    onDragStop: function(sender, target, ev) {
	 *        target.style.display = "";
	 *        if (target.dragParams.ghostDrag == true)
	 *            $dh.css(target, {left: $dh.dragger.mask.style.left, top: $dh.dragger.mask.style.top});
	 *        $dh.dragger.mask.style.display = "none";
	 *    },
	 *
	 *    onDragging: function(sender, target, ev) {
	 *        if (document.body.style.cursor.indexOf("resize") > 0)
	 *            return false;
	 *        var mousePos = ev.pos;
	 *        var dx = 0, dy = 0;
	 *        if (this.activeObj.dragParams.dragOrigin) {
	 *            dx = -$dh.pos(target.dragParams.dragOrigin).left + target.dragParams.dragOrigin.scrollLeft;
	 *            dy = -$dh.pos(target.dragParams.dragOrigin).top +  target.dragParams.dragOrigin.scrollTop;
	 *        }
	 *
	 *        var newPos = {};
	 *        newPos.left = mousePos.left + dx - $dh.dragger.mouseOffset.left;
	 *        newPos.top  = mousePos.top  + dy - $dh.dragger.mouseOffset.top;
	 *        for (var p in newPos) {
	 *            if (newPos[p] > target.dragParams["max"+p]) newPos[p] = target.dragParams["max"+p];
	 *            if (newPos[p] < target.dragParams["min"+p]) newPos[p] = target.dragParams["min"+p];
	 *        }
	 *    	$dh.pos($dh.dragger.mask,[newPos.left, newPos.top]);
	 *    	if (target.dragParams.ghostDrag != true)
	 *    	    $dh.pos(target, [newPos.left, newPos.top]);
	 *    }
	 *   });
	 *   
	 *   (end)
	*/
    addMode: function(name, modeObj) {},
    
    /**
     * Function: hasDragMode
     * 
     * Parameters:
     * 		Check if an object is using a specific drag mode or not
     * 
     * Parameters:
     * 		obj - Object
     * 		mode - Drag mode
     */
    hasDragMode: function(obj, mode) { } 
    
    /**
     * Group: Built in drag modes
     * 
     * MOVE:
     * 		This drag mode allow drag & drop to change object's position. Available customizable properties are: minleft, maxleft, mintop, maxtop
     *   
     * RESIZE: 
     *  	This drag mode allow drag & drop to change object's size. Available customizable properties are: minwidth, maxwidth, minheight, maxheight
     * 
     */
});
