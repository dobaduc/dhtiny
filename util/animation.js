// Basic animation action management class
$dh.Require("util/event");
$dh.isLoaded("util/animation", true);

$dh.newClass("DHEventController", DHEvent, {
    // NOTE: exeFunc and setPropValue must be defined in child classes
    setPropValue: function() {},
    _NGStatus: {
        // next : current
        "onstart"   : "onrun",
        "onresume"  : "onrun",
        "onrestart" : "onrun"
    },
    _beginVal: 0,
    _deltaVal: 100,
    
    _okToRun : function(evtName) {
        return (!this._NGStatus[evtName] || this._NGStatus[evtName].indexOf(this.actionStatus) < 0);
    },    
    start: function() {
        if (!this._okToRun("onstart")) return false;
        this._startTime = new Date().getTime();
        this.seekTime(0);

        this.actionStatus = "onstart";
        if (this.onstart) this.onstart();
        this.raise(this.actionStatus);

        this.run();
    },
    run: function() {
        if (!this._okToRun("onrun")) return false;
        
        if (this.checkend()) {
            this.stop(true);
            return;
        }
        
        this.seekTime((new Date().getTime() - this._startTime) / 1000);
        
        this.actionStatus = "onrun";
        if (this.onrun) this.onrun();
        this.raise(this.actionStatus);

        this._timerID = $dh.setTime(this,"run", [], 1);
    },
    stop: function(_finishFlag_) {
        if (!this._okToRun("onstop")) return;
        clearTimeout(this._timerID);

        this.actionStatus = "onstop";
        if (this.onstop) this.onstop();
        this.raise(this.actionStatus);
        if (_finishFlag_) {
            this.actionStatus = "onfinish"
            this.raise(this.actionStatus);
        }
    },
    restart: function(){
        if (!this._okToRun("onrestart")) return;
        if (this.onstop) this.onstop();

        this.seekTime(0);
        
        this.actionStatus = "onrestart";
        if (this.onstart) this.onstart();
        if (this.onrestart) this.onrestart();
        this.raise(this.actionStatus);

        this.start();
    },
    resume: function() {
        if (!this._okToRun("onrun")) return false;
        
        this._startTime = new Date().getTime() - this._currentTime * 1000;
        this.seekTime(this._currentTime);

        this.actionStatus = "onresume";
        if (this.onresume) this.onresume();
        this.raise(this.actionStatus);

        this.run();        
    },
    seek: function(pos) {
        if (pos <0) pos = 0;
        if (pos >1) pos = 1;
        this.seekTime(this.getDuration() * pos);
    },       
    seekTime: function(time) { // Second
        // Must use getDuration() - for inheritance in child classes
        duration = this.getDuration();

        if (time < 0) time =0;
        if (time > duration) time = duration;
        this._currentTime = time;
            
        if (this.exeFunc) {            
            this._currentVal = Math.round(this.exeFunc(this._currentTime, this._beginVal, this._deltaVal, this.getDuration()) );
        } else {
            this._currentVal = this._deltaVal* (time/this.getDuration());
        }
        
        this.setPropValue(this._currentVal);
    },
    runToEnd: function() {
        this.seekTime(this.getDuration());
        this.onstop();
    },
    setDuration: function(d){ this.duration = d || 0; },
    getDuration: function(){ return this.duration || 0; },
    getCurrentTime: function() { return this._currentTime; },
    getCurrentVal: function() { return this._currentVal; },
    getActionStatus: function() { return this.actionStatus; },
    getStartTime: function() { return this._startTime; },
    getProgress: function() { return this._currentTime / this.getDuration(); },
    checkend: function() {
        return (this._currentTime >= this.getDuration() ); // when time is up
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
                this.children.splice(i, 1);
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