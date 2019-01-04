var EventCenter = (function () {
    var events = {};
    function on(evt, handler) {
        events[evt] = events[evt] || [];
        events[evt].push({ handler: handler });
    }
    function fire(evt, arg) {
        if (!events[evt]) {
            return
        }
        for (var i = 0; i < events[evt].length; i++) {
            var param = arg.PromiseValue;
            var funName = events[evt][i].handler.name;
            if (arg.PromiseStatus == "resolved") {
                if (funName != 'catchM') {
                    events[evt][i].handler(param);
                    continue;
                } else {
                    continue;
                }
            } else if (arg.PromiseStatus == "rejected") {
                if (funName == 'catchM') {
                    events[evt][i].handler(param);
                    continue;
                } else {
                    continue;
                }

            } else {
                continue;
            }
        }
        arg.PromiseValue = undefined;
    }
    function off(evt) {
        delete events[evt];
    }
    return {
        on: on,
        fire: fire,
        off: off
    }
}());


var generateUUID = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}


/**
 * Opromise is a constructor of Promise self defined, which static property contains 'PromiseValue', 'PromiseStatus' and 'PromiseSymbol', and it receives a function as parameter.
 */
var Opromise = function (func) {
    this.PromiseValue = null;
    this.PromiseStatus = "pending";
    this.PromiseSymbol = generateUUID();
    if (func instanceof Function) {
        func(this.resolve.bind(this), this.reject.bind(this));
    } else {
        throw new Error("The parameter is expected to be a function");
    }
}

/**
 *  
 * 
 */
Opromise.resolve = function (param) {
    var temp = new Opromise(function () { });
    temp.PromiseValue = param;
    temp.PromiseStatus = "resolved";
    return temp;
}

Opromise.reject = function (param) {
    var temp = new Opromise(function () { });
    temp.PromiseValue = param;
    temp.PromiseStatus = "rejected";
    return temp;
}

/**
 * There is a temp Opromise used as a proxy.  local variable arr receives the async Opromise passed in, and for loop will add 'then' and 'catch' invocation to each element of arr. 
 * Monitor function will be invoked when 'then' method excuted in arr element Object.
 */
Opromise.all = function () {
    var arr = arguments,
        len = arr.length,
        index = 0,
        res = [],
        temp = new Opromise(function () { });
    for (var i = 0; i < len; i++) {
        if (!(arr[i] instanceof Opromise)) {
            throw new Error('parameter is not a instance of Opromise');
        } else {
            arr[i].then(function (param) {
                res.push(param);
                index++;
                monitor();
            }).catch(function () {
                temp.reject();
            });
        }
    }

    /**
     * monitor each Opromise process, when all Opromise resolved , monitor will trigger the temp resolve method, and pass the param which collected each Opromise resolve param with a array.
     */
    function monitor() {
        index === len&&temp.resolve(res);
    }
    return temp;
}


Opromise.prototype.resolve = function (param) {
    var _this = this;
    this.PromiseValue = param;
    this.PromiseStatus = "resolved";
    var value = this.PromiseSymbol;
    EventCenter.fire(value, _this);
    EventCenter.off(value);
    return this;
}


Opromise.prototype.reject = function (param) {
    var _this = this;
    this.PromiseValue = param;
    this.PromiseStatus = "rejected";
    var value = this.PromiseSymbol;
    EventCenter.fire(value, _this);
    EventCenter.off(value);
    return this;
}



Opromise.prototype.then = function (func) {
    if (!(func instanceof Function)) { throw new Error("function is required here in Opromise 'then' method"); }
    switch (this.PromiseStatus) {
        case "rejected":
            return this;
        case "resolved":
            func(this.PromiseValue);
            return Opromise.resolve();
        case "pending":
            var param = this.PromiseValue;
            var key = this.PromiseSymbol;
            var temp = this;
            EventCenter.on(key, function then(param) {
                var promise = func(param);
                if (promise instanceof Opromise) {
                    if (promise.PromiseStatus == "resolved") {
                        temp.PromiseValue = promise.PromiseValue;
                        temp.PromiseStatus = promise.PromiseStatus;
                    } else {
                        temp.PromiseValue = promise.PromiseValue;
                        temp.PromiseStatus = promise.PromiseStatus;
                    }
                }
            });
            return temp;
    }
}

Opromise.prototype.catch = function (func) {
    if (!(func instanceof Function)) { throw new Error("function is required here in Opromise then method"); }
    switch (this.PromiseStatus) {
        case "rejected":
            func(this.PromiseValue);
            return false;
        case "resolved":
            return this;
        case "pending":
            var param = this.PromiseValue;
            var key = this.PromiseSymbol;
            var temp = this;
            EventCenter.on(key, function catchM(param) {
                var promise = func(param);
                if (promise instanceof Opromise) {
                    if (promise.PromiseStatus == "rejected") {
                        temp.PromiseValue = promise.PromiseValue;
                        temp.PromiseStatus = promise.PromiseStatus;
                    } else {
                        temp.PromiseValue = promise.PromiseValue;
                        temp.PromiseStatus = promise.PromiseStatus;
                    }
                }
            });
            return temp;
    }
}