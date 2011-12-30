/**
 * Title: DHEvent - Basic event handling class.
 * 
 * *Usage*:
 *  (start code)
 *  	$dhtiny.Require("util/event");
 *  (end)
 *  
 * Class: DHEvent
 * 
 */
$dh.newClass("DHEvent", {
	/**
	 * Function: notify
	 * 		Notify a listener about specific event
	 * 
	 * Parameters:
	 * 		evt - Event name
	 * 		target - The object whose *onnotified* method must be defined.
	 * 				*target.onnotified (evt, sender)* method will be called as a event listener (**evt** is the event name, and *sender* is the event's source object).
	 * 
	 * Example:			 				
	 *	(start code)
	 *		$dh.newClass("TestClass", {
	 *			onnotified: function(evt, sender) {
	 *				alert("Received message '"+ evt+"' from sender '"+ sender +"'");
	 *			}
	 *		});
	 *		
	 *		testListener = new TestClass();
	 *
	 *		e = new DHEvent();
	 *		e.notify("Hello buddy!", testListener);  
	 *  (end)
	 */
    notify: function(evt, target) {},
    
    /**
	 * Function: raise
	 * 		Event broadcasting method (Call defined *onnotified* method of all listeners)
	 * 
	 * Parameters:
	 * 		evt - Event name
	 */    
    raise: function(msg) {},
    
    /**
     * Function: addEv
	 * 		Add an event listener
	 * 
	 * Parameters:
	 * 		evt - Event name. evt== "*" means ALL EVENTS.  
     * 		func - The function that will be called when the event fired. If evt=="*", this function will be always called.
     * 
     * Example:			 				
	 *	(start code)
	 *	$dh.newClass("TestClass1", {
	 *     onnotified: function(evt, sender) {
	 *     		alert("This is an intance of " + this._class + ",  received event '"+ evt+"' from sender '"+ sender.name +"'");
	 *     }
	 *   });
	 *   $dh.newClass("TestClass2", {
	 *   	onnotified: function(evt, sender) {
	 *   		alert("This is an intance of " + this._class + ",  received event '"+ evt+"' from sender '"+ sender.name +"'");
	 *   	}
	 *   });
	 *   
	 *   e = new DHEvent();
	 *   e.name = "TestEvent";
	 *   
	 *   // Add a specific event listener
	 *   e.addEv("onhello", function() {
	 *   	alert("This is hello event listener");
	 *   });
	 *   
	 *   // Add listeners for all events   
	 *   e.addEv('*', new TestClass1());
	 *   e.addEv('*', new TestClass2());
	 *   
	 *   e.raise("onhello"); 
	 *  (end)
	 */
    
    addEv: function(event, func) {},
    
    /**
     * Function: raise
	 * 		Removed an event listener
	 * 
	 * Parameters:
	 * 		evt - Event name
	 * 		func - Event listener
	 * 
	 * Example:			 				
	 *	(start code)
	 *	 $dh.newClass("TestClass1", {
	 *     onnotified: function(evt, sender) {
	 *     		alert("This is an intance of " + this._class + ",  received event '"+ evt+"' from sender '"+ sender.name +"'");
	 *     }
	 *   });
	 *   $dh.newClass("TestClass2", {
	 *   	onnotified: function(evt, sender) {
	 *   		alert("This is an intance of " + this._class + ",  received event '"+ evt+"' from sender '"+ sender.name +"'");
	 *   	}
	 *   });
	 *   
	 *   e = new DHEvent();
	 *   e.name = "TestEvent";
	 *   
	 *   // Add a specific event listener
	 *   e.addEv("onhello", function() {
	 *   	alert("This is hello event listener");
	 *   });
	 *   
	 *   // Add listeners for all events
	 *   l1 = new TestClass1();
	 *   l2 = new TestClass2();
	 *   
	 *   e.addEv('*', l1);
	 *   e.addEv('*', l2);
	 *   
	 *   e.raise("onhello");
	 *   
	 *   // Remove event
	 *   alert("Removed a listener");
	 *   e.rmEv("*", l1);
	 *   
	 *   e.raise("onhello");
	 *  (end)
	 */
    rmEv: function(event, func) {}
});