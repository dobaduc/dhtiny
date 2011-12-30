// Treat DHEvent as an interface
$dh.isLoaded("util/event", true);
$dh.newClass("DHEvent", {
    notify: function(msg, target) {
        if (target.onnotified) {
            var args = [msg, this];
            for (var i = 2; i < arguments.length; i++)
                args.push(arguments[i]);
            target.onnotified.apply(target, args);
        }
    },
    raise: function(msg) { 
        if (!this.eventHandlers)
            return;
        var args = [this];
        for (var i = 1; i < arguments.length; i++)
            args.push(arguments[i]);
        var a = this.eventHandlers;
        if (a[msg]) {
            for (var j = 0; j < a[msg].length; j++)
                a[msg][j].apply(this, args);
        }
        if (a["*"]) {
            for (var i = 0; i < a["*"].length; i++)
                this.notify(msg, a["*"][i]);
        }
    },
    addEv: function(event, func) {
        if ($dh.isNil(func)) {
            this.addEv("*", event);
            return;
        }
        if (!this.eventHandlers)
            this.eventHandlers = {};
        if ($dh.isNil(this.eventHandlers[event]))
            this.eventHandlers[event] = [];
        this.eventHandlers[event].push(func);
    },
    rmEv: function(event, func) {
        if ($dh.isNil(func)) {
            if (!$dh.isStr(event))
                this.rmEv("*", event);
            else
                this.eventHandlers[event] = [];
            return;
        }
        if (this.eventHandlers && this.eventHandlers[event]) {
            for (var i = 0; i < this.eventHandlers[event].length; i++)
                if (this.eventHandlers[event][i] == func) {
                    this.eventHandlers[event].splice(i, 1);
                return;
            }
        }
    }
});