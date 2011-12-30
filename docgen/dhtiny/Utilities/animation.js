/*
 Title: Animation management module
 
 *Author*:   Do Ba Duc
 
 *Usage*:
   (start code)
   		$dhtiny.Require("util/animation");
   (end)
 
 *Require*:
 	<DHEvent>
 	
 *Demo*:
  	<http://tuongvy.me/dhtiny/demos/animation/>
  	
 Group: Introduction
  		This module contains some useful classes used for creating and handling animation effects.
*/
 
/* 
 Class: DHEvenController
 	Animation management base class 
 
 Group: Properties
 
	 Property: _startTime
	 	Start time of current animation
	 
	 Property: duration
	 	Animation duration	 	 
	 
 Group: Methods
 	
 	Function: start
 		Start animation
	*/
	start: function(){}
	
	/*
 	Function: run
 		Callback method during animation
	*/
	run: function(){}
	
	/*
  	Function: stop
 		Stop animation
	*/
	stop: function(){}
	
	/*	
	Function: restart
		Restart animation
	*/
	restart: function(){}
	
	/*	
	Function: resume
		Resume stopped animation
	*/
	resume: function(){}
	
	/*
		Function: runtoend
			Run to the end of animation
	*/
	runtoend: function(){}
	
	/*
	Function: seek
		Seek to a specific position of the animation
	
	Parameter:
		pos - Given position (Value is between 0 and 1)
	*/
	seek: function(pos){}
	
	/*
	Function: seek
		Seek to a specific time of the animation
	
	Parameter:
		time - Given time (Value is between 0 and <duration>)
	*/
	seekTime: function(time){}
	
	/*
	Function: setDuration
		Set animation duration
	
	Parameter:
		d - Given duration
	*/
	setDuration: function(d){},
	/*
	Function: getDuration
		Return animation duration
	*/	
	getDuration: function(){ },
	/*
	Function: getCurrentTime
		Return animation current time
	*/
	getCurrentTime: function() {  },
	/*
	Function: getCurrentVal
		Return animation current value (progress). Return value is between 0 and 100 (percent)
	*/
    getCurrentVal: function() { },
    /*
	Function: getActionStatus
		Return animation current status. Available value: "onstart", "onrun", "onresume", "onrestart", "onfinish"
	*/
    getActionStatus: function() { },
    /*
	Function: getStartTime
		Return animation current value (progress). Return value is between 0 and 100 (percent)
	*/
    getStartTime: function() { },
    /*
	Function: getProgress
		Return curent animation progress. Return value is between 0 and 1
	*/
    getProgress: function() { }  

 /* 
 
 Class: DHMotion
 	Single motion management class
 	
 Class: DHMotionSequence
 	Motion sequence management class
 	
 Class: DHParallelMotions
 	Parallel motions management class
*/


// Basic motion class
$dh.newClass("DHMotion", DHEventController, {
    speedRatio  : 1,
    init: function(obj, exeFunc, duration, setPropValue) {
        this.targetObj = $dh.el(obj);
        this.exeFunc = DHMotion.AnimEffects.strongEaseOut; // Default
        this.setParams(exeFunc, duration, setPropValue);
    },
    setParams: function(exeFunc, duration, setPropValue) {
        if (arguments.length == 1) { // Parameters are given by a hash
            $dh.setProps(this, arguments[0]);
        }
        else {            
            this.exeFunc = exeFunc || this.exeFunc || null;
            this.duration = duration || this.duration || 0;
            if (setPropValue) {
                this.setPropValue = setPropValue;
            }           
        }
        this.duration = this.duration || 0;
        this.setPropValue = this.setPropValue || function() {};
    },    
    onstop: function() {
        if (this._currentTime >= this.duration) { // When motion has completely run to the end
            this._currentVal = this._beginVal + this._deltaVal;
            this.setPropValue(this._currentVal);      // --> set the final status for sure
        }        
    }   
});

$dh.newClass("DHParallelMotions", DHEventController, {
    init: function() {
        this.children = new Array();
        this.actionListeners = new Array();
        this._stopDelegate = $dh.delegate(this, "stop");
    },
    addChild: function(child) {
        this.children.push(child);
        this.duration = this.getDuration(); // Update duration
    },
    removeChild: function(child) {
        for (var i = 0; i < this.children.length; i++)
            if (this.children[i] == child) {
                this.children[i].splice(i, 1);
                this.duration = this.getDuration(); // Update duration
                return;
            }
    },
    onstart: function() {
        for (var i = 0; i < this.children.length; i++)
            this.children[i].start();
        // Add THIS as all in one event listener
        this.children[this.children.length -1].rmEv( "onstop", this._stopDelegate);
        this.children[this.children.length -1].addEv("onstop", this._stopDelegate);
    },
    onstop: function() {        
        this.children[this.children.length -1].rmEv("onstop", this._stopDelegate);
        for (var i = 0; i < this.children.length; i++)
            this.children[i].stop();        
    },    
    onresume: function() {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i]._currentTime < this.children[i].duration)
                this.children[i].resume();
        }
    },
    onnotified: function(msg, sender) {
        if (msg == "onrun" && sender != this) {
            this.raise("onrun");
        }
    },
    seekTime: function(time) {
        if (this.children.length ==0) return;
        if (time <0) time = 0;
        if (time > this.duration) time = this.getDuration();

        this._currentTime = time;
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].seekTime(time);
        }
    },
    runToEnd: function() {
        for (var k = 0; k < this.children.length; k++) {
            var ch = this.children[k];
            ch.runToEnd();
        }
    },
    getDuration: function() {
        var max = 0;
        for (var i = 0; i < this.children.length; i++) {
            var d = this.children[i].getDuration();
            if (d > max) { 
                max = d;
            }
        }
        this.duration = max;
        return max;
    }
});

$dh.newClass("DHMotionSequence", DHEventController, {
    init: function() {
        this.children = new Array();       
        this.actionListeners = new Array();
        this.currentChildIndex = 0;
        this._runNextDelegate = $dh.delegate(this, "runNext");
    },
    addChild: function(child, timebefore) {
        this.children.push(child);
        child.timebefore = timebefore ? timebefore : 0;
        this.duration = this.getDuration(); // Update duration
    },
    removeChild: function(child) {
        for (var i = 0; i < this.children.length; i++)
            if (this.children[i] == child) {
                this.children[i].splice(i, 1);
                this.duration = this.getDuration(); // Update duration
                return;
            }
    },
    onstart: function() {        
        if (this.children.length <= 0)
            return;

        this.currentChildIndex = 0;
        this.children[0].addEv("onstop", this._runNextDelegate);
        this._nextTimerID = $dh.setTime(this.children[0], "start", [], this.children[0].timebefore * 1000);
    },
    onstop: function() {
        clearTimeout(this._nextTimerID);
        currentChild = this.children[this.currentChildIndex];
        if (currentChild) {
            currentChild.rmEv("onstop", this._runNextDelegate);
            currentChild.stop();
        }
    },
    onresume: function() {
        if (this.children[this.currentChildIndex]) {
            this.children[this.currentChildIndex].resume();
        }
    },
    onnotified: function(msg, sender) {
        //if (msg == "onstart" && sender != this) {
        //    this.raise("onchildstart");
        //}
        if (msg == "onrun" && sender != this) {
            this.raise("onrun");
        }
    },
    seekTime: function (time) {
        if (this.children.length ==0) return;
        if (time <0) time = 0;
        if (time > this.duration) time = this.duration;
        
        idx = 0;
        before = this.children[0].timebefore;
        nextDuration =  this.children[0].getDuration();
        while (before + nextDuration < time) {
            before +=  nextDuration;
            idx ++;
            if (idx < this.children.length) {
                before +=  this.children[idx].timebefore;
                nextDuration = this.children[idx].getDuration();
            }
        }        
        for (i =0; i < idx-1; i++) {
            this.children[i].runToEnd();
        }
        this.children[idx].seekTime(time - before);
    },
    runNext: function() {
        if (this.currentChildIndex > this.children.length - 1) {
            this.stop();
        }
        else {
            clearTimeout(this._nextTimerID);
            this.children[this.currentChildIndex].rmEv("onstop", this._runNextDelegate);

            this.currentChildIndex++;
            if (!this.children[this.currentChildIndex]) return;
            this.children[this.currentChildIndex].addEv("onstop", this._runNextDelegate);
            this._nextTimerID = $dh.setTime(this.children[this.currentChildIndex], "start", [], this.children[this.currentChildIndex].timebefore * 1000);
        }
    },
    runToEnd: function() {
        for (var k = this.currentChildIndex; k < this.children.length; k++) {
            var ch = this.children[k];
            ch.runToEnd();
        }
        this.currentChildIndex = this.children.length - 1;
    },
    getDuration: function() {
        var total = 0;
        for (var i = 0; i < this.children.length; i++) {
            total += this.children[i].getDuration() + (this.children[i].timebefore || 0);
        }
        this.duration = total;
        return total;
    }
});


/* EASING EQUATIONS: http://jstween.blogspot.com/
Open source under the BSD License.
Copyright (c) 2001 Robert Penner
JavaScript version copyright (C) 2006 by Philippe Maegerman 
*/
DHMotion.AnimEffects = {
    backEaseIn: function(t, b, c, d) {return c * (t /= d) * t * ((1.70158 + 1) * t - 1.70158) + b;},
    backEaseOut: function(t, b, c, d) {return c * ((t = t / d - 1) * t * ((1.70158 + 1) * t + 1.70158) + 1) + b;},
    backEaseInOut: function(t, b, c, d, a, p) {
        var s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    elasticEaseIn: function(t, b, c, d) {
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        var p = d * 0.3, a = c, s = p / 4;
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticEaseOut: function(t, b, c, d) {
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        var p = d * 0.3, a = c, s = p / 4;
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    elasticEaseInOut: function(t, b, c, d, a, p) {
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) var p = d * (.3 * 1.5);
        if (!a || a < Math.abs(c)) {var a = c;var s = p / 4;}
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    bounceEaseOut: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {return c * (7.5625 * t * t) + b;}
        else if (t < (2 / 2.75)) {return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;}
        else if (t < (2.5 / 2.75)) {return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;}
        else {return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;}
    },
    bounceEaseIn: function(t, b, c, d) {return c - DHMotion.AnimEffects.bounceEaseOut(d - t, 0, c, d) + b;},
    bounceEaseInOut: function(t, b, c, d) {
        return (t < d / 2) ? DHMotion.AnimEffects.bounceEaseIn(t * 2, 0, c, d) * .5 + b :
        	DHMotion.AnimEffects.bounceEaseOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    },
    strongEaseInOut: function(t, b, c, d) {return c * (t /= d) * t * t * t * t + b;},
    regularEaseIn: function(t, b, c, d) {return c * (t /= d) * t + b;},
    regularEaseOut: function(t, b, c, d) {return -c * (t /= d) * (t - 2) + b;},
    regularEaseInOut: function(t, b, c, d) {return ((t /= d / 2) < 1) ? c / 2 * t * t + b : -c / 2 * ((--t) * (t - 2) - 1) + b;},
    strongEaseIn: function(t, b, c, d) {return c * (t /= d) * t * t * t * t + b;},
    strongEaseOut: function(t, b, c, d) {return c * ((t = t / d - 1) * t * t * t * t + 1) + b;},
    strongEaseInOut: function(t, b, c, d) {
        return ((t /= d / 2) < 1) ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }
};