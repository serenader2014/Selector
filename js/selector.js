// Created by serenader in 2014/08

var S = function (e) {
    if (this instanceof S) {
        var ele ,
            arr = [];
        if (typeof e === 'object') {
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
    if ([].forEach) {
        this.e.forEach(callback);
    } else {
        for (var i = 0; i < this.e.length; i++) {
            callback(this.e[i], i);
        }
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