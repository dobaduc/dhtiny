// Basic animation action management class
$dh.Require("util/event");
$dh.isLoaded("util/animation", true);

$dh.newClass("DHEventController", DHEvent, { // One action effects one object only
    start: function(start, current, astatus) {
        if (this.actionStatus == "onrun") return;
        this.actionStatus = astatus || "onstart";
        this.startTime = start || new Date().getTime();
        this.currentTime = current || 0;
        this.seekTime(this.currentTime);
        
        if (this.onstart) this.onstart();
        this.raise(this.actionStatus);
        this.run();
    },
    run: function() {
        if (this.checkstop && this.checkstop()) {
            this.stop();
            return;
        }
        this.currentTime = new Date().getTime() - this.startTime;
        this.actionStatus = "onrun";
        if (this.onrun) this.onrun();
        this.raise(this.actionStatus);
    },
    stop: function() {
        if (this.actionStatus == "onstop") return;
        this.actionStatus = "onstop";
        if (this.onstop) this.onstop();
        this.raise(this.actionStatus);
    },
    restart: function(){
        this.actionStatus = "onrestart";
        if (this.actionStatus == "onrun")
            if (this.onstop) this.onstop();
        this.seek(0);
        if (this.onstart) this.onstart();
        if (this.onrestart) this.onrestart();
        this.raise(this.actionStatus);
    },
    resume: function() {        
        if (this.actionStatus == "run") return;        
        this.actionStatus = "onresume";
        this.startTime = new Date().getTime() - this.currentTime;        
        //if (this.onresume) this.onresume();
        //this.raise(this.actionStatus);
        //this.run();
        this.start(this.startTime, this.currentTime, this.actionStatus);
    },
    //onrestart: function() {  this.seek(0); this.onstart(); },
    //onresume: function() { this.startTime = new Date().getTime(); },
    seek: function(pos) {
        if (pos <0) pos = 0;
        if (pos >1) pos = 1;
        this.seekTime(this.duration * pos);
    },   
    getDuration: function(){
        return this.duration; // If there is no duration, return undefined
    },
    getActionStatus: function() {
        return this.actionStatus;
    }
});

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
            this.exeFunc = exeFunc;
            this.duration = duration;
            if (setPropValue) {
                this.setPropValue = setPropValue;
            }           
        }
        // Recently fixed values
        this.beginVal = 0;
        this.deltaVal = 100; 
        this.duration = this.duration || 0;
        this.setPropValue = this.setPropValue || function() {};
    },
    onstart: function() {
        this.setPropValue(this.beginVal);
        this.startTime = new Date().getTime();
        this.currentVal = this.beginVal;
    },
    onrun: function() {
        var t = (this.currentTime) / 1000;
        if (this.exeFunc) {
            this.currentVal = Math.round(this.exeFunc(t, this.beginVal, this.deltaVal, this.duration));
        }
        this.setPropValue(this.currentVal);
        this.timerID = $dh.setTime(this, "run", [], 1);
    },
    onstop: function() {
        clearInterval(this.timerID);
        // For sure
        if (this.currentTime >= this.duration * 1000) { // When motion has completely run to the end
            this.currentVal = this.beginVal + this.deltaVal;
            this.setPropValue(this.currentVal);      // --> set the final status for sure        	
        }
    },
    seekTime: function(time) {
        if (time < 0) time =0;
        if (time > this.duration) time = this.duration;
        if (this.exeFunc) {
            this.currentVal = Math.round(this.exeFunc(time, this.beginVal, this.deltaVal, this.duration));
        }
        this.setPropValue(this.currentVal);
    },
    checkstop: function() {
        return (this.actionStatus == "onstop")           // when status has been changed to stop
        	|| (new Date().getTime() - this.startTime) > (this.duration * 1000); // when time is up
        //|| (this.currentVal == this.beginVal + this.deltaVal);        		 // when finished value computing --> Not really true
    },
    runtoend: function() {
        this.onstart();
        this.startTime = new Date().getTime() - (this.duration + 1) * 1000;
        this.onstop();
    }
});

$dh.newClass("DHParallelMotions", DHEventController, {
    init: function() {
        this.children = new Array();
        this.actionListeners = new Array();
    },
    addChild: function(child) {
        this.children.push(child);
        this.duration = this.getDuration(); // Update duration
        child.addEv(this);
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
        this.countStop = 0;
        for (var i = 0; i < this.children.length; i++)
            this.children[i].start();       
    },
    onstop: function() {
        for (var i = 0; i < this.children.length; i++)
            this.children[i].stop();
    },    
    onresume: function() {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].currentTime < this.children[i].duration)
                this.children[i].resume();
        }
    },
    onnotified: function(msg, sender) {
        if (msg == "onstop" && sender != this) {
            this.countStop++;
            if (this.countStop >= this.children.length)
                this.stop();
        }
        if (msg == "onrun" && sender != this) {
            this.raise("onrun");
        }
    },
    seekTime: function(time) {
        if (this.children.length ==0) return;
        if (time <0) time = 0;
        if (time > this.duration) time = this.duration;        
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].seekTime(time);
        }
    },
    runtoend: function() {
        for (var k = 0; k < this.children.length; k++) {
            var ch = this.children[k];
            ch.runtoend();
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
        return max;
    }
});

$dh.newClass("DHMotionSequence", DHEventController, {
    init: function() {
        this.children = new Array();
        this.currentChildIndex = 0;
        this.actionListeners = new Array();
    },
    addChild: function(child, timebefore) {
        this.children.push(child);
        child.addEv(this);
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
        this.children[0].timerID = $dh.setTime(this.children[0], "start", [], this.children[0].timebefore * 1000, "");
    },
    onstop: function() {
        /*if (this.children[this.currentChildIndex]) {
            this.children[this.currentChildIndex].stop();
        }*/
        for (var i = 0; i < this.children.length; i++)
            this.children[i].stop();
    },
    onresume: function() {
        if (this.children[this.currentChildIndex]) {
            this.children[this.currentChildIndex].resume();
        }
    },
    onnotified: function(msg, sender) {
        if (msg == "onstop" && sender != this) {
            this.raise("onchildstop");
            if (this.currentChildIndex >= this.children.length - 1)
                this.stop();
            else {
                this.currentChildIndex++;
                $dh.setTime(this.children[this.currentChildIndex], "start", [], this.children[this.currentChildIndex].timebefore * 1000);
            }
        }
        if (msg == "onstart" && sender != this) {
            this.raise("onchildstart");
        }
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
            this.children[i].runtoend();
        }
        this.children[idx].seekTime(time - before);
    },
    runtoend: function() {
        for (var k = this.currentChildIndex; k < this.children.length; k++) {
            var ch = this.children[k];
            ch.runtoend();
        }
        this.currentChildIndex = this.children.length - 1;
    },
    getDuration: function() {
        var total = 0;
        for (var i = 0; i < this.children.length; i++) {
            total += this.children[i].getDuration() + (this.children[i].timebefore || 0);
        }
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