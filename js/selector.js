// Created by serenader in 2014/08

var S = function (e) {
    if (this instanceof S) {
        var ele ,
            arr = [];
        if (Object.prototype.toString.call(e) === '[object Array]') {
            ele = e;
        } else if (typeof e === 'object') {
            ele = [e];
        } else {
            ele = document.querySelectorAll(e);
        }
        for (var i = ele.length; i--; ) {
            arr.unshift(ele[i]);
            this[i] = ele[i];
        }
        this.length = ele.length;
        this.e = arr;
    } else {
        return new S(e);
    }
};

S.fn = S.prototype;

S.fn.each = function (callback) {
    for (var i = 0; i < this.e.length; i++) {
        callback.call(this.e[i], this.e[i], i);
    }
    return this;
};

S.fn.html = function (str) {
    var self = this;
    if (str && typeof str === 'string') {
        self.each(function (item, index) {
            item.innerHTML = str;
        });
        return self.html();
    } else {
        return self.e[0].innerHTML;
    }
};

S.fn.attr = function (name, value) {
    var self = this;
    if (value && typeof value === 'string') {
        self[0].setAttribute(name, value);
        return self;
    } else {
        return self[0].getAttribute(name);
    }
};

S.fn.eq = function (index) {
    var self = this,
        target = self.e[index<0 ? self.e.length+index : index];
    return S(target);
};

S.fn.parent = function () {
    var self = this,
        target = self.e[0].parentElement;
    return S(target);
};

S.fn.parents = function (selector) {
    var self = this;
    if (self.parent()[0] === null) {
        return [];
    }
    if (S.matches(self.parent()[0], selector)) {
        return self.parent();
    } else {
        return self.parent().parents(selector);
    }
};


S.fn.on = function () {
    var self = this,
        type = arguments[0],
        target,
        handler;
    if (arguments.length < 3 && typeof arguments[1] === 'function') {
        handler = arguments[1];
        self.each(function (e, i) {
            var currentTarget = this;
            EventHandler(e, type, function (event) {
                event = event || window.event;
                handler.call(currentTarget, event);
            });
        });
    } else if (arguments.length === 3 && typeof arguments[2] === 'function') {
        target = arguments[1];
        handler = arguments[2];
        self.each(function (e, i) {
            var currentTarget = this;
            EventHandler(e, type, function (event) {
                event = event || window.event;
                if (S.matches(event.target, target)) {
                    handler.call(currentTarget, event);
                }
            });
        });
    }
    function EventHandler (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    }
    
    return self;
};


// not working
S.fn.off = function () {
    var self = this,
        type = arguments[0],
        target,
        handler;
    
    if (arguments.length === 1) {
        console.log('trigger off');
        self.each(function (e, i) {
            RemoveEventHandler(e, type, undefined);
        });
    }

    if (arguments.length < 3 && typeof arguments[1] === 'function') {
        handler = arguments[1];
        self.each(function (e, i) {
            RemoveEventHandler(e, type, function (event) {
                event = event || window.event;
                handler(event);
            });
        });
    } else if (arguments.length === 3 && typeof arguments[2] === 'function') {
        target = arguments[1];
        handler = arguments[2];
        self.each(function (e, i) {
            RemoveEventHandler(e, type, function (event) {
                event = event || window.event;
                if (S.matches(event.target, target)) {
                    handler(event);
                }
            });
        });
    }

    function RemoveEventHandler (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    }
};

// this method has a bug
S.fn.find = function (selector) {
    var self = this,
        result = [];
    self.each( function (e, index) {
        var ele = this.querySelectorAll(selector);
        for (var i = ele.length; i--; result.unshift(ele[i]));
    });
    return new S(result);
}

S.matches = function (e, s) {
    if (e.matches) {
        return e.matches(s);
    } else if (e.matchesSelector(s)) {
        return e.matchesSelector(s);
    } else if (e.msMatchesSelector) {
        return e.msMatchesSelector(s);
    } else if (e.mozMatchesSelector) {
        return e.mozMatchesSelector(s);
    } else if (e.webkitMatchesSelector) {
        return e.webkitMatchesSelector(s);
    } else {
        throw new Error('Matches function not supported.');
    }
};