/*! UIkit 3.0.0-beta.28 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define('uikit', ['jquery'], factory) :
	(global.UIkit = factory(global.jQuery));
}(this, (function ($) { 'use strict';

var $__default = 'default' in $ ? $['default'] : $;

var docEl = document.documentElement;
var win$$1 = $__default(window);
var doc$$1 = $__default(document);
var docElement$$1 = $__default(docEl);

var isRtl$$1 = docEl.getAttribute('dir') === 'rtl';

function isReady$$1() {
    return document.readyState === 'complete' || document.readyState !== 'loading' && !docEl.doScroll;
}

function ready$$1(fn) {

    var handle = function () {
        off$$1(document, 'DOMContentLoaded', handle);
        off$$1(window, 'load', handle);
        fn();
    };

    if (isReady$$1()) {
        fn();
    } else {
        on$$1(document, 'DOMContentLoaded', handle);
        on$$1(window, 'load', handle);
    }

}

function on$$1(el, type, listener, useCapture) {
    if ( useCapture === void 0 ) useCapture = false;

    type.split(' ').forEach(function (type) { return toNode$$1(el).addEventListener(type, listener, useCapture); });
}

function off$$1(el, type, listener, useCapture) {
    if ( useCapture === void 0 ) useCapture = false;

    type.split(' ').forEach(function (type) { return toNode$$1(el).removeEventListener(type, listener, useCapture); });
}

function one$$1(el, type, listener, useCapture, condition) {

    var handler = function (e) {
        var result = !condition || condition(e);
        if (result) {
            type.split(' ').forEach(function (type) { return off$$1(el, type, handler, useCapture); });
            listener(e, result);
        }
    };

    type.split(' ').forEach(function (type) { return on$$1(el, type, handler, useCapture); });
}

function trigger$$1(element, event) {
    var e = createEvent$$1(event);
    toNode$$1(element).dispatchEvent(e);
    return e;
}

function $trigger$$1(element, event, data, local) {
    if ( local === void 0 ) local = false;

    var e = event instanceof $.Event ? event : $.Event(event);
    $__default(element)[local ? 'triggerHandler' : 'trigger'](e, data);
    return e;
}

function transition$$1(element, props, duration, transition$$1) {
    if ( duration === void 0 ) duration = 400;
    if ( transition$$1 === void 0 ) transition$$1 = 'linear';


    return promise$$1(function (resolve, reject) {

        element = $__default(element);

        for (var name in props) {
            element.css(name, element.css(name));
        }

        var timer = setTimeout(function () { return element.trigger(transitionend); }, duration);

        element
            .one(transitionend, function (e, cancel) {
                clearTimeout(timer);
                element.removeClass('uk-transition').css('transition', '');
                cancel ? reject() : resolve();
            })
            .addClass('uk-transition')
            .css('transition', ("all " + duration + "ms " + transition$$1))
            .css(props);

    });

}

var Transition$$1 = {

    start: transition$$1,

    stop: function stop(element, cancel) {
        $trigger$$1(element, transitionend, [cancel], true);
        return promise$$1.resolve();
    },

    cancel: function cancel(element) {
        return this.stop(element, true);
    },

    inProgress: function inProgress(element) {
        return $__default(element).hasClass('uk-transition');
    }

};

function animate$$1(element, animation, duration, origin, out) {
    if ( duration === void 0 ) duration = 200;


    return promise$$1(function (resolve, reject) {

        var cls = "" + animation + (out ? ' uk-animation-leave' : ' uk-animation-enter');

        element = $__default(element);

        if (animation.lastIndexOf('uk-animation-', 0) === 0) {

            if (origin) {
                cls += " uk-animation-" + origin;
            }

            if (out) {
                cls += ' uk-animation-reverse';
            }

        }

        reset();

        element
            .one(animationend || 'animationend', function (e, cancel) {
                reset();
                cancel ? reject() : resolve();
            })
            .css('animation-duration', (duration + "ms"))
            .addClass(cls);

        if (!animationend) {
            requestAnimationFrame(function () { return Animation$$1.cancel(element); });
        }

        function reset() {
            element.css('animation-duration', '').removeClass(cls);
        }

    });

}

var Animation$$1 = {

    in: function in$1(element, animation, duration, origin) {
        return animate$$1(element, animation, duration, origin, false);
    },

    out: function out(element, animation, duration, origin) {
        return animate$$1(element, animation, duration, origin, true);
    },

    inProgress: function inProgress(element) {
        return $__default(element).hasClass('uk-animation-enter') || $__default(element).hasClass('uk-animation-leave');
    },

    cancel: function cancel(element) {
        $trigger$$1(element, animationend || 'animationend', [true], true);
        return promise$$1.resolve();
    }

};

function isJQuery$$1(obj) {
    return obj instanceof $__default;
}

function isWithin$$1(element, selector) {
    element = $__default(element);
    return element.is(selector)
        ? true
        : isString$$1(selector)
            ? element.parents(selector).length
            : toNode$$1(selector).contains(element[0]);
}

function attrFilter$$1(element, attr, pattern, replacement) {
    element = $__default(element);
    return element.attr(attr, function (i, value) { return value ? value.replace(pattern, replacement) : value; });
}

function removeClass$$1(element, cls) {
    return attrFilter$$1(element, 'class', new RegExp(("(^|\\s)" + cls + "(?!\\S)"), 'g'), '');
}

function createEvent$$1(e, bubbles, cancelable, data) {
    if ( bubbles === void 0 ) bubbles = true;
    if ( cancelable === void 0 ) cancelable = false;
    if ( data === void 0 ) data = false;

    if (isString$$1(e)) {
        var event = document.createEvent('Event');
        event.initEvent(e, bubbles, cancelable);
        e = event;
    }

    if (data) {
        assign$$1(e, data);
    }

    return e;
}

function isInView$$1(element, offsetTop$$1, offsetLeft) {
    if ( offsetTop$$1 === void 0 ) offsetTop$$1 = 0;
    if ( offsetLeft === void 0 ) offsetLeft = 0;


    var rect = toNode$$1(element).getBoundingClientRect();

    return rect.bottom >= -1 * offsetTop$$1
        && rect.right >= -1 * offsetLeft
        && rect.top <= window.innerHeight + offsetTop$$1
        && rect.left <= window.innerWidth + offsetLeft;
}

function scrolledOver$$1(element) {

    element = toNode$$1(element);

    var height = element.offsetHeight,
        top = positionTop(element),
        vp = window.innerHeight,
        vh = vp + Math.min(0, top - vp),
        diff = Math.max(0, vp - (docHeight$$1() - (top + height)));

    return clamp$$1(((vh + window.pageYOffset - top) / ((vh + (height - (diff < vp ? diff : 0)) ) / 100)) / 100);
}

function positionTop(element) {
    var top = 0;

    do {

        top += element.offsetTop;

    } while (element = element.offsetParent);

    return top;
}

function docHeight$$1() {
    return Math.max(docEl.offsetHeight, docEl.scrollHeight);
}

function getIndex$$1(index, elements, current) {
    if ( current === void 0 ) current = 0;


    elements = $__default(elements);

    var length = $__default(elements).length;

    index = (isNumber$$1(index)
        ? index
        : index === 'next'
            ? current + 1
            : index === 'previous'
                ? current - 1
                : isString$$1(index)
                    ? parseInt(index, 10)
                    : elements.index(index)
    ) % length;

    return index < 0 ? index + length : index;
}

var voidElements = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    menuitem: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
};
function isVoidElement$$1(element) {
    return voidElements[toNode$$1(element).tagName.toLowerCase()];
}

var Dimensions$$1 = {

    ratio: function ratio(dimensions, prop, value) {

        var aProp = prop === 'width' ? 'height' : 'width';

        return ( obj = {}, obj[aProp] = Math.round(value * dimensions[aProp] / dimensions[prop]), obj[prop] = value, obj );
        var obj;
    },

    contain: function contain(dimensions, maxDimensions) {
        var this$1 = this;

        dimensions = assign$$1({}, dimensions);

        $.each(dimensions, function (prop) { return dimensions = dimensions[prop] > maxDimensions[prop] ? this$1.ratio(dimensions, prop, maxDimensions[prop]) : dimensions; });

        return dimensions;
    },

    cover: function cover(dimensions, maxDimensions) {
        var this$1 = this;

        dimensions = this.contain(dimensions, maxDimensions);

        $.each(dimensions, function (prop) { return dimensions = dimensions[prop] < maxDimensions[prop] ? this$1.ratio(dimensions, prop, maxDimensions[prop]) : dimensions; });

        return dimensions;
    }

};

function query$$1(selector, context) {
    var selectors = getContextSelectors$$1(selector);
    return selectors ? selectors.reduce(function (context, selector) { return toJQuery$$1(selector, context); }, context) : toJQuery$$1(selector);
}

function preventClick$$1() {

    var timer = setTimeout(function () { return trigger$$1(doc$$1, 'click'); }, 0);

    one$$1(doc$$1, 'click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        clearTimeout(timer);
    }, true);

}

function getData$$1(el, attribute) {
    el = toNode$$1(el);
    for (var i = 0, attrs = [attribute, ("data-" + attribute)]; i < attrs.length; i++) {
        if (el.hasAttribute(attrs[i])) {
            return el.getAttribute(attrs[i]);
        }
    }
}

function bind$$1(fn, context) {
    return function (a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(context, arguments) : fn.call(context, a) : fn.call(context);
    };
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn$$1(obj, key) {
    return hasOwnProperty.call(obj, key);
}

function promise$$1(executor) {

    if (hasPromise) {
        return new Promise(executor);
    }

    var def = $__default.Deferred();

    executor(def.resolve, def.reject);

    return def;
}

promise$$1.resolve = function (value) {
    return promise$$1(function (resolve) {
        resolve(value);
    });
};

promise$$1.reject = function (value) {
    return promise$$1(function (_, reject) {
        reject(value);
    });
};

promise$$1.all = function (iterable) {
    return hasPromise
        ? Promise.all(iterable)
        : $__default.when.apply($__default, iterable);
};

function classify$$1(str) {
    return str.replace(/(?:^|[-_\/])(\w)/g, function (_, c) { return c ? c.toUpperCase() : ''; });
}

function hyphenate$$1(str) {
    return str
        .replace(/([a-z\d])([A-Z])/g, '$1-$2')
        .toLowerCase()
}

var camelizeRE = /-(\w)/g;
function camelize$$1(str) {
    return str.replace(camelizeRE, toUpper)
}

function toUpper(_, c) {
    return c ? c.toUpperCase() : ''
}

var isArray$$1 = Array.isArray;

function isFunction$$1(obj) {
    return typeof obj === 'function';
}

function isObject$$1(obj) {
    return obj !== null && typeof obj === 'object';
}

function isPlainObject$$1(obj) {
    return isObject$$1(obj) && Object.getPrototypeOf(obj) === Object.prototype;
}

function isBoolean$$1(value) {
    return typeof value === 'boolean';
}

function isString$$1(value) {
    return typeof value === 'string';
}

function isNumber$$1(value) {
    return typeof value === 'number';
}

function isUndefined$$1(value) {
    return value === undefined;
}

function isContextSelector$$1(selector) {
    return isString$$1(selector) && selector.match(/^[!>+-]/);
}

function getContextSelectors$$1(selector) {
    return isContextSelector$$1(selector) && selector.split(/(?=\s[!>+-])/g).map(function (value) { return value.trim(); });
}

var contextSelectors = {'!': 'closest', '+': 'nextAll', '-': 'prevAll'};
function toJQuery$$1(element, context) {

    if (element === true) {
        return null;
    }

    try {

        if (context && isContextSelector$$1(element) && element[0] !== '>') {

            var fn = contextSelectors[element[0]], selector = element.substr(1);

            context = $__default(context);

            if (fn === 'closest') {
                context = context.parent();
                selector = selector || '*';
            }

            element = context[fn](selector);

        } else {
            element = $__default(element, context);
        }

    } catch (e) {
        return null;
    }

    return element.length ? element : null;
}

function toNode$$1(element) {
    return element && (isJQuery$$1(element) ? element[0] : element);
}

function toBoolean$$1(value) {
    return isBoolean$$1(value)
        ? value
        : value === 'true' || value === '1' || value === ''
            ? true
            : value === 'false' || value === '0'
                ? false
                : value;
}

function toNumber$$1(value) {
    var number = Number(value);
    return !isNaN(number) ? number : false;
}

function toList$$1(value) {
    return isArray$$1(value)
        ? value
        : isString$$1(value)
            ? value.split(',').map(function (value) { return $.isNumeric(value)
                ? toNumber$$1(value)
                : toBoolean$$1(value.trim()); })
            : [value];
}

var vars = {};
function toMedia$$1(value) {

    if (isString$$1(value)) {
        if (value[0] === '@') {
            var name = "media-" + (value.substr(1));
            value = vars[name] || (vars[name] = parseFloat(getCssVar(name)));
        } else if (isNaN(value)) {
            return value;
        }
    }

    return value && !isNaN(value) ? ("(min-width: " + value + "px)") : false;
}

function coerce$$1(type, value, context) {

    if (type === Boolean) {
        return toBoolean$$1(value);
    } else if (type === Number) {
        return toNumber$$1(value);
    } else if (type === 'jQuery') {
        return query$$1(value, context);
    } else if (type === 'list') {
        return toList$$1(value);
    } else if (type === 'media') {
        return toMedia$$1(value);
    }

    return type ? type(value) : value;
}

function toMs$$1(time) {
    return !time
        ? 0
        : time.substr(-2) === 'ms'
            ? parseFloat(time)
            : parseFloat(time) * 1000;
}

function swap$$1(value, a, b) {
    return value.replace(new RegExp((a + "|" + b), 'mg'), function (match) {
        return match === a ? b : a
    });
}

var assign$$1 = Object.assign || function (target) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    target = Object(target);
    for (var i = 0; i < args.length; i++) {
        var source = args[i];
        if (source !== null) {
            for (var key in source) {
                if (hasOwn$$1(source, key)) {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
};

function clamp$$1(number, min, max) {
    if ( min === void 0 ) min = 0;
    if ( max === void 0 ) max = 1;

    return Math.min(Math.max(number, min), max);
}

function noop$$1() {}

var Observer = window.MutationObserver || window.WebKitMutationObserver;
var requestAnimationFrame = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 1000 / 60); };

var hasTouchEvents = 'ontouchstart' in window;
var hasPointerEvents = window.PointerEvent;
var hasPromise = 'Promise' in window;
var hasTouch = 'ontouchstart' in window
    || window.DocumentTouch && document instanceof DocumentTouch
    || navigator.msPointerEnabled && navigator.msMaxTouchPoints // IE 10
    || navigator.pointerEnabled && navigator.maxTouchPoints; // IE >=11

var pointerDown = !hasTouch ? 'mousedown' : ("mousedown " + (hasTouchEvents ? 'touchstart' : 'pointerdown'));
var pointerMove = !hasTouch ? 'mousemove' : ("mousemove " + (hasTouchEvents ? 'touchmove' : 'pointermove'));
var pointerUp = !hasTouch ? 'mouseup' :  ("mouseup " + (hasTouchEvents ? 'touchend' : 'pointerup'));
var pointerEnter = hasTouch && hasPointerEvents ? 'pointerenter' : 'mouseenter';
var pointerLeave = hasTouch && hasPointerEvents ? 'pointerleave' : 'mouseleave';

var transitionend = prefix('transition', 'transition-end');
var animationstart = prefix('animation', 'animation-start');
var animationend = prefix('animation', 'animation-end');

function getStyle(element, property, pseudoElt) {
    return (window.getComputedStyle(toNode$$1(element), pseudoElt) || {})[property];
}

function getCssVar(name) {

    /* usage in css:  .var-name:before { content:"xyz" } */

    var val, doc = document.documentElement,
        element = doc.appendChild(document.createElement('div'));

    element.classList.add(("var-" + name));

    try {

        val = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');
        val = JSON.parse(val);

    } catch (e) {}

    doc.removeChild(element);

    return val || undefined;
}

function getImage(src) {

    return promise$$1(function (resolve, reject) {
        var img = new Image();

        img.onerror = reject;
        img.onload = function () { return resolve(img); };

        img.src = src;
    });

}

function prefix(name, event) {

    var ucase = classify$$1(name),
        lowered = classify$$1(event).toLowerCase(),
        classified = classify$$1(event),
        element = document.body || document.documentElement,
        names = ( obj = {}, obj[name] = lowered, obj[("Webkit" + ucase)] = ("webkit" + classified), obj[("Moz" + ucase)] = lowered, obj[("o" + ucase)] = ("o" + classified + " o" + lowered), obj );
    var obj;

    for (name in names) {
        if (element.style[name] !== undefined) {
            return names[name];
        }
    }
}

/*
    Based on:
    Copyright (c) 2016 Wilson Page wilsonpage@me.com
    https://github.com/wilsonpage/fastdom
*/

var fastdom$$1 = {

    reads: [],
    writes: [],

    measure: function measure(task) {
        this.reads.push(task);
        scheduleFlush();
        return task;
    },

    mutate: function mutate(task) {
        this.writes.push(task);
        scheduleFlush();
        return task;
    },

    clear: function clear(task) {
        return remove(this.reads, task) || remove(this.writes, task);
    },

    flush: function flush() {

        runTasks(this.reads);
        runTasks(this.writes.splice(0, this.writes.length));

        this.scheduled = false;

        if (this.reads.length || this.writes.length) {
            scheduleFlush();
        }

    }

};

function scheduleFlush() {
    if (!fastdom$$1.scheduled) {
        fastdom$$1.scheduled = true;
        requestAnimationFrame(fastdom$$1.flush.bind(fastdom$$1));
    }
}

function runTasks(tasks) {
    var task;
    while (task = tasks.shift()) {
        task();
    }
}

function remove(array, item) {
    var index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}

function MouseTracker$$1() {}

MouseTracker$$1.prototype = {

    positions: [],
    position: null,

    init: function init() {
        var this$1 = this;


        this.positions = [];
        this.position = null;

        var ticking = false;
        this.handler = function (e) {

            if (!ticking) {
                setTimeout(function () {

                    var time = Date.now(), length = this$1.positions.length;
                    if (length && (time - this$1.positions[length - 1].time > 100)) {
                        this$1.positions.splice(0, length);
                    }

                    this$1.positions.push({time: time, x: e.pageX, y: e.pageY});

                    if (this$1.positions.length > 5) {
                        this$1.positions.shift();
                    }

                    ticking = false;
                }, 5);
            }

            ticking = true;
        };

        doc$$1.on('mousemove', this.handler);

    },

    cancel: function cancel() {
        if (this.handler) {
            doc$$1.off('mousemove', this.handler);
        }
    },

    movesTo: function movesTo(target) {

        if (this.positions.length < 2) {
            return false;
        }

        var p = getDimensions$$1(target),
            position$$1 = this.positions[this.positions.length - 1],
            prevPos = this.positions[0];

        if (p.left <= position$$1.x && position$$1.x <= p.right && p.top <= position$$1.y && position$$1.y <= p.bottom) {
            return false;
        }

        var points = [
            [{x: p.left, y: p.top}, {x: p.right, y: p.bottom}],
            [{x: p.right, y: p.top}, {x: p.left, y: p.bottom}]
        ];

        if (p.right <= position$$1.x) {

        } else if (p.left >= position$$1.x) {
            points[0].reverse();
            points[1].reverse();
        } else if (p.bottom <= position$$1.y) {
            points[0].reverse();
        } else if (p.top >= position$$1.y) {
            points[1].reverse();
        }

        return !!points.reduce(function (result, point) {
            return result + (slope(prevPos, point[0]) < slope(position$$1, point[0]) && slope(prevPos, point[1]) > slope(position$$1, point[1]));
        }, 0);
    }

};

function slope(a, b) {
    return (b.y - a.y) / (b.x - a.x);
}

var strats = {};

// concat strategy
strats.args =
strats.created =
strats.events =
strats.init =
strats.ready =
strats.connected =
strats.disconnected =
strats.destroy = function (parentVal, childVal) {

    parentVal = parentVal && !isArray$$1(parentVal) ? [parentVal] : parentVal;

    return childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : isArray$$1(childVal)
                ? childVal
                : [childVal]
        : parentVal;
};

// update strategy
strats.update = function (parentVal, childVal) {
    return strats.args(parentVal, isFunction$$1(childVal) ? {read: childVal} : childVal);
};

// property strategy
strats.props = function (parentVal, childVal) {

    if (isArray$$1(childVal)) {
        childVal = childVal.reduce(function (value, key) {
            value[key] = String;
            return value;
        }, {});
    }

    return strats.methods(parentVal, childVal);
};

// extend strategy
strats.computed =
strats.defaults =
strats.methods = function (parentVal, childVal) {
    return childVal
        ? parentVal
            ? assign$$1({}, parentVal, childVal)
            : childVal
        : parentVal;
};

// default strategy
var defaultStrat = function (parentVal, childVal) {
    return isUndefined$$1(childVal) ? parentVal : childVal;
};

function mergeOptions$$1(parent, child) {

    var options = {}, key;

    if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
            parent = mergeOptions$$1(parent, child.mixins[i]);
        }
    }

    for (key in parent) {
        mergeKey(key);
    }

    for (key in child) {
        if (!hasOwn$$1(parent, key)) {
            mergeKey(key);
        }
    }

    function mergeKey(key) {
        options[key] = (strats[key] || defaultStrat)(parent[key], child[key]);
    }

    return options;
}

var id = 0;

var Player$$1 = function Player$$1(el) {
    this.id = ++id;
    this.el = toNode$$1(el);
};

Player$$1.prototype.isVideo = function isVideo () {
    return this.isYoutube() || this.isVimeo() || this.isHTML5();
};

Player$$1.prototype.isHTML5 = function isHTML5 () {
    return this.el.tagName === 'VIDEO';
};

Player$$1.prototype.isIFrame = function isIFrame () {
    return this.el.tagName === 'IFRAME';
};

Player$$1.prototype.isYoutube = function isYoutube () {
    return this.isIFrame() && !!this.el.src.match(/\/\/.*?youtube\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/);
};

Player$$1.prototype.isVimeo = function isVimeo () {
    return this.isIFrame() && !!this.el.src.match(/vimeo\.com\/video\/.*/);
};

Player$$1.prototype.enableApi = function enableApi () {
        var this$1 = this;


    if (this.ready) {
        return this.ready;
    }

    var youtube = this.isYoutube(), vimeo = this.isVimeo(), poller;

    if (youtube || vimeo) {

        return this.ready = promise$$1(function (resolve) {

            one$$1(this$1.el, 'load', function () {
                if (youtube) {
                    var listener = function () { return post(this$1.el, {event: 'listening', id: this$1.id}); };
                    poller = setInterval(listener, 100);
                    listener();
                }
            });

            listen(function (data) { return youtube && data.id === this$1.id && data.event === 'onReady' || vimeo && Number(data.player_id) === this$1.id; })
                .then(function () {
                    resolve();
                    poller && clearInterval(poller);
                });

            this$1.el.setAttribute('src', ("" + (this$1.el.src) + (~this$1.el.src.indexOf('?') ? '&' : '?') + (youtube ? 'enablejsapi=1' : ("api=1&player_id=" + id))));

        });

    }

    return promise$$1.resolve();

};

Player$$1.prototype.play = function play () {
        var this$1 = this;


    if (!this.isVideo()) {
        return;
    }

    if (this.isIFrame()) {
        this.enableApi().then(function () { return post(this$1.el, {func: 'playVideo', method: 'play'}); });
    } else if (this.isHTML5()) {
        this.el.play();
    }
};

Player$$1.prototype.pause = function pause () {
        var this$1 = this;


    if (!this.isVideo()) {
        return;
    }

    if (this.isIFrame()) {
        this.enableApi().then(function () { return post(this$1.el, {func: 'pauseVideo', method: 'pause'}); });
    } else if (this.isHTML5()) {
        this.el.pause();
    }
};

Player$$1.prototype.mute = function mute () {
        var this$1 = this;


    if (!this.isVideo()) {
        return;
    }

    if (this.isIFrame()) {
        this.enableApi().then(function () { return post(this$1.el, {func: 'mute', method: 'setVolume', value: 0}); });
    } else if (this.isHTML5()) {
        this.el.muted = true;
        this.el.setAttribute('muted', '');
    }

};

function post(el, cmd) {
    try {
        el.contentWindow.postMessage(JSON.stringify(assign$$1({event: 'command'}, cmd)), '*');
    } catch (e) {}
}

function listen(cb) {

    return promise$$1(function (resolve) {

        one$$1(window, 'message', function (_, data) { return resolve(data); }, false, function (ref) {
            var data = ref.data;


            if (!data || !isString$$1(data)) {
                return;
            }

            try {
                data = JSON.parse(data);
            } catch(err) {
                return;
            }

            return data && cb(data);

        });

    });

}

var dirs = {
        x: ['width', 'left', 'right'],
        y: ['height', 'top', 'bottom']
    };
var docEl$1 = document.documentElement;

function position$$1(element, target, elAttach, targetAttach, elOffset, targetOffset, flip, boundary) {

    elAttach = getPos(elAttach);
    targetAttach = getPos(targetAttach);

    var flipped = {element: elAttach, target: targetAttach};

    if (!element) {
        return flipped;
    }

    var dim = getDimensions$$1(element),
        targetDim = getDimensions$$1(target),
        position$$1 = targetDim;

    moveTo(position$$1, elAttach, dim, -1);
    moveTo(position$$1, targetAttach, targetDim, 1);

    elOffset = getOffsets(elOffset, dim.width, dim.height);
    targetOffset = getOffsets(targetOffset, targetDim.width, targetDim.height);

    elOffset['x'] += targetOffset['x'];
    elOffset['y'] += targetOffset['y'];

    position$$1.left += elOffset['x'];
    position$$1.top += elOffset['y'];

    boundary = getDimensions$$1(boundary || window);

    if (flip) {
        $.each(dirs, function (dir, ref) {
            var prop = ref[0];
            var align = ref[1];
            var alignFlip = ref[2];


            if (!(flip === true || ~flip.indexOf(dir))) {
                return;
            }

            var elemOffset = elAttach[dir] === align
                    ? -dim[prop]
                    : elAttach[dir] === alignFlip
                        ? dim[prop]
                        : 0,
                targetOffset = targetAttach[dir] === align
                    ? targetDim[prop]
                    : targetAttach[dir] === alignFlip
                        ? -targetDim[prop]
                        : 0;

            if (position$$1[align] < boundary[align] || position$$1[align] + dim[prop] > boundary[alignFlip]) {

                var centerOffset = dim[prop] / 2,
                    centerTargetOffset = targetAttach[dir] === 'center' ? -targetDim[prop] / 2 : 0;

                elAttach[dir] === 'center' && (
                    apply(centerOffset, centerTargetOffset)
                    || apply(-centerOffset, -centerTargetOffset)
                ) || apply(elemOffset, targetOffset);

            }

            function apply(elemOffset, targetOffset) {

                var newVal = position$$1[align] + elemOffset + targetOffset - elOffset[dir] * 2;

                if (newVal >= boundary[align] && newVal + dim[prop] <= boundary[alignFlip]) {
                    position$$1[align] = newVal;

                    ['element', 'target'].forEach(function (el) {
                        flipped[el][dir] = !elemOffset
                            ? flipped[el][dir]
                            : flipped[el][dir] === dirs[dir][1]
                                ? dirs[dir][2]
                                : dirs[dir][1];
                    });

                    return true;
                }

            }

        });
    }

    offset$$1(element, position$$1);

    return flipped;
}

function getDimensions$$1(element) {

    element = toNode$$1(element);

    var window = getWindow(element), top = window.pageYOffset, left = window.pageXOffset;

    if (!element.ownerDocument) {
        return {
            top: top,
            left: left,
            height: window.innerHeight,
            width: window.innerWidth,
            bottom: top + window.innerHeight,
            right: left + window.innerWidth,
        }
    }

    var display = false;
    if (!element.offsetHeight) {
        display = element.style.display;
        element.style.display = 'block';
    }

    var rect = element.getBoundingClientRect();

    if (display !== false) {
        element.style.display = display;
    }

    return {
        height: rect.height,
        width: rect.width,
        top: rect.top + top,
        left: rect.left + left,
        bottom: rect.bottom + top,
        right: rect.right + left,
    }
}

function offset$$1(element, ref) {
    var left = ref.left;
    var top = ref.top;

    $__default(element).offset({left: left - docEl$1.clientLeft, top: top - docEl$1.clientTop});
}

function offsetTop$$1(element) {
    element = toNode$$1(element);
    return element.getBoundingClientRect().top + getWindow(element).pageYOffset;
}

function getWindow(element) {
    return element && element.ownerDocument ? element.ownerDocument.defaultView : window;
}

function moveTo(position$$1, attach, dim, factor) {
    $.each(dirs, function (dir, ref) {
        var prop = ref[0];
        var align = ref[1];
        var alignFlip = ref[2];

        if (attach[dir] === alignFlip) {
            position$$1[align] += dim[prop] * factor;
        } else if (attach[dir] === 'center') {
            position$$1[align] += dim[prop] * factor / 2;
        }
    });
}

function getPos(pos) {

    var x = /left|center|right/, y = /top|center|bottom/;

    pos = (pos || '').split(' ');

    if (pos.length === 1) {
        pos = x.test(pos[0])
            ? pos.concat(['center'])
            : y.test(pos[0])
                ? ['center'].concat(pos)
                : ['center', 'center'];
    }

    return {
        x: x.test(pos[0]) ? pos[0] : 'center',
        y: y.test(pos[1]) ? pos[1] : 'center'
    };
}

function getOffsets(offsets, width, height) {

    offsets = (offsets || '').split(' ');

    return {
        x: offsets[0] ? parseFloat(offsets[0]) * (offsets[0][offsets[0].length - 1] === '%' ? width / 100 : 1) : 0,
        y: offsets[1] ? parseFloat(offsets[1]) * (offsets[1][offsets[1].length - 1] === '%' ? height / 100 : 1) : 0
    };
}

function flipPosition$$1(pos) {
    switch (pos) {
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        default:
            return pos;
    }
}

/*
    Based on:
    Copyright (c) 2010-2016 Thomas Fuchs
    http://zeptojs.com/
*/

var touch = {};
var clickTimeout;
var swipeTimeout;
var tapTimeout;
var clicked;

function swipeDirection(ref) {
    var x1 = ref.x1;
    var x2 = ref.x2;
    var y1 = ref.y1;
    var y2 = ref.y2;

    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
}

function cancelAll() {
    clickTimeout && clearTimeout(clickTimeout);
    swipeTimeout && clearTimeout(swipeTimeout);
    tapTimeout && clearTimeout(tapTimeout);
    clickTimeout = swipeTimeout = tapTimeout = null;
    touch = {};
}

ready$$1(function () {

    on$$1(document, 'click', function () { return clicked = true; }, true);

    on$$1(document, pointerDown, function (e) {

        var ref = e.touches ? e.touches[0] : e;
        var target = ref.target;
        var pageX = ref.pageX;
        var pageY = ref.pageY;
        var now = Date.now();

        touch.el = 'tagName' in target ? target : target.parentNode;

        clickTimeout && clearTimeout(clickTimeout);

        touch.x1 = pageX;
        touch.y1 = pageY;

        if (touch.last && now - touch.last <= 250) {
            touch = {};
        }

        touch.last = now;

        clicked = e.button > 0;

    });

    on$$1(document, pointerMove, function (e) {

        var ref = e.touches ? e.touches[0] : e;
        var pageX = ref.pageX;
        var pageY = ref.pageY;

        touch.x2 = pageX;
        touch.y2 = pageY;
    });

    on$$1(document, pointerUp, function (ref) {
        var target = ref.target;


        // swipe
        if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) {

            swipeTimeout = setTimeout(function () {
                if (touch.el) {
                    trigger$$1(touch.el, 'swipe');
                    trigger$$1(touch.el, ("swipe" + (swipeDirection(touch))));
                }
                touch = {};
            });

        // normal tap
        } else if ('last' in touch) {

            tapTimeout = setTimeout(function () { return touch.el && trigger$$1(touch.el, 'tap'); });

            // trigger single click after 350ms of inactivity
            if (touch.el && isWithin$$1(target, touch.el)) {
                clickTimeout = setTimeout(function () {
                    clickTimeout = null;
                    if (touch.el && !clicked) {
                        trigger$$1(touch.el, 'click');
                    }
                    touch = {};
                }, 350);
            }

        } else {
            touch = {};
        }
    });

    on$$1(document, 'touchcancel', cancelAll);
    on$$1(window, 'scroll', cancelAll);
});

var touching = false;
on$$1(document, 'touchstart', function () { return touching = true; }, true);
on$$1(document, 'click', function () {touching = false;});
on$$1(document, 'touchcancel', function () { return touching = false; }, true);

function isTouch$$1(e) {
    return touching || (e.originalEvent || e).pointerType === 'touch';
}



var util = Object.freeze({
	win: win$$1,
	doc: doc$$1,
	docElement: docElement$$1,
	isRtl: isRtl$$1,
	isReady: isReady$$1,
	ready: ready$$1,
	on: on$$1,
	off: off$$1,
	one: one$$1,
	trigger: trigger$$1,
	$trigger: $trigger$$1,
	transition: transition$$1,
	Transition: Transition$$1,
	animate: animate$$1,
	Animation: Animation$$1,
	isJQuery: isJQuery$$1,
	isWithin: isWithin$$1,
	attrFilter: attrFilter$$1,
	removeClass: removeClass$$1,
	createEvent: createEvent$$1,
	isInView: isInView$$1,
	scrolledOver: scrolledOver$$1,
	docHeight: docHeight$$1,
	getIndex: getIndex$$1,
	isVoidElement: isVoidElement$$1,
	Dimensions: Dimensions$$1,
	query: query$$1,
	preventClick: preventClick$$1,
	getData: getData$$1,
	Observer: Observer,
	requestAnimationFrame: requestAnimationFrame,
	hasPromise: hasPromise,
	hasTouch: hasTouch,
	pointerDown: pointerDown,
	pointerMove: pointerMove,
	pointerUp: pointerUp,
	pointerEnter: pointerEnter,
	pointerLeave: pointerLeave,
	transitionend: transitionend,
	animationstart: animationstart,
	animationend: animationend,
	getStyle: getStyle,
	getCssVar: getCssVar,
	getImage: getImage,
	fastdom: fastdom$$1,
	$: $__default,
	bind: bind$$1,
	hasOwn: hasOwn$$1,
	promise: promise$$1,
	classify: classify$$1,
	hyphenate: hyphenate$$1,
	camelize: camelize$$1,
	isArray: isArray$$1,
	isFunction: isFunction$$1,
	isObject: isObject$$1,
	isPlainObject: isPlainObject$$1,
	isBoolean: isBoolean$$1,
	isString: isString$$1,
	isNumber: isNumber$$1,
	isUndefined: isUndefined$$1,
	isContextSelector: isContextSelector$$1,
	getContextSelectors: getContextSelectors$$1,
	toJQuery: toJQuery$$1,
	toNode: toNode$$1,
	toBoolean: toBoolean$$1,
	toNumber: toNumber$$1,
	toList: toList$$1,
	toMedia: toMedia$$1,
	coerce: coerce$$1,
	toMs: toMs$$1,
	swap: swap$$1,
	assign: assign$$1,
	clamp: clamp$$1,
	noop: noop$$1,
	ajax: $.ajax,
	each: $.each,
	Event: $.Event,
	isNumeric: $.isNumeric,
	MouseTracker: MouseTracker$$1,
	mergeOptions: mergeOptions$$1,
	Player: Player$$1,
	position: position$$1,
	getDimensions: getDimensions$$1,
	offset: offset$$1,
	offsetTop: offsetTop$$1,
	flipPosition: flipPosition$$1,
	isTouch: isTouch$$1
});

var globalAPI = function (UIkit) {

    var DATA = UIkit.data;

    UIkit.use = function (plugin) {

        if (plugin.installed) {
            return;
        }

        plugin.call(null, this);
        plugin.installed = true;

        return this;
    };

    UIkit.mixin = function (mixin, component) {
        component = (isString$$1(component) ? UIkit.components[component] : component) || this;
        mixin = mergeOptions$$1({}, mixin);
        mixin.mixins = component.options.mixins;
        delete component.options.mixins;
        component.options = mergeOptions$$1(mixin, component.options);
    };

    UIkit.extend = function (options) {

        options = options || {};

        var Super = this, name = options.name || Super.options.name;
        var Sub = createClass(name || 'UIkitComponent');

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions$$1(Super.options, options);

        Sub['super'] = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

    UIkit.update = function (e, element, parents) {
        if ( parents === void 0 ) parents = false;


        e = createEvent$$1(e || 'update');

        if (!element) {

            update(UIkit.instances, e);
            return;

        }

        element = toNode$$1(element);

        if (parents) {

            do {

                update(element[DATA], e);
                element = element.parentNode;

            } while (element)

        } else {

            apply(element, function (element) { return update(element[DATA], e); });

        }

    };

    var container;
    Object.defineProperty(UIkit, 'container', {

        get: function get() {
            return container || document.body;
        },

        set: function set(element) {
            container = element;
        }

    });

    function createClass(name) {
        return new Function(("return function " + (classify$$1(name)) + " (options) { this._init(options); }"))();
    }

    function apply(node, fn) {

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        fn(node);
        node = node.firstChild;
        while (node) {
            apply(node, fn);
            node = node.nextSibling;
        }
    }

    function update(data, e) {

        if (!data) {
            return;
        }

        for (var name in data) {
            if (data[name]._isReady) {
                data[name]._callUpdate(e);
            }
        }

    }

};

var hooksAPI = function (UIkit) {

    UIkit.prototype._callHook = function (hook) {
        var this$1 = this;


        var handlers = this.$options[hook];

        if (handlers) {
            handlers.forEach(function (handler) { return handler.call(this$1); });
        }
    };

    UIkit.prototype._callReady = function () {

        if (this._isReady) {
            return;
        }

        this._isReady = true;
        this._callHook('ready');
        this._callUpdate();
    };

    UIkit.prototype._callConnected = function () {
        var this$1 = this;


        if (this._connected) {
            return;
        }

        if (!~UIkit.elements.indexOf(this.$options.el)) {
            UIkit.elements.push(this.$options.el);
        }

        UIkit.instances[this._uid] = this;

        this._initEvents();

        this._callHook('connected');
        this._connected = true;

        this._initObserver();

        if (!this._isReady) {
            ready$$1(function () { return this$1._callReady(); });
        }

        this._callUpdate();
    };

    UIkit.prototype._callDisconnected = function () {

        if (!this._connected) {
            return;
        }

        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }

        var index = UIkit.elements.indexOf(this.$options.el);

        if (~index) {
            UIkit.elements.splice(index, 1);
        }

        delete UIkit.instances[this._uid];

        this._initEvents(true);
        this._callHook('disconnected');

        this._connected = false;

    };

    UIkit.prototype._callUpdate = function (e) {
        var this$1 = this;


        e = createEvent$$1(e || 'update');

        if (e.type === 'update') {
            this._computeds = {};
        }

        var updates = this.$options.update;

        if (!updates) {
            return;
        }

        updates.forEach(function (update, i) {

            if (e.type !== 'update' && (!update.events || !~update.events.indexOf(e.type))) {
                return;
            }

            if (update.read && !~fastdom$$1.reads.indexOf(this$1._frames.reads[i])) {
                this$1._frames.reads[i] = fastdom$$1.measure(function () {
                    update.read.call(this$1, e);
                    delete this$1._frames.reads[i];
                });
            }

            if (update.write && !~fastdom$$1.writes.indexOf(this$1._frames.writes[i])) {
                this$1._frames.writes[i] = fastdom$$1.mutate(function () {
                    update.write.call(this$1, e);
                    delete this$1._frames.writes[i];
                });
            }

        });

    };

};

var stateAPI = function (UIkit) {

    var uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions$$1(this.constructor.options, options, this);

        this.$el = null;
        this.$name = UIkit.prefix + hyphenate$$1(this.$options.name);
        this.$props = {};

        this._frames = {reads: {}, writes: {}};

        this._uid = uid++;
        this._initData();
        this._initMethods();
        this._initComputeds();
        this._callHook('created');

        if (options.el) {
            this.$mount(options.el);
        }
    };

    UIkit.prototype._initData = function () {
        var this$1 = this;


        var ref = this.$options;
        var defaults = ref.defaults;
        var data = ref.data; if ( data === void 0 ) data = {};
        var args = ref.args; if ( args === void 0 ) args = [];
        var props = ref.props; if ( props === void 0 ) props = {};
        var el = ref.el;

        if (args.length && isArray$$1(data)) {
            data = data.slice(0, args.length).reduce(function (data, value, index) {
                if (isPlainObject$$1(value)) {
                    assign$$1(data, value);
                } else {
                    data[args[index]] = value;
                }
                return data;
            }, {});
        }

        for (var key in defaults) {
            this$1.$props[key] = this$1[key] = hasOwn$$1(data, key) && !isUndefined$$1(data[key])
                ? coerce$$1(props[key], data[key], el)
                : isArray$$1(defaults[key])
                    ? defaults[key].concat()
                    : defaults[key];
        }
    };

    UIkit.prototype._initMethods = function () {
        var this$1 = this;


        var methods = this.$options.methods;

        if (methods) {
            for (var key in methods) {
                this$1[key] = bind$$1(methods[key], this$1);
            }
        }
    };

    UIkit.prototype._initComputeds = function () {
        var this$1 = this;


        var computed = this.$options.computed;

        this._computeds = {};

        if (computed) {
            for (var key in computed) {
                registerComputed(this$1, key, computed[key]);
            }
        }
    };

    UIkit.prototype._initProps = function (props) {
        var this$1 = this;


        this._computeds = {};
        assign$$1(this.$props, props || getProps(this.$options, this.$name));

        var exclude = [this.$options.computed, this.$options.methods];
        for (var key in this$1.$props) {
            if (notIn(exclude, key)) {
                this$1[key] = this$1.$props[key];
            }
        }
    };

    UIkit.prototype._initEvents = function (unbind) {
        var this$1 = this;


        var events = this.$options.events;

        if (events) {

            events.forEach(function (event) {

                if (!hasOwn$$1(event, 'handler')) {
                    for (var key in event) {
                        registerEvent(this$1, unbind, event[key], key);
                    }
                } else {
                    registerEvent(this$1, unbind, event);
                }

            });
        }
    };

    UIkit.prototype._initObserver = function () {
        var this$1 = this;


        var ref = this.$options;
        var attrs = ref.attrs;
        var props = ref.props;
        var el = ref.el;
        if (this._observer || !props || !attrs || !Observer) {
            return;
        }

        attrs = isArray$$1(attrs) ? attrs : Object.keys(props).map(function (key) { return hyphenate$$1(key); });

        this._observer = new Observer(function () {

            var data = getProps(this$1.$options, this$1.$name);
            if (attrs.some(function (key) { return !equals(data[key], this$1.$props[key]); })) {
                this$1.$reset(data);
            }

        });

        this._observer.observe(el, {attributes: true, attributeFilter: attrs.concat([this.$name, ("data-" + (this.$name))])});
    };

    function getProps(opts, name) {

        var data = {};
        var args = opts.args; if ( args === void 0 ) args = [];
        var props = opts.props; if ( props === void 0 ) props = {};
        var el = opts.el;
        var key, prop;

        if (!props) {
            return data;
        }

        for (key in props) {
            prop = hyphenate$$1(key);
            if (el.hasAttribute(prop)) {

                var value = coerce$$1(props[key], el.getAttribute(prop), el);

                if (prop === 'target' && (!value || value.lastIndexOf('_', 0) === 0)) {
                    continue;
                }

                data[key] = value;
            }
        }

        var options = parseOptions(getData$$1(el, name), args);

        for (key in options) {
            prop = camelize$$1(key);
            if (props[prop] !== undefined) {
                data[prop] = coerce$$1(props[prop], options[key], el);
            }
        }

        return data;
    }

    function parseOptions(options, args) {
        if ( args === void 0 ) args = [];


        try {

            return !options
                ? {}
                : options[0] === '{'
                    ? JSON.parse(options)
                    : args.length && !~options.indexOf(':')
                        ? (( obj = {}, obj[args[0]] = options, obj ))
                        : options.split(';').reduce(function (options, option) {
                            var ref = option.split(/:(.+)/);
                            var key = ref[0];
                            var value = ref[1];
                            if (key && value) {
                                options[key.trim()] = value.trim();
                            }
                            return options;
                        }, {});
            var obj;

        } catch (e) {
            return {};
        }

    }

    function registerComputed(component, key, cb) {
        Object.defineProperty(component, key, {

            enumerable: true,

            get: function get() {

                if (!hasOwn$$1(component._computeds, key)) {
                    component._computeds[key] = cb.call(component);
                }

                return component._computeds[key];
            },

            set: function set(value) {
                component._computeds[key] = value;
            }

        });
    }

    function registerEvent(component, unbind, event, key) {

        if (!isPlainObject$$1(event)) {
            event = ({name: key, handler: event});
        }

        var name = event.name;
        var el = event.el;
        var delegate = event.delegate;
        var self = event.self;
        var filter = event.filter;
        var handler = event.handler;
        var namespace = "." + (component.$options.name) + "." + (component._uid);

        el = el && el.call(component) || component.$el;

        name = name.split(' ').map(function (name) { return (name + "." + namespace); }).join(' ');

        if (unbind) {

            el.off(name);

        } else {

            if (filter && !filter.call(component)) {
                return;
            }

            handler = isString$$1(handler) ? component[handler] : bind$$1(handler, component);

            if (self) {
                handler = selfFilter(handler, component);
            }

            if (delegate) {
                el.on(name, isString$$1(delegate) ? delegate : delegate.call(component), handler);
            } else {
                el.on(name, handler);
            }
        }

    }

    function selfFilter(handler, context) {
        return function selfHandler(e) {
            if (e.target === e.currentTarget) {
                return handler.call(context, e)
            }
        }
    }

    function notIn(options, key) {
        return options.every(function (arr) { return !arr || !hasOwn$$1(arr, key); });
    }

    function equals(a, b) {
        return isUndefined$$1(a) || a === b || isJQuery$$1(a) && isJQuery$$1(b) && a.is(b);
    }

};

var instanceAPI = function (UIkit) {

    var DATA = UIkit.data;

    UIkit.prototype.$mount = function (el) {

        var name = this.$options.name;

        if (!el[DATA]) {
            el[DATA] = {};
        }

        if (el[DATA][name]) {
            return;
        }

        el[DATA][name] = this;

        this.$options.el = this.$options.el || el;
        this.$el = $__default(el);

        this._initProps();

        this._callHook('init');

        if (document.documentElement.contains(el)) {
            this._callConnected();
        }
    };

    UIkit.prototype.$emit = function (e) {
        this._callUpdate(e);
    };

    UIkit.prototype.$update = function (e, parents) {
        UIkit.update(e, this.$options.el, parents);
    };

    UIkit.prototype.$reset = function (data) {
        this._callDisconnected();
        this._initProps(data);
        this._callConnected();
    };

    UIkit.prototype.$destroy = function (remove) {
        if ( remove === void 0 ) remove = false;


        var ref = this.$options;
        var el = ref.el;
        var name = ref.name;

        if (el) {
            this._callDisconnected();
        }

        this._callHook('destroy');

        if (!el || !el[DATA]) {
            return;
        }

        delete el[DATA][name];

        if (!Object.keys(el[DATA]).length) {
            delete el[DATA];
        }

        if (remove) {
            this.$el.remove();
        }
    };

};

var componentAPI = function (UIkit) {

    var DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (id, options) {

        var name = camelize$$1(id);

        if (isPlainObject$$1(options)) {
            options.name = name;
            options = UIkit.extend(options);
        } else if (isUndefined$$1(options)) {
            return UIkit.components[name]
        } else {
            options.options.name = name;
        }

        UIkit.components[name] = options;

        UIkit[name] = function (element, data) {
            var i = arguments.length, argsArray = Array(i);
            while ( i-- ) argsArray[i] = arguments[i];


            if (isPlainObject$$1(element)) {
                return new UIkit.components[name]({data: element});
            }

            if (UIkit.components[name].options.functional) {
                return new UIkit.components[name]({data: [].concat( argsArray )});
            }

            return element && element.nodeType ? init(element) : $__default(element).toArray().map(init)[0];

            function init(element) {
                return UIkit.getComponent(element, name) || new UIkit.components[name]({el: element, data: data || {}});
            }

        };

        if (UIkit._initialized && !options.options.functional) {
            fastdom$$1.measure(function () { return UIkit[name](("[uk-" + id + "],[data-uk-" + id + "]")); });
        }

        return UIkit.components[name];
    };

    UIkit.getComponents = function (element) { return element && (element = isJQuery$$1(element) ? element[0] : element) && element[DATA] || {}; };
    UIkit.getComponent = function (element, name) { return UIkit.getComponents(element)[name]; };

    UIkit.connect = function (node) {

        var name;

        if (node[DATA]) {
            for (name in node[DATA]) {
                node[DATA][name]._callConnected();
            }
        }

        for (var i = 0; i < node.attributes.length; i++) {

            name = node.attributes[i].name;

            if (name.lastIndexOf('uk-', 0) === 0 || name.lastIndexOf('data-uk-', 0) === 0) {

                name = camelize$$1(name.replace('data-uk-', '').replace('uk-', ''));

                if (UIkit[name]) {
                    UIkit[name](node);
                }
            }
        }

    };

    UIkit.disconnect = function (node) {
        for (var name in node[DATA]) {
            node[DATA][name]._callDisconnected();
        }
    };

};

var supportsMultiple;
var supportsForce;

var classAPI = function (UIkit) {

    UIkit.prototype.$addClass = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        apply(this.$options.el, args, 'add');
    };

    UIkit.prototype.$removeClass = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        apply(this.$options.el, args, 'remove');
    };

    UIkit.prototype.$hasClass = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return (args = getArgs(args, this.$options.el)) && args[0].contains(args[1]);
    };

    UIkit.prototype.$toggleClass = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = getArgs(args, this.$options.el);

        var force = args && !isString$$1(args[args.length - 1]) ? args.pop() : undefined;

        for (var i = 1; i < (args && args.length); i++) {
            args[0] && supportsForce
                ? args[0].toggle(args[i], force)
                : (args[0][(!isUndefined$$1(force) ? force : !args[0].contains(args[i])) ? 'add' : 'remove'](args[i]));
        }
    };

    function apply(el, args, fn) {
        (args = getArgs(args, el)) && (supportsMultiple
            ? args[0][fn].apply(args[0], args.slice(1))
            : args.slice(1).forEach(function (cls) { return args[0][fn](cls); }));
    }

    function getArgs(args, el) {

        isString$$1(args[0]) && args.unshift(el);
        args[0] = (toNode$$1(args[0]) || {}).classList;

        args.forEach(function (arg, i) { return i > 0 && isString$$1(arg) && ~arg.indexOf(' ') && Array.prototype.splice.apply(args, [i, 1].concat(args[i].split(' '))); }
        );

        return args[0] && args[1] && args.length > 1 && args;
    }

};

(function() {

    var list = document.createElement('_').classList;
    if (list) {
        list.add('a', 'b');
        list.toggle('c', false);
        supportsMultiple = list.contains('b');
        supportsForce = !list.contains('c');
    }
    list = null;

})();

var UIkit$1 = function (options) {
    this._init(options);
};

UIkit$1.util = util;
UIkit$1.data = '__uikit__';
UIkit$1.prefix = 'uk-';
UIkit$1.options = {};
UIkit$1.instances = {};
UIkit$1.elements = [];

globalAPI(UIkit$1);
hooksAPI(UIkit$1);
stateAPI(UIkit$1);
instanceAPI(UIkit$1);
componentAPI(UIkit$1);
classAPI(UIkit$1);

var Class = {

    init: function init() {
        this.$addClass(this.$name);
    }

};

var Togglable = {

    props: {
        cls: Boolean,
        animation: 'list',
        duration: Number,
        origin: String,
        transition: String,
        queued: Boolean
    },

    defaults: {
        cls: false,
        animation: [false],
        duration: 200,
        origin: false,
        transition: 'linear',
        queued: false,

        initProps: {
            overflow: '',
            height: '',
            paddingTop: '',
            paddingBottom: '',
            marginTop: '',
            marginBottom: ''
        },

        hideProps: {
            overflow: 'hidden',
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0
        }

    },

    computed: {

        hasAnimation: function hasAnimation() {
            return !!this.animation[0];
        },

        hasTransition: function hasTransition() {
            return this.hasAnimation && this.animation[0] === true;
        }

    },

    methods: {

        toggleElement: function toggleElement(targets, show, animate) {
            var this$1 = this;

            return promise$$1(function (resolve) {

                targets = $__default(targets).toArray();

                var all = function (targets) { return promise$$1.all(targets.map(function (el) { return this$1._toggleElement(el, show, animate); })); },
                    toggled = targets.filter(function (el) { return this$1.isToggled(el); }),
                    untoggled = targets.filter(function (el) { return !~toggled.indexOf(el); }),
                    p;

                if (!this$1.queued || !isUndefined$$1(animate) || !isUndefined$$1(show) || !this$1.hasAnimation || targets.length < 2) {

                    p = all(untoggled.concat(toggled));

                } else {

                    var body = document.body,
                        scroll = body.scrollTop,
                        el = toggled[0],
                        inProgress = Animation$$1.inProgress(el) && this$1.$hasClass(el, 'uk-animation-leave')
                            || Transition$$1.inProgress(el) && el.style.height === '0px';

                    p = all(toggled);

                    if (!inProgress) {
                        p = p.then(function () {
                            var p = all(untoggled);
                            body.scrollTop = scroll;
                            return p;
                        });
                    }

                }

                p.then(resolve, noop$$1);

            });
        },

        toggleNow: function toggleNow(targets, show) {
            var this$1 = this;

            return promise$$1(function (resolve) { return promise$$1.all($__default(targets).toArray().map(function (el) { return this$1._toggleElement(el, show, false); })).then(resolve, noop$$1); });
        },

        isToggled: function isToggled(el) {
            el = el && $__default(el) || this.$el;
            return this.cls ? el.hasClass(this.cls.split(' ')[0]) : !el.attr('hidden');
        },

        updateAria: function updateAria(el) {
            if (this.cls === false) {
                el.attr('aria-hidden', !this.isToggled(el));
            }
        },

        _toggleElement: function _toggleElement(el, show, animate) {
            var this$1 = this;


            el = $__default(el);

            show = isBoolean$$1(show)
                ? show
                : Animation$$1.inProgress(el)
                    ? this.$hasClass(el, 'uk-animation-leave')
                    : Transition$$1.inProgress(el)
                        ? el[0].style.height === '0px'
                        : !this.isToggled(el);

            if ($trigger$$1(el, ("before" + (show ? 'show' : 'hide')), [this]).result === false) {
                return promise$$1.reject();
            }

            var def = (animate === false || !this.hasAnimation
                ? this._toggleImmediate
                : this.hasTransition
                    ? this._toggleHeight
                    : this._toggleAnimation
            )(el, show);

            var e = $.Event(show ? 'show' : 'hide');
            e.preventDefault(); // workaround for Prototype and MooTools: it keeps jQuery from calling show or hide on the Element itself
            $trigger$$1(el, e, [this]);

            return def.then(function () {
                $trigger$$1(el, show ? 'shown' : 'hidden', [this$1]);
                UIkit$1.update(null, el);
            });
        },

        _toggle: function _toggle(el, toggled) {

            el = $__default(el);

            if (this.cls) {
                el.toggleClass(this.cls, ~this.cls.indexOf(' ') ? undefined : toggled);
            } else {
                el.attr('hidden', !toggled);
            }

            el.find('[autofocus]:visible').focus();

            this.updateAria(el);
            UIkit$1.update(null, el);
        },

        _toggleImmediate: function _toggleImmediate(el, show) {
            this._toggle(el, show);
            return promise$$1.resolve();
        },

        _toggleHeight: function _toggleHeight(el, show) {
            var this$1 = this;


            var children = el.children(),
                inProgress = Transition$$1.inProgress(el),
                inner = children.length ? parseFloat(children.first().css('margin-top')) + parseFloat(children.last().css('margin-bottom')) : 0,
                height = el[0].offsetHeight ? el.height() + (inProgress ? 0 : inner) : 0,
                endHeight;

            return Transition$$1.cancel(el).then(function () {

                if (Transition$$1.inProgress(el)) {
                    return promise$$1.resolve().then(function () { return this$1._toggleHeight(el, show); });
                }

                if (!this$1.isToggled(el)) {
                    this$1._toggle(el, true);
                }

                el.height('');

                // Update child components first
                fastdom$$1.flush();

                endHeight = el.height() + (inProgress ? 0 : inner);
                el.height(height);

                return (show
                    ? Transition$$1.start(el, assign$$1({}, this$1.initProps, {overflow: 'hidden', height: endHeight}), Math.round(this$1.duration * (1 - height / endHeight)), this$1.transition)
                    : Transition$$1.start(el, this$1.hideProps, Math.round(this$1.duration * (height / endHeight)), this$1.transition).then(function () { return this$1._toggle(el, false); })
                ).then(function () { return el.css(this$1.initProps); });
            });

        },

        _toggleAnimation: function _toggleAnimation(el, show) {
            var this$1 = this;


            if (Animation$$1.inProgress(el)) {
                return Animation$$1.cancel(el).then(function () {

                    if (Animation$$1.inProgress(el)) {
                        return promise$$1.resolve().then(function () { return this$1._toggleAnimation(el, show); });
                    }

                    return this$1._toggleAnimation(el, show);
                });
            }

            if (show) {
                this._toggle(el, true);
                return Animation$$1.in(el, this.animation[0], this.duration, this.origin);
            }

            return Animation$$1.out(el, this.animation[1] || this.animation[0], this.duration, this.origin).then(function () { return this$1._toggle(el, false); });
        }

    }

};

var active;

var Modal = {

    mixins: [Class, Togglable],

    props: {
        clsPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean,
        container: Boolean
    },

    defaults: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false,
        container: true
    },

    computed: {

        body: function body() {
            return $__default(document.body);
        },

        panel: function panel() {
            return this.$el.find(("." + (this.clsPanel)));
        },

        container: function container() {
            return toNode$$1(this.$props.container === true && UIkit$1.container || this.$props.container && toJQuery$$1(this.$props.container));
        },

        transitionElement: function transitionElement() {
            return this.panel;
        },

        transitionDuration: function transitionDuration() {
            return toMs$$1(this.transitionElement.css('transition-duration'));
        },

        component: function component() {
            return UIkit$1[this.$options.name];
        }

    },

    events: [

        {

            name: 'click',

            delegate: function delegate() {
                return this.selClose;
            },

            handler: function handler(e) {
                e.preventDefault();
                this.hide();
            }

        },

        {

            name: 'toggle',

            handler: function handler(e) {
                e.preventDefault();
                this.toggle();
            }

        },

        {

            name: 'show',

            self: true,

            handler: function handler() {

                if (!docElement$$1.hasClass(this.clsPage)) {
                    this.scrollbarWidth = window.innerWidth - docElement$$1[0].offsetWidth;
                    this.body.css('overflow-y', this.scrollbarWidth && this.overlay ? 'scroll' : '');
                }

                docElement$$1.addClass(this.clsPage);

            }

        },

        {

            name: 'hidden',

            self: true,

            handler: function handler() {
                if (this.component.active === this) {
                    docElement$$1.removeClass(this.clsPage);
                    this.body.css('overflow-y', '');
                    this.component.active = null;
                }
            }

        }

    ],

    methods: {

        toggle: function toggle() {
            return this.isToggled() ? this.hide() : this.show();
        },

        show: function show() {
            var this$1 = this;


            if (this.isToggled()) {
                return;
            }

            if (this.container && !this.$el.parent().is(this.container)) {
                this.container.appendChild(this.$el[0]);
                return promise$$1(function (resolve) { return requestAnimationFrame(function () { return resolve(this$1.show()); }
                    ); }
                )
            }

            var prev = active && active !== this && active;

            active = this;
            this.component.active = this;

            if (prev) {
                if (this.stack) {
                    this.prev = prev;
                } else {
                    prev.hide().then(this.show);
                    return;
                }
            } else {
                requestAnimationFrame(function () { return register(this$1.$options.name); }); // TODO improve
            }

            return this.toggleNow(this.$el, true);
        },

        hide: function hide() {

            if (!this.isToggled()) {
                return;
            }

            active = active && active !== this && active || this.prev;

            if (!active) {
                deregister(this.$options.name);
            }

            return this.toggleNow(this.$el, false);
        },

        getActive: function getActive() {
            return active;
        },

        _toggleImmediate: function _toggleImmediate(el, show) {
            var this$1 = this;


            requestAnimationFrame(function () { return this$1._toggle(el, show); });

            return this.transitionDuration ? promise$$1(function (resolve, reject) {

                if (this$1._transition) {
                    this$1.transitionElement.off(transitionend, this$1._transition.handler);
                    this$1._transition.reject();
                }

                this$1._transition = {
                    reject: reject,
                    handler: function () {
                        resolve();
                        this$1._transition = null;
                    }
                };

                this$1.transitionElement.one(transitionend, this$1._transition.handler);

            }) : promise$$1.resolve();

        },
    }

};

function register(name) {
    doc$$1.on(( obj = {}, obj[("click." + name)] = function (e) {
            if (active && active.bgClose && !e.isDefaultPrevented() && !isWithin$$1(e.target, active.panel)) {
                active.hide();
            }
        }, obj[("keydown." + name)] = function (e) {
            if (e.keyCode === 27 && active && active.escClose) {
                e.preventDefault();
                active.hide();
            }
        }, obj ));
    var obj;
}

function deregister(name) {
    doc$$1.off(("click." + name)).off(("keydown." + name));
}

var Position = {

    props: {
        pos: String,
        offset: null,
        flip: Boolean,
        clsPos: String
    },

    defaults: {
        pos: !isRtl$$1 ? 'bottom-left' : 'bottom-right',
        flip: true,
        offset: false,
        clsPos: ''
    },

    computed: {

        pos: function pos() {
            return (this.$props.pos + (!~this.$props.pos.indexOf('-') ? '-center' : '')).split('-');
        },

        dir: function dir() {
            return this.pos[0];
        },

        align: function align() {
            return this.pos[1];
        }

    },

    methods: {

        positionAt: function positionAt(element, target, boundary) {

            removeClass$$1(element, ((this.clsPos) + "-(top|bottom|left|right)(-[a-z]+)?")).css({top: '', left: ''});

            var offset = toNumber$$1(this.offset) || 0,
                axis = this.getAxis(),
                flipped = position$$1(
                    element,
                    target,
                    axis === 'x' ? ((flipPosition$$1(this.dir)) + " " + (this.align)) : ((this.align) + " " + (flipPosition$$1(this.dir))),
                    axis === 'x' ? ((this.dir) + " " + (this.align)) : ((this.align) + " " + (this.dir)),
                    axis === 'x' ? ("" + (this.dir === 'left' ? -1 * offset : offset)) : (" " + (this.dir === 'top' ? -1 * offset : offset)),
                    null,
                    this.flip,
                    boundary
                );

            this.dir = axis === 'x' ? flipped.target.x : flipped.target.y;
            this.align = axis === 'x' ? flipped.target.y : flipped.target.x;

            element.toggleClass(((this.clsPos) + "-" + (this.dir) + "-" + (this.align)), this.offset === false);

        },

        getAxis: function getAxis() {
            return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
        }

    }

};

var mixin = function (UIkit) {

    UIkit.mixin.class = Class;
    UIkit.mixin.modal = Modal;
    UIkit.mixin.position = Position;
    UIkit.mixin.togglable = Togglable;

};

var Accordion = function (UIkit) {

    UIkit.component('accordion', {

        mixins: [Class, Togglable],

        props: {
            targets: String,
            active: null,
            collapsible: Boolean,
            multiple: Boolean,
            toggle: String,
            content: String,
            transition: String
        },

        defaults: {
            targets: '> *',
            active: false,
            animation: [true],
            collapsible: true,
            multiple: false,
            clsOpen: 'uk-open',
            toggle: '> .uk-accordion-title',
            content: '> .uk-accordion-content',
            transition: 'ease'
        },

        computed: {

            items: function items() {
                var this$1 = this;

                var items = $__default(this.targets, this.$el);
                this._changed = !this._items
                    || items.length !== this._items.length
                    || items.toArray().some(function (el, i) { return el !== this$1._items.get(i); });
                return this._items = items;
            }

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ((this.targets) + " " + (this.$props.toggle));
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.toggle(this.items.find(this.$props.toggle).index(e.currentTarget));
                }

            }

        ],

        update: function update() {
            var this$1 = this;


            if (!this.items.length || !this._changed) {
                return;
            }

            this.items.each(function (i, el) {
                el = $__default(el);
                this$1.toggleNow(el.find(this$1.content), el.hasClass(this$1.clsOpen));
            });

            var active = this.active !== false && toJQuery$$1(this.items.eq(Number(this.active))) || !this.collapsible && toJQuery$$1(this.items.eq(0));
            if (active && !active.hasClass(this.clsOpen)) {
                this.toggle(active, false);
            }

        },

        methods: {

            toggle: function toggle(item, animate) {
                var this$1 = this;


                var index = getIndex$$1(item, this.items),
                    active = this.items.filter(("." + (this.clsOpen)));

                item = this.items.eq(index);

                item.add(!this.multiple && active).each(function (i, el) {

                    el = $__default(el);

                    var isItem = el.is(item), state = isItem && !el.hasClass(this$1.clsOpen);

                    if (!state && isItem && !this$1.collapsible && active.length < 2) {
                        return;
                    }

                    el.toggleClass(this$1.clsOpen, state);

                    var content = el[0]._wrapper ? el[0]._wrapper.children().first() : el.find(this$1.content);

                    if (!el[0]._wrapper) {
                        el[0]._wrapper = content.wrap('<div>').parent().attr('hidden', state);
                    }

                    this$1._toggleImmediate(content, true);
                    this$1.toggleElement(el[0]._wrapper, state, animate).then(function () {
                        if (el.hasClass(this$1.clsOpen) === state) {

                            if (!state) {
                                this$1._toggleImmediate(content, false);
                            }

                            el[0]._wrapper = null;
                            content.unwrap();
                        }
                    });

                });
            }

        }

    });

};

var Alert = function (UIkit) {

    UIkit.component('alert', {

        attrs: true,

        mixins: [Class, Togglable],

        args: 'animation',

        props: {
            close: String
        },

        defaults: {
            animation: [true],
            selClose: '.uk-alert-close',
            duration: 150,
            hideProps: assign$$1({opacity: 0}, Togglable.defaults.hideProps)
        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return this.selClose;
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.close();
                }

            }

        ],

        methods: {

            close: function close() {
                var this$1 = this;

                this.toggleElement(this.$el).then(function () { return this$1.$destroy(true); });
            }

        }

    });

};

var Cover = function (UIkit) {

    UIkit.component('cover', {

        mixins: [Class],

        props: {
            width: Number,
            height: Number
        },

        computed: {

            el: function el() {
                return this.$el[0];
            },

            parent: function parent() {
                return this.el.parentNode;
            }

        },

        ready: function ready() {

            if (this.$el.is('iframe')) {
                this.$el.css('pointerEvents', 'none');
            }

            var player = new Player$$1(this.$el);

            if (player.isVideo()) {
                player.mute();
            }

        },

        update: {

            write: function write() {

                if (this.el.offsetHeight === 0) {
                    return;
                }

                this.$el
                    .css({width: '', height: ''})
                    .css(Dimensions$$1.cover(
                        {width: this.width || this.el.clientWidth, height: this.height || this.el.clientHeight},
                        {width: this.parent.offsetWidth, height: this.parent.offsetHeight}
                    ));

            },

            events: ['load', 'resize']

        },

        events: {

            loadedmetadata: function loadedmetadata() {
                this.$emit();
            }

        }

    });

};

var Drop = function (UIkit) {

    var active;

    UIkit.component('drop', {

        mixins: [Position, Togglable],

        args: 'pos',

        props: {
            mode: 'list',
            toggle: Boolean,
            boundary: 'jQuery',
            boundaryAlign: Boolean,
            delayShow: Number,
            delayHide: Number,
            clsDrop: String
        },

        defaults: {
            mode: ['click', 'hover'],
            toggle: '- :first',
            boundary: window,
            boundaryAlign: false,
            delayShow: 0,
            delayHide: 800,
            clsDrop: false,
            hoverIdle: 200,
            animation: ['uk-animation-fade'],
            cls: 'uk-open'
        },

        init: function init() {
            this.tracker = new MouseTracker$$1();
            this.clsDrop = this.clsDrop || ("uk-" + (this.$options.name));
            this.clsPos = this.clsDrop;

            this.$addClass(this.clsDrop);
        },

        ready: function ready() {

            this.updateAria(this.$el);

            if (this.toggle) {
                this.toggle = UIkit.toggle(query$$1(this.toggle, this.$el), {target: this.$el, mode: this.mode});
            }

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ("." + (this.clsDrop) + "-close");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.hide(false);
                }

            },

            {

                name: 'click',

                delegate: function delegate() {
                    return 'a[href^="#"]';
                },

                handler: function handler(e) {

                    if (e.isDefaultPrevented()) {
                        return;
                    }

                    var id = $__default(e.target).attr('href');

                    if (id.length === 1) {
                        e.preventDefault();
                    }

                    if (id.length === 1 || !isWithin$$1(id, this.$el)) {
                        this.hide(false);
                    }
                }

            },

            {

                name: 'toggle',

                handler: function handler(e, toggle) {

                    if (toggle && !this.$el.is(toggle.target)) {
                        return;
                    }

                    e.preventDefault();

                    if (this.isToggled()) {
                        this.hide(false);
                    } else {
                        this.show(toggle, false);
                    }
                }

            },

            {

                name: pointerEnter,

                filter: function filter() {
                    return ~this.mode.indexOf('hover');
                },

                handler: function handler(e) {

                    if (isTouch$$1(e)) {
                        return;
                    }

                    if (active
                        && active !== this
                        && active.toggle
                        && ~active.toggle.mode.indexOf('hover')
                        && !isWithin$$1(e.target, active.$el)
                        && !isWithin$$1(e.target, active.toggle.$el)
                    ) {
                        active.hide(false);
                    }

                    e.preventDefault();
                    this.show(this.toggle);
                }

            },

            {

                name: 'toggleshow',

                handler: function handler(e, toggle) {

                    if (toggle && !this.$el.is(toggle.target)) {
                        return;
                    }

                    e.preventDefault();
                    this.show(toggle || this.toggle);
                }

            },

            {

                name: ("togglehide " + pointerLeave),

                handler: function handler(e, toggle) {

                    if (isTouch$$1(e) || toggle && !this.$el.is(toggle.target)) {
                        return;
                    }

                    e.preventDefault();

                    if (this.toggle && ~this.toggle.mode.indexOf('hover')) {
                        this.hide();
                    }
                }

            },

            {

                name: 'beforeshow',

                self: true,

                handler: function handler() {
                    this.clearTimers();
                }

            },

            {

                name: 'show',

                self: true,

                handler: function handler() {
                    this.tracker.init();
                    this.toggle.$el.addClass(this.cls).attr('aria-expanded', 'true');
                    registerEvent();
                }

            },

            {

                name: 'beforehide',

                self: true,

                handler: function handler() {
                    this.clearTimers();
                }

            },

            {

                name: 'hide',

                handler: function handler(ref) {
                    var target = ref.target;


                    if (!this.$el.is(target)) {
                        active = active === null && isWithin$$1(target, this.$el) && this.isToggled() ? this : active;
                        return;
                    }

                    active = this.isActive() ? null : active;
                    this.toggle.$el.removeClass(this.cls).attr('aria-expanded', 'false').blur().find('a, button').blur();
                    this.tracker.cancel();
                }

            }

        ],

        update: {

            write: function write() {

                if (this.isToggled() && !Animation$$1.inProgress(this.$el)) {
                    this.position();
                }

            },

            events: ['resize']

        },

        methods: {

            show: function show(toggle, delay) {
                var this$1 = this;
                if ( delay === void 0 ) delay = true;


                var show = function () {
                        if (!this$1.isToggled()) {
                            this$1.position();
                            this$1.toggleElement(this$1.$el, true);
                        }
                    },
                    tryShow = function () {

                        this$1.toggle = toggle || this$1.toggle;

                        this$1.clearTimers();

                        if (this$1.isActive()) {
                            return;
                        } else if (delay && active && active !== this$1 && active.isDelaying) {
                            this$1.showTimer = setTimeout(this$1.show, 10);
                            return;
                        } else if (this$1.isParentOf(active)) {

                            if (active.hideTimer) {
                                active.hide(false);
                            } else {
                                return;
                            }

                        } else if (active && !this$1.isChildOf(active) && !this$1.isParentOf(active)) {

                            var prev;
                            while (active && active !== prev && !this$1.isChildOf(active)) {
                                prev = active;
                                active.hide(false);
                            }

                        }

                        if (delay && this$1.delayShow) {
                            this$1.showTimer = setTimeout(show, this$1.delayShow);
                        } else {
                            show();
                        }

                        active = this$1;
                    };

                if (toggle && this.toggle && !this.toggle.$el.is(toggle.$el)) {

                    this.$el.one('hide', tryShow);
                    this.hide(false);

                } else {
                    tryShow();
                }
            },

            hide: function hide(delay) {
                var this$1 = this;
                if ( delay === void 0 ) delay = true;


                var hide = function () { return this$1.toggleNow(this$1.$el, false); };

                this.clearTimers();

                this.isDelaying = this.tracker.movesTo(this.$el);

                if (delay && this.isDelaying) {
                    this.hideTimer = setTimeout(this.hide, this.hoverIdle);
                } else if (delay && this.delayHide) {
                    this.hideTimer = setTimeout(hide, this.delayHide);
                } else {
                    hide();
                }
            },

            clearTimers: function clearTimers() {
                clearTimeout(this.showTimer);
                clearTimeout(this.hideTimer);
                this.showTimer = null;
                this.hideTimer = null;
                this.isDelaying = false;
            },

            isActive: function isActive() {
                return active === this;
            },

            isChildOf: function isChildOf(drop) {
                return drop && drop !== this && isWithin$$1(this.$el, drop.$el);
            },

            isParentOf: function isParentOf(drop) {
                return drop && drop !== this && isWithin$$1(drop.$el, this.$el);
            },

            position: function position() {

                removeClass$$1(this.$el, ((this.clsDrop) + "-(stack|boundary)")).css({top: '', left: ''});

                this.$el.show().toggleClass(((this.clsDrop) + "-boundary"), this.boundaryAlign);

                var boundary = getDimensions$$1(this.boundary), alignTo = this.boundaryAlign ? boundary : getDimensions$$1(this.toggle.$el);

                if (this.align === 'justify') {
                    var prop = this.getAxis() === 'y' ? 'width' : 'height';
                    this.$el.css(prop, alignTo[prop]);
                } else if (this.$el.outerWidth() > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                    this.$addClass(((this.clsDrop) + "-stack"));
                    this.$el.trigger('stack', [this]);
                }

                this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle.$el, this.boundary);

                this.$el[0].style.display = '';

            }

        }

    });

    UIkit.drop.getActive = function () { return active; };

    var registered;
    function registerEvent() {

        if (registered) {
            return;
        }

        registered = true;
        doc$$1.on('click', function (e) {
            var prev;

            if (e.isDefaultPrevented()) {
                return;
            }

            while (active && active !== prev && !isWithin$$1(e.target, active.$el) && !(active.toggle && isWithin$$1(e.target, active.toggle.$el))) {
                prev = active;
                active.hide(false);
            }
        });
    }

};

var Dropdown = function (UIkit) {

    UIkit.component('dropdown', UIkit.components.drop.extend({name: 'dropdown'}));

};

var FormCustom = function (UIkit) {

    UIkit.component('form-custom', {

        mixins: [Class],

        args: 'target',

        props: {
            target: Boolean
        },

        defaults: {
            target: false
        },

        computed: {

            input: function input() {
                return this.$el.find(':input:first');
            },

            state: function state() {
                return this.input.next();
            },

            target: function target() {
                return this.$props.target && query$$1(this.$props.target === true ? '> :input:first + :first' : this.$props.target, this.$el)
            }

        },

        connected: function connected() {
            this.input.trigger('change');
        },

        events: [

            {

                name: 'focusin focusout mouseenter mouseleave',

                delegate: ':input:first',

                handler: function handler(ref) {
                    var type = ref.type;

                    this.state.toggleClass(("uk-" + (~type.indexOf('focus') ? 'focus' : 'hover')), ~['focusin', 'mouseenter'].indexOf(type));
                }

            },

            {

                name: 'change',

                handler: function handler() {
                    this.target && this.target[this.target.is(':input') ? 'val' : 'text'](
                        this.input[0].files && this.input[0].files[0]
                            ? this.input[0].files[0].name
                            : this.input.is('select')
                                ? this.input.find('option:selected').text()
                                : this.input.val()
                    );
                }

            }

        ]

    });

};

var Gif = function (UIkit) {

    UIkit.component('gif', {

        update: {

            read: function read() {

                var inview = isInView$$1(this.$el);

                if (!this.isInView && inview) {
                    this.$el[0].src = this.$el[0].src;
                }

                this.isInView = inview;
            },

            events: ['scroll', 'load', 'resize']
        }

    });

};

var Grid = function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [Class],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        update: {

            write: function write() {

                this.$toggleClass(this.clsStack, this.stacks);

            },

            events: ['load', 'resize']

        }

    }));

};

var HeightMatch = function (UIkit) {

    UIkit.component('height-match', {

        args: 'target',

        props: {
            target: String,
            row: Boolean
        },

        defaults: {
            target: '> *',
            row: true
        },

        computed: {

            elements: function elements() {
                return $__default(this.target, this.$el);
            }

        },

        update: {

            read: function read() {
                var this$1 = this;


                var lastOffset = false;

                this.elements.css('minHeight', '');

                this.rows = !this.row
                    ? [this.match(this.elements)]
                    : this.elements.toArray().reduce(function (rows, el) {

                        if (lastOffset !== el.offsetTop) {
                            rows.push([el]);
                        } else {
                            rows[rows.length - 1].push(el);
                        }

                        lastOffset = el.offsetTop;

                        return rows;

                    }, []).map(function (elements) { return this$1.match($__default(elements)); });
            },

            write: function write() {

                this.rows.forEach(function (ref) {
                        var height = ref.height;
                        var elements = ref.elements;

                        return elements && elements.each(function (_, el) { return el.style.minHeight = height + "px"; }
                    );
                }
                );

            },

            events: ['load', 'resize']

        },

        methods: {

            match: function match(elements) {

                if (elements.length < 2) {
                    return {};
                }

                var max = 0, heights = [];

                elements = elements
                    .each(function (_, el) {

                        var $el, style, hidden;

                        if (el.offsetHeight === 0) {
                            $el = $__default(el);
                            style = $el.attr('style') || null;
                            hidden = $el.attr('hidden') || null;

                            $el.attr({
                                style: (style + ";display:block !important;"),
                                hidden: null
                            });
                        }

                        max = Math.max(max, el.offsetHeight);
                        heights.push(el.offsetHeight);

                        if ($el) {
                            $el.attr({style: style, hidden: hidden});
                        }

                    })
                    .filter(function (i) { return heights[i] < max; });

                return {height: max, elements: elements};
            }
        }

    });

};

var HeightViewport = function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            expand: Boolean,
            offsetTop: Boolean,
            offsetBottom: Boolean
        },

        defaults: {
            expand: false,
            offsetTop: false,
            offsetBottom: false
        },

        update: {

            write: function write() {

                this.$el.css('boxSizing', 'border-box');

                var viewport = window.innerHeight, height, offset = 0;

                if (this.expand) {

                    this.$el.css({height: '', minHeight: ''});

                    var diff = viewport - document.documentElement.offsetHeight;

                    if (diff > 0) {
                        this.$el.css('min-height', height = this.$el.outerHeight() + diff);
                    }

                } else {

                    var top = offsetTop$$1(this.$el);

                    if (top < viewport / 2 && this.offsetTop) {
                        offset += top;
                    }

                    if (this.offsetBottom === true) {

                        offset += this.$el.next().outerHeight() || 0;

                    } else if ($.isNumeric(this.offsetBottom)) {

                        offset += (viewport / 100) * this.offsetBottom;

                    } else if (this.offsetBottom && this.offsetBottom.substr(-2) === 'px') {

                        offset += parseFloat(this.offsetBottom);

                    } else if (isString$$1(this.offsetBottom)) {

                        var el = query$$1(this.offsetBottom, this.$el);
                        offset += el && el.outerHeight() || 0;

                    }

                    this.$el.css('min-height', height = offset ? ("calc(100vh - " + offset + "px)") : '100vh');

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.height('');
                if (height && viewport - offset >= this.$el.outerHeight()) {
                    this.$el.css('height', height);
                }

            },

            events: ['load', 'resize']

        }

    });

};

var Hover = function (UIkit) {

    ready$$1(function () {

        if (!hasTouch) {
            return;
        }

        var cls = 'uk-hover';

        docElement$$1.on('tap', function (ref) {
            var target = ref.target;

            return $__default(("." + cls)).filter(function (_, el) { return !isWithin$$1(target, el); }).removeClass(cls);
        });

        Object.defineProperty(UIkit, 'hoverSelector', {

            set: function set(selector) {
                docElement$$1.on('tap', selector, function (ref) {
                    var currentTarget = ref.currentTarget;

                    return currentTarget.classList.add(cls);
                });
            }

        });

        UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

    });

};

var closeIcon = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"1\" y1=\"1\" x2=\"13\" y2=\"13\"></line><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"13\" y1=\"1\" x2=\"1\" y2=\"13\"></line></svg>";

var closeLarge = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"1\" y1=\"1\" x2=\"19\" y2=\"19\"></line><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"19\" y1=\"1\" x2=\"1\" y2=\"19\"></line></svg>";

var marker = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"9\" y=\"4\" width=\"1\" height=\"11\"></rect><rect x=\"4\" y=\"9\" width=\"11\" height=\"1\"></rect></svg>";

var navbarToggleIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect y=\"9\" width=\"20\" height=\"2\"></rect><rect y=\"3\" width=\"20\" height=\"2\"></rect><rect y=\"15\" width=\"20\" height=\"2\"></rect></svg>";

var overlayIcon = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"19\" y=\"0\" width=\"1\" height=\"40\"></rect><rect x=\"0\" y=\"19\" width=\"40\" height=\"1\"></rect></svg>";

var paginationNext = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 1 6 6 1 11\"></polyline></svg>";

var paginationPrevious = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"6 1 1 6 6 11\"></polyline></svg>";

var searchIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"9\" cy=\"9\" r=\"7\"></circle><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M14,14 L18,18 L14,14 Z\"></path></svg>";

var searchLarge = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" cx=\"17.5\" cy=\"17.5\" r=\"16.5\"></circle><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" x1=\"38\" y1=\"39\" x2=\"29\" y2=\"30\"></line></svg>";

var searchNavbar = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10.5\" cy=\"10.5\" r=\"9.5\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"23\" y1=\"23\" x2=\"17\" y2=\"17\"/></svg>";

var slidenavNext = "<svg width=\"11\" height=\"20\" viewBox=\"0 0 11 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 1 10 10 1 19\"></polyline></svg>";

var slidenavNextLarge = "<svg width=\"18\" height=\"34\" viewBox=\"0 0 18 34\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"1 1 17 17 1 33\"></polyline></svg>";

var slidenavPrevious = "<svg width=\"11\" height=\"20\" viewBox=\"0 0 11 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"10 1 1 10 10 19\"></polyline></svg>";

var slidenavPreviousLarge = "<svg width=\"18\" height=\"34\" viewBox=\"0 0 18 34\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"17 1 1 17 17 33\"></polyline></svg>";

var spinner = "<svg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" cx=\"15\" cy=\"15\" r=\"14\"></circle></svg>";

var totop = "<svg width=\"18\" height=\"10\" viewBox=\"0 0 18 10\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 9 9 1 17 9 \"></polyline></svg>";

var Icon = function (UIkit) {

    var parsed = {},
        icons = {
            spinner: spinner,
            totop: totop,
            marker: marker,
            'close-icon': closeIcon,
            'close-large': closeLarge,
            'navbar-toggle-icon': navbarToggleIcon,
            'overlay-icon': overlayIcon,
            'pagination-next': paginationNext,
            'pagination-previous': paginationPrevious,
            'search-icon': searchIcon,
            'search-large': searchLarge,
            'search-navbar': searchNavbar,
            'slidenav-next': slidenavNext,
            'slidenav-next-large': slidenavNextLarge,
            'slidenav-previous': slidenavPrevious,
            'slidenav-previous-large': slidenavPreviousLarge
        };

    UIkit.component('icon', UIkit.components.svg.extend({

        attrs: ['icon', 'ratio'],

        mixins: [Class],

        name: 'icon',

        args: 'icon',

        props: ['icon'],

        defaults: {exclude: ['id', 'style', 'class', 'src', 'icon']},

        init: function init() {
            this.$addClass('uk-icon');

            if (isRtl$$1) {
                this.icon = swap$$1(swap$$1(this.icon, 'left', 'right'), 'previous', 'next');
            }
        },

        update: {

            read: function read() {

                if (this.delay) {
                    var icon = this.getIcon();

                    if (icon) {
                        this.delay(icon);
                        this.delay = false;
                    }
                }
            },

            events: ['load']

        },

        methods: {

            getSvg: function getSvg() {
                var this$1 = this;


                var icon = this.getIcon();

                if (!icon) {

                    if (document.readyState !== 'complete') {
                        return promise$$1(function (resolve) {
                            this$1.delay = resolve;
                        });
                    }

                    return promise$$1.reject('Icon not found.');

                }

                return promise$$1.resolve(icon);
            },

            getIcon: function getIcon() {

                if (!icons[this.icon]) {
                    return null;
                }

                if (!parsed[this.icon]) {
                    parsed[this.icon] = this.parse(icons[this.icon]);
                }

                return parsed[this.icon];
            }

        }

    }));

    [
        'marker',
        'navbar-toggle-icon',
        'overlay-icon',
        'pagination-previous',
        'pagination-next',
        'totop'
    ].forEach(function (name) { return registerComponent(name); });

    [
        'slidenav-previous',
        'slidenav-next'
    ].forEach(function (name) { return registerComponent(name, {

        init: function init() {
            this.$addClass('uk-slidenav');

            if (this.$hasClass('uk-slidenav-large')) {
                this.icon += '-large';
            }
        }

    }); });

    registerComponent('search-icon', {

        init: function init() {
            if (this.$hasClass('uk-search-icon') && this.$el.parents('.uk-search-large').length) {
                this.icon = 'search-large';
            } else if (this.$el.parents('.uk-search-navbar').length) {
                this.icon = 'search-navbar';
            }
        }

    });

    registerComponent('close', {

        init: function init() {
            this.icon = "close-" + (this.$hasClass('uk-close-large') ? 'large' : 'icon');
        }

    });

    registerComponent('spinner', {

        connected: function connected() {
            var this$1 = this;

            this.svg.then(function (svg) { return this$1.ratio !== 1 && $__default(svg).find('circle').css('stroke-width', 1 / this$1.ratio); }, noop$$1);
        }

    });

    UIkit.icon.add = function (added) { return assign$$1(icons, added); };

    function registerComponent(name, mixin$$1) {

        UIkit.component(name, UIkit.components.icon.extend({

            name: name,

            mixins: mixin$$1 ? [mixin$$1] : [],

            defaults: {
                icon: name
            }

        }));
    }

};

var Margin = function (UIkit) {

    UIkit.component('margin', {

        props: {
            margin: String,
            firstColumn: Boolean
        },

        defaults: {
            margin: 'uk-margin-small-top',
            firstColumn: 'uk-first-column'
        },

        computed: {

            items: function items() {
                return this.$el[0].children;
            }

        },

        update: {

            read: function read() {
                var this$1 = this;


                if (!this.items.length || this.$el[0].offsetHeight === 0) {
                    this.rows = false;
                    return;
                }

                this.stacks = true;

                var rows = [[]];

                for (var i = 0; i < this.items.length; i++) {

                    var el = this$1.items[i],
                        dim = el.getBoundingClientRect();

                    if (!dim.height) {
                        continue;
                    }

                    for (var j = rows.length - 1; j >= 0; j--) {

                        var row = rows[j];

                        if (!row[0]) {
                            row.push(el);
                            break;
                        }

                        var leftDim = row[0].getBoundingClientRect();

                        if (dim.top >= Math.floor(leftDim.bottom)) {
                            rows.push([el]);
                            break;
                        }

                        if (Math.floor(dim.bottom) > leftDim.top) {

                            this$1.stacks = false;

                            if (dim.left < leftDim.left && !isRtl$$1) {
                                row.unshift(el);
                                break;
                            }

                            row.push(el);
                            break;
                        }

                        if (j === 0) {
                            rows.unshift([el]);
                            break;
                        }

                    }

                }

                this.rows = rows;

            },

            write: function write() {
                var this$1 = this;


                this.rows && this.rows.forEach(function (row, i) { return row.forEach(function (el, j) {
                        this$1.$toggleClass(el, this$1.margin, i !== 0);
                        this$1.$toggleClass(el, this$1.firstColumn, j === 0);
                    }); }
                );

            },

            events: ['load', 'resize']

        }

    });

};

var Modal$1 = function (UIkit) {

    UIkit.component('modal', {

        mixins: [Modal],

        defaults: {
            clsPage: 'uk-modal-page',
            clsPanel: 'uk-modal-dialog',
            selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full'
        },

        events: [

            {
                name: 'show',

                self: true,

                handler: function handler() {

                    if (this.panel.hasClass('uk-margin-auto-vertical')) {
                        this.$el.addClass('uk-flex');
                    } else {
                        this.$el.css('display', 'block');
                    }

                    this.$el.height(); // force reflow
                }
            },

            {
                name: 'hidden',

                self: true,

                handler: function handler() {

                    this.$el.css('display', '').removeClass('uk-flex');

                }
            }

        ]

    });

    UIkit.component('overflow-auto', {

        mixins: [Class],

        computed: {

            modal: function modal() {
                return this.$el.closest('.uk-modal');
            },

            panel: function panel() {
                return this.$el.closest('.uk-modal-dialog');
            }

        },

        connected: function connected() {
            this.$el.css('min-height', 150);
        },

        update: {

            write: function write() {
                var current = this.$el.css('max-height');

                this.$el.css('max-height', 150).css('max-height', Math.max(150, 150 + this.modal.height() - this.panel.outerHeight(true)));
                if (current !== this.$el.css('max-height')) {
                    this.$el.trigger('resize');
                }
            },

            events: ['load', 'resize']

        }

    });

    UIkit.modal.dialog = function (content, options) {

        var dialog = UIkit.modal((" <div class=\"uk-modal\"> <div class=\"uk-modal-dialog\">" + content + "</div> </div> "), options);

        dialog.$el.on('hidden', function (e) {
            if (e.target === e.currentTarget) {
                dialog.$destroy(true);
            }
        });
        dialog.show();

        return dialog;
    };

    UIkit.modal.alert = function (message, options) {

        options = assign$$1({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise$$1(
            function (resolve) { return UIkit.modal.dialog((" <div class=\"uk-modal-body\">" + (isString$$1(message) ? message : $__default(message).html()) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-primary uk-modal-close\" autofocus>" + (options.labels.ok) + "</button> </div> "), options).$el.on('hide', resolve); }
        );
    };

    UIkit.modal.confirm = function (message, options) {

        options = assign$$1({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise$$1(
            function (resolve, reject) { return UIkit.modal.dialog((" <div class=\"uk-modal-body\">" + (isString$$1(message) ? message : $__default(message).html()) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\">" + (options.labels.cancel) + "</button> <button class=\"uk-button uk-button-primary uk-modal-close\" autofocus>" + (options.labels.ok) + "</button> </div> "), options).$el.on('click', '.uk-modal-footer button', function (e) { return $__default(e.target).index() === 0 ? reject() : resolve(); }); }
        );
    };

    UIkit.modal.prompt = function (message, value, options) {

        options = assign$$1({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise$$1(function (resolve) {

            var resolved = false,
                prompt = UIkit.modal.dialog((" <form class=\"uk-form-stacked\"> <div class=\"uk-modal-body\"> <label>" + (isString$$1(message) ? message : $__default(message).html()) + "</label> <input class=\"uk-input\" type=\"text\" autofocus> </div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\" type=\"button\">" + (options.labels.cancel) + "</button> <button class=\"uk-button uk-button-primary\" type=\"submit\">" + (options.labels.ok) + "</button> </div> </form> "), options),
                input = prompt.$el.find('input').val(value);

            prompt.$el
                .on('submit', 'form', function (e) {
                    e.preventDefault();
                    resolve(input.val());
                    resolved = true;
                    prompt.hide();
                })
                .on('hide', function () {
                    if (!resolved) {
                        resolve(null);
                    }
                });

        });
    };

    UIkit.modal.labels = {
        ok: 'Ok',
        cancel: 'Cancel'
    };

};

var Nav = function (UIkit) {

    UIkit.component('nav', UIkit.components.accordion.extend({

        name: 'nav',

        defaults: {
            targets: '> .uk-parent',
            toggle: '> a',
            content: 'ul:first'
        }

    }));

};

var Navbar = function (UIkit) {

    UIkit.component('navbar', {

        mixins: [Class],

        props: {
            dropdown: String,
            mode: 'list',
            align: String,
            offset: Number,
            boundary: Boolean,
            boundaryAlign: Boolean,
            clsDrop: String,
            delayShow: Number,
            delayHide: Number,
            dropbar: Boolean,
            dropbarMode: String,
            dropbarAnchor: 'jQuery',
            duration: Number
        },

        defaults: {
            dropdown: '.uk-navbar-nav > li',
            align: !isRtl$$1 ? 'left' : 'right',
            clsDrop: 'uk-navbar-dropdown',
            mode: undefined,
            offset: undefined,
            delayShow: undefined,
            delayHide: undefined,
            boundaryAlign: undefined,
            flip: 'x',
            boundary: true,
            dropbar: false,
            dropbarMode: 'slide',
            dropbarAnchor: false,
            duration: 200,
        },

        computed: {

            boundary: function boundary() {
                return (this.$props.boundary === true || this.boundaryAlign) ? this.$el : this.$props.boundary
            },

            pos: function pos() {
                return ("bottom-" + (this.align));
            }

        },

        ready: function ready() {

            if (this.dropbar) {
                UIkit.navbarDropbar(
                    query$$1(this.dropbar, this.$el) || $__default('<div></div>').insertAfter(this.dropbarAnchor || this.$el),
                    {clsDrop: this.clsDrop, mode: this.dropbarMode, duration: this.duration, navbar: this}
                );
            }

        },

        update: function update() {

            UIkit.drop(
                $__default(((this.dropdown) + " ." + (this.clsDrop)), this.$el).filter(function (_, el) { return !UIkit.getComponent(el, 'dropdown'); }),
                assign$$1({}, this.$props, {boundary: this.boundary, pos: this.pos})
            );

        },

        events: [

            {
                name: pointerEnter,

                delegate: function delegate() {
                    return this.dropdown;
                },

                handler: function handler(ref) {
                    var currentTarget = ref.currentTarget;

                    var active = this.getActive();
                    if (active && active.toggle && !isWithin$$1(active.toggle.$el, currentTarget) && !active.tracker.movesTo(active.$el)) {
                        active.hide(false);
                    }
                }

            }

        ],

        methods: {

            getActive: function getActive() {
                var active = UIkit.drop.getActive();
                return active && !~active.mode.indexOf('click') && isWithin$$1(active.toggle.$el, this.$el) && active;
            }

        }

    });

    UIkit.component('navbar-dropbar', {

        mixins: [Class],

        defaults: {
            clsDrop: '',
            mode: 'slide',
            navbar: null,
            duration: 200
        },

        init: function init() {

            if (this.mode === 'slide') {
                this.$addClass('uk-navbar-dropbar-slide');
            }

        },

        events: [

            {
                name: 'beforeshow',

                el: function el() {
                    return this.navbar.$el;
                },

                handler: function handler(_, drop) {
                    var $el = drop.$el;
                    var dir = drop.dir;
                    if (dir === 'bottom' && !isWithin$$1($el, this.$el)) {
                        $el.appendTo(this.$el);
                        drop.show();
                        return false;
                    }
                }
            },

            {
                name: 'mouseleave',

                handler: function handler() {
                    var active = this.navbar.getActive();

                    if (active && !this.$el.is(':hover')) {
                        active.hide();
                    }
                }
            },

            {
                name: 'beforeshow',

                handler: function handler(e, ref) {
                    var $el = ref.$el;

                    this.clsDrop && $el.addClass(((this.clsDrop) + "-dropbar"));
                    this.transitionTo($el.outerHeight(true));
                }
            },

            {
                name: 'beforehide',

                handler: function handler(e, ref) {
                    var $el = ref.$el;


                    var active = this.navbar.getActive();

                    if (this.$el.is(':hover') && active && active.$el.is($el)) {
                        return false;
                    }
                }
            },

            {
                name: 'hide',

                handler: function handler(e, ref) {
                    var $el = ref.$el;


                    var active = this.navbar.getActive();

                    if (!active || active && active.$el.is($el)) {
                        this.transitionTo(0);
                    }
                }
            }

        ],

        methods: {

            transitionTo: function transitionTo(height) {
                var this$1 = this;

                this.$el.height(this.$el[0].offsetHeight ? this.$el.height() : 0);
                return Transition$$1.cancel(this.$el).then(function () { return Transition$$1.start(this$1.$el, {height: height}, this$1.duration).then(null, noop$$1); });
            }

        }

    });

};

var scroll;

var Offcanvas = function (UIkit) {

    UIkit.component('offcanvas', {

        mixins: [Modal],

        args: 'mode',

        props: {
            content: String,
            mode: String,
            flip: Boolean,
            overlay: Boolean
        },

        defaults: {
            content: '.uk-offcanvas-content:first',
            mode: 'slide',
            flip: false,
            overlay: false,
            clsPage: 'uk-offcanvas-page',
            clsContainer: 'uk-offcanvas-container',
            clsPanel: 'uk-offcanvas-bar',
            clsFlip: 'uk-offcanvas-flip',
            clsContent: 'uk-offcanvas-content',
            clsContentAnimation: 'uk-offcanvas-content-animation',
            clsSidebarAnimation: 'uk-offcanvas-bar-animation',
            clsMode: 'uk-offcanvas',
            clsOverlay: 'uk-offcanvas-overlay',
            selClose: '.uk-offcanvas-close'
        },

        computed: {

            content: function content() {
                return $__default(query$$1(this.$props.content, this.$el));
            },

            clsFlip: function clsFlip() {
                return this.flip ? this.$props.clsFlip : '';
            },

            clsOverlay: function clsOverlay() {
                return this.overlay ? this.$props.clsOverlay : '';
            },

            clsMode: function clsMode() {
                return ((this.$props.clsMode) + "-" + (this.mode));
            },

            clsSidebarAnimation: function clsSidebarAnimation() {
                return this.mode === 'none' || this.mode === 'reveal' ? '' : this.$props.clsSidebarAnimation;
            },

            clsContentAnimation: function clsContentAnimation() {
                return this.mode !== 'push' && this.mode !== 'reveal' ? '' : this.$props.clsContentAnimation
            },

            transitionElement: function transitionElement() {
                return this.mode === 'reveal' ? this.panel.parent() : this.panel;
            }

        },

        update: {

            write: function write() {

                if (this.isToggled()) {

                    if (this.overlay || this.clsContentAnimation) {
                        this.content.width(window.innerWidth - this.scrollbarWidth);
                    }

                    if (this.overlay) {
                        this.content.height(window.innerHeight);
                        scroll && this.content.scrollTop(scroll.y);
                    }

                }

            },

            events: ['resize']

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return 'a[href^="#"]';
                },

                handler: function handler(ref) {
                    var currentTarget = ref.currentTarget;

                    if (currentTarget.hash && this.content.find(currentTarget.hash).length) {
                        scroll = null;
                        this.hide();
                    }
                }

            },

            {

                name: 'beforescroll',

                filter: function filter() {
                    return this.overlay;
                },

                handler: function handler(_, scroll, target) {
                    if (scroll && target && this.isToggled() && this.content.find(target).length) {
                        this.$el.one('hidden', function () { return scroll.scrollTo(target); });
                        return false;
                    }
                }

            },

            {
                name: 'show',

                self: true,

                handler: function handler() {

                    scroll = scroll || {x: window.pageXOffset, y: window.pageYOffset};

                    if (this.mode === 'reveal' && !this.panel.parent().hasClass(this.clsMode)) {
                        this.panel.wrap('<div>').parent().addClass(this.clsMode);
                    }

                    docElement$$1.css('overflow-y', (!this.clsContentAnimation || this.flip) && this.scrollbarWidth && this.overlay ? 'scroll' : '');

                    this.body.addClass(((this.clsContainer) + " " + (this.clsFlip) + " " + (this.clsOverlay))).height();
                    this.content.addClass(this.clsContentAnimation);
                    this.panel.addClass(((this.clsSidebarAnimation) + " " + (this.mode !== 'reveal' ? this.clsMode : '')));
                    this.$el.addClass(this.clsOverlay).css('display', 'block').height();

                }
            },

            {
                name: 'hide',

                self: true,

                handler: function handler() {
                    this.content.removeClass(this.clsContentAnimation);

                    if (this.mode === 'none' || this.getActive() && this.getActive() !== this) {
                        this.panel.trigger(transitionend);
                    }
                }
            },

            {
                name: 'hidden',

                self: true,

                handler: function handler() {

                    if (this.mode === 'reveal') {
                        this.panel.unwrap();
                    }

                    if (!this.overlay) {
                        scroll = {x: window.pageXOffset, y: window.pageYOffset};
                    } else if (!scroll) {
                        var ref = this.content[0];
                        var x = ref.scrollLeft;
                        var y = ref.scrollTop;
                        scroll = {x: x, y: y};
                    }

                    this.panel.removeClass(((this.clsSidebarAnimation) + " " + (this.clsMode)));
                    this.$el.removeClass(this.clsOverlay).css('display', '');
                    this.body.removeClass(((this.clsContainer) + " " + (this.clsFlip) + " " + (this.clsOverlay))).scrollTop(scroll.y);

                    docElement$$1.css('overflow-y', '');
                    this.content.width('').height('');

                    window.scrollTo(scroll.x, scroll.y);

                    scroll = null;

                }
            },

            {
                name: 'swipeLeft swipeRight',

                handler: function handler(e) {

                    if (this.isToggled() && isTouch$$1(e) && (e.type === 'swipeLeft' && !this.flip || e.type === 'swipeRight' && this.flip)) {
                        this.hide();
                    }

                }
            }

        ]

    });

};

var Responsive = function (UIkit) {

    UIkit.component('responsive', {

        props: ['width', 'height'],

        init: function init() {
            this.$addClass('uk-responsive-width');
        },

        update: {

            read: function read() {

                this.dim = this.$el.is(':visible') && this.width && this.height
                    ? {width: this.$el.parent().width(), height: this.height}
                    : false;

            },

            write: function write() {

                if (this.dim) {
                    this.$el.height(Dimensions$$1.contain({height: this.height, width: this.width}, this.dim).height);
                }

            },

            events: ['load', 'resize']

        }

    });

};

var Scroll = function (UIkit) {

    UIkit.component('scroll', {

        props: {
            duration: Number,
            easing: String,
            offset: Number
        },

        defaults: {
            duration: 1000,
            easing: 'easeOutExpo',
            offset: 0
        },

        methods: {

            scrollTo: function scrollTo(el) {
                var this$1 = this;


                var target = offsetTop$$1($__default(el)) - this.offset,
                    document = docHeight$$1(),
                    viewport = window.innerHeight;

                if (target + viewport > document) {
                    target = document - viewport;
                }

                if ($trigger$$1(this.$el, 'beforescroll', [this, el]).result === false) {
                    return;
                }

                $__default('html,body')
                    .stop()
                    .animate({scrollTop: Math.round(target)}, this.duration, this.easing)
                    .promise()
                    .then(function () { return this$1.$el.trigger('scrolled', [this$1, el]); });

            }

        },

        events: {

            click: function click(e) {

                if (e.isDefaultPrevented()) {
                    return;
                }

                e.preventDefault();
                this.scrollTo($__default(this.$el[0].hash).length ? this.$el[0].hash : 'body');
            }

        }

    });

    $__default.easing.easeOutExpo = $__default.easing.easeOutExpo || function (x, t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };

};

var Scrollspy = function (UIkit) {

    UIkit.component('scrollspy', {

        args: 'cls',

        props: {
            cls: 'list',
            target: String,
            hidden: Boolean,
            offsetTop: Number,
            offsetLeft: Number,
            repeat: Boolean,
            delay: Number
        },

        defaults: {
            cls: ['uk-scrollspy-inview'],
            target: false,
            hidden: true,
            offsetTop: 0,
            offsetLeft: 0,
            repeat: false,
            delay: 0,
            inViewClass: 'uk-scrollspy-inview'
        },

        computed: {

            elements: function elements() {
                return this.target && $__default(this.target, this.$el) || this.$el;
            }

        },

        update: [

            {

                write: function write() {
                    if (this.hidden) {
                        this.elements.filter((":not(." + (this.inViewClass) + ")")).css('visibility', 'hidden');
                    }
                }

            },

            {

                read: function read() {
                    var this$1 = this;

                    this.elements.each(function (_, el) {

                        if (!el._scrollspy) {
                            var cls = $__default(el).attr('uk-scrollspy-class');
                            el._scrollspy = {toggles: cls && cls.split(',') || this$1.cls};
                        }

                        el._scrollspy.show = isInView$$1(el, this$1.offsetTop, this$1.offsetLeft);

                    });
                },

                write: function write() {
                    var this$1 = this;


                    var index = this.elements.length === 1 ? 1 : 0;

                    this.elements.each(function (i, el) {

                        var $el = $__default(el), data = el._scrollspy, cls = data.toggles[i] || data.toggles[0];

                        if (data.show) {

                            if (!data.inview && !data.timer) {

                                var show = function () {
                                    $el.css('visibility', '')
                                        .addClass(this$1.inViewClass)
                                        .toggleClass(cls)
                                        .trigger('inview');

                                    this$1.$update();

                                    data.inview = true;
                                    delete data.timer;
                                };

                                if (this$1.delay && index) {
                                    data.timer = setTimeout(show, this$1.delay * index);
                                } else {
                                    show();
                                }

                                index++;

                            }

                        } else {

                            if (data.inview && this$1.repeat) {

                                if (data.timer) {
                                    clearTimeout(data.timer);
                                    delete data.timer;
                                }

                                $el.removeClass(this$1.inViewClass)
                                    .toggleClass(cls)
                                    .css('visibility', this$1.hidden ? 'hidden' : '')
                                    .trigger('outview');

                                this$1.$update();

                                data.inview = false;

                            }

                        }

                    });

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    });

};

var ScrollspyNav = function (UIkit) {

    UIkit.component('scrollspy-nav', {

        props: {
            cls: String,
            closest: String,
            scroll: Boolean,
            overflow: Boolean,
            offset: Number
        },

        defaults: {
            cls: 'uk-active',
            closest: false,
            scroll: false,
            overflow: true,
            offset: 0
        },

        computed: {

            links: function links() {
                return this.$el.find('a[href^="#"]').filter(function (i, el) { return el.hash; });
            },

            elements: function elements() {
                return this.closest ? this.links.closest(this.closest) : this.links;
            },

            targets: function targets() {
                return $__default(this.links.toArray().map(function (el) { return el.hash; }).join(','));
            }

        },

        update: [

            {

                read: function read() {
                    if (this.scroll) {
                        UIkit.scroll(this.links, {offset: this.offset || 0});
                    }
                }

            },

            {

                read: function read() {
                    var this$1 = this;


                    var scroll = window.pageYOffset + this.offset, max = docHeight$$1() - window.innerHeight + this.offset;

                    this.active = false;

                    this.targets.each(function (i, el) {

                        el = $__default(el);

                        var top = offsetTop$$1(el), last = i + 1 === this$1.targets.length;
                        if (!this$1.overflow && (i === 0 && top > scroll || last && top + el[0].offsetTop < scroll)) {
                            return false;
                        }

                        if (!last && offsetTop$$1(this$1.targets.eq(i + 1)) <= scroll) {
                            return;
                        }

                        if (scroll >= max) {
                            for (var j = this$1.targets.length - 1; j > i; j--) {
                                if (isInView$$1(this$1.targets.eq(j))) {
                                    el = this$1.targets.eq(j);
                                    break;
                                }
                            }
                        }

                        return !(this$1.active = toJQuery$$1(this$1.links.filter(("[href=\"#" + (el.attr('id')) + "\"]"))));

                    });

                },

                write: function write() {

                    this.links.blur();
                    this.elements.removeClass(this.cls);

                    if (this.active) {
                        this.$el.trigger('active', [
                            this.active,
                            (this.closest ? this.active.closest(this.closest) : this.active).addClass(this.cls)
                        ]);
                    }

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    });

};

var Sticky = function (UIkit) {

    UIkit.component('sticky', {

        mixins: [Class],

        attrs: true,

        props: {
            top: null,
            bottom: Boolean,
            offset: Number,
            animation: String,
            clsActive: String,
            clsInactive: String,
            clsFixed: String,
            clsBelow: String,
            selTarget: String,
            widthElement: 'jQuery',
            showOnUp: Boolean,
            media: 'media',
            target: Number
        },

        defaults: {
            top: 0,
            bottom: false,
            offset: 0,
            animation: '',
            clsActive: 'uk-active',
            clsInactive: '',
            clsFixed: 'uk-sticky-fixed',
            clsBelow: 'uk-sticky-below',
            selTarget: '',
            widthElement: false,
            showOnUp: false,
            media: false,
            target: false
        },

        computed: {

            selTarget: function selTarget() {
                return this.$props.selTarget && toJQuery$$1(this.$props.selTarget, this.$el) || this.$el;
            }

        },

        connected: function connected() {

            this.placeholder = $__default('<div class="uk-sticky-placeholder"></div>');
            this.widthElement = this.$props.widthElement || this.placeholder;

            if (!this.isActive) {
                this.hide();
            }
        },

        disconnected: function disconnected() {

            if (this.isActive) {
                this.isActive = false;
                this.hide();
                this.$removeClass(this.clsInactive);
            }

            this.placeholder.remove();
            this.placeholder = null;
            this.widthElement = null;
        },

        ready: function ready() {
            var this$1 = this;


            if (!(this.target && location.hash && window.pageYOffset > 0)) {
                return;
            }

            var target = query$$1(location.hash);

            if (target) {
                requestAnimationFrame(function () {

                    var top = offsetTop$$1(target),
                        elTop = offsetTop$$1(this$1.$el),
                        elHeight = this$1.$el[0].offsetHeight;

                    if (elTop + elHeight >= top && elTop <= top + target[0].offsetHeight) {
                        window.scrollTo(0, top - elHeight - this$1.target - this$1.offset);
                    }

                });
            }

        },

        events: [

            {
                name: 'active',

                handler: function handler() {
                    this.$addClass(this.selTarget, this.clsActive);
                    this.$removeClass(this.selTarget, this.clsInactive);
                }

            },

            {
                name: 'inactive',

                handler: function handler() {
                    this.$addClass(this.selTarget, this.clsInactive);
                    this.$removeClass(this.selTarget, this.clsActive);
                }

            }

        ],

        update: [

            {

                write: function write() {
                    var this$1 = this;


                    var outerHeight = (this.isActive ? this.placeholder : this.$el)[0].offsetHeight, el;

                    this.placeholder
                        .css('height', this.$el.css('position') !== 'absolute' ? outerHeight : '')
                        .css(this.$el.css(['marginTop', 'marginBottom', 'marginLeft', 'marginRight']));

                    if (!document.documentElement.contains(this.placeholder[0])) {
                        this.placeholder.insertAfter(this.$el).attr('hidden', true);
                    }

                    this.width = this.widthElement.attr('hidden', null)[0].offsetWidth;
                    this.widthElement.attr('hidden', !this.isActive);

                    this.topOffset = offsetTop$$1(this.isActive ? this.placeholder : this.$el);
                    this.bottomOffset = this.topOffset + outerHeight;

                    ['top', 'bottom'].forEach(function (prop) {

                        this$1[prop] = this$1.$props[prop];

                        if (!this$1[prop]) {
                            return;
                        }

                        if ($.isNumeric(this$1[prop])) {

                            this$1[prop] = this$1[(prop + "Offset")] + parseFloat(this$1[prop]);

                        } else {

                            if (isString$$1(this$1[prop]) && this$1[prop].match(/^-?\d+vh$/)) {
                                this$1[prop] = window.innerHeight * parseFloat(this$1[prop]) / 100;
                            } else {

                                el = this$1[prop] === true ? this$1.$el.parent() : query$$1(this$1[prop], this$1.$el);

                                if (el) {
                                    this$1[prop] = offsetTop$$1(el) + el[0].offsetHeight;
                                }

                            }

                        }

                    });

                    this.top = Math.max(parseFloat(this.top), this.topOffset) - this.offset;
                    this.bottom = this.bottom && this.bottom - outerHeight;
                    this.inactive = this.media && !window.matchMedia(this.media).matches;

                    if (this.isActive) {
                        this.update();
                    }
                },

                events: ['load', 'resize']

            },

            {

                read: function read() {
                    this.offsetTop = offsetTop$$1(this.$el);
                    this.scroll = window.pageYOffset;
                    this.visible = this.$el.is(':visible');
                },

                write: function write(ref) {
                    var this$1 = this;
                    if ( ref === void 0 ) ref = {};
                    var dir = ref.dir;


                    var scroll = this.scroll;

                    if (scroll < 0 || !this.visible || this.disabled || this.showOnUp && !dir) {
                        return;
                    }

                    if (this.inactive
                        || scroll < this.top
                        || this.showOnUp && (scroll <= this.top || dir ==='down' || dir === 'up' && !this.isActive && scroll <= this.bottomOffset)
                    ) {

                        if (!this.isActive) {
                            return;
                        }

                        this.isActive = false;

                        if (this.animation && scroll > this.topOffset) {
                            Animation$$1.cancel(this.$el).then(function () { return Animation$$1.out(this$1.$el, this$1.animation).then(function () { return this$1.hide(); }, noop$$1); });
                        } else {
                            this.hide();
                        }

                    } else if (this.isActive) {

                        this.update();

                    } else if (this.animation) {

                        Animation$$1.cancel(this.$el).then(function () {
                            this$1.show();
                            Animation$$1.in(this$1.$el, this$1.animation).then(null, noop$$1);
                        });

                    } else {
                        this.show();
                    }

                },

                events: ['scroll']

            } ],

        methods: {

            show: function show() {

                this.isActive = true;
                this.update();
                this.placeholder.attr('hidden', null);

            },

            hide: function hide() {

                if (!this.isActive || this.$hasClass(this.selTarget, this.clsActive)) {
                    this.$el.trigger('inactive');
                }

                this.$removeClass(this.clsFixed, this.clsBelow);
                this.$el.css({position: '', top: '', width: ''});
                this.placeholder.attr('hidden', true);

            },

            update: function update() {
                var this$1 = this;


                var top = Math.max(0, this.offset), active = this.scroll > this.top;

                if (this.bottom && this.scroll > this.bottom - this.offset) {
                    top = this.bottom - this.scroll;
                }

                this.$el.css({
                    position: 'fixed',
                    top: (top + "px"),
                    width: this.width
                });

                if (this.$hasClass(this.selTarget, this.clsActive)) {

                    if (!active) {
                        this.$el.trigger('inactive');
                    }

                } else {

                    if (active) {
                        this.$el.trigger('active');
                    }
                }

                this.$toggleClass(this.clsBelow, this.scroll > this.bottomOffset);

                if (this.showOnUp) {
                    requestAnimationFrame(function () { return this$1.$addClass(this$1.clsFixed); });
                } else {
                    this.$addClass(this.clsFixed);
                }
            }

        }

    });

};

var svgs = {};
var parser = new DOMParser();

var Svg = function (UIkit) {

    UIkit.component('svg', {

        attrs: true,

        props: {
            id: String,
            icon: String,
            src: String,
            style: String,
            width: Number,
            height: Number,
            ratio: Number,
            'class': String
        },

        defaults: {
            ratio: 1,
            id: false,
            exclude: ['src'],
            'class': ''
        },

        init: function init() {
            this.class += ' uk-svg';
        },

        connected: function connected() {
            var this$1 = this;


            if (!this.icon && this.src && ~this.src.indexOf('#')) {

                var parts = this.src.split('#');

                if (parts.length > 1) {
                    this.src = parts[0];
                    this.icon = parts[1];
                }
            }

            this.width = this.$props.width;
            this.height = this.$props.height;

            this.svg = this.getSvg().then(function (doc) { return promise$$1(function (resolve, reject) {

                var svg, el;

                if (!doc) {
                    reject('SVG not found.');
                    return;
                }

                if (!this$1.icon) {
                    el = doc.documentElement.cloneNode(true);
                } else {
                    svg = doc.getElementById(this$1.icon);

                    if (!svg) {

                        // fallback if SVG has no symbols
                        if (!doc.querySelector('symbol')) {
                            el = doc.documentElement.cloneNode(true);
                        }

                    } else {

                        var html = svg.outerHTML;

                        // IE workaround
                        if (!html) {
                            var div = document.createElement('div');
                            div.appendChild(svg.cloneNode(true));
                            html = div.innerHTML;
                        }

                        html = html
                            .replace(/<symbol/g, ("<svg" + (!~html.indexOf('xmlns') ? ' xmlns="http://www.w3.org/2000/svg"' : '')))
                            .replace(/symbol>/g, 'svg>');

                        el = parser.parseFromString(html, 'image/svg+xml').documentElement;
                    }

                }

                if (!el) {
                    reject('SVG not found.');
                    return;
                }

                var dimensions = el.getAttribute('viewBox'); // jQuery workaround, el.attr('viewBox')

                if (dimensions) {
                    dimensions = dimensions.split(' ');
                    this$1.width = this$1.width || dimensions[2];
                    this$1.height = this$1.height || dimensions[3];
                }

                this$1.width *= this$1.ratio;
                this$1.height *= this$1.ratio;

                for (var prop in this$1.$options.props) {
                    if (this$1[prop] && !~this$1.exclude.indexOf(prop)) {
                        el.setAttribute(prop, this$1[prop]);
                    }
                }

                if (!this$1.id) {
                    el.removeAttribute('id');
                }

                if (this$1.width && !this$1.height) {
                    el.removeAttribute('height');
                }

                if (this$1.height && !this$1.width) {
                    el.removeAttribute('width');
                }

                var root = this$1.$el[0];
                if (isVoidElement$$1(root) || root.tagName === 'CANVAS') {

                    this$1.$el.attr({hidden: true, id: null});

                    if (root.nextSibling) {

                        if (el.isEqualNode(root.nextSibling)) {
                            el = root.nextSibling;
                        } else {
                            root.parentNode.insertBefore(el, root.nextSibling);
                        }

                    } else {
                        root.parentNode.appendChild(el);
                    }
                } else {

                    if (root.lastChild && el.isEqualNode(root.lastChild)) {
                        el = root.lastChild;
                    } else {
                        root.appendChild(el);
                    }

                }

                resolve(el);

            }); });

        },

        disconnected: function disconnected() {

            if (isVoidElement$$1(this.$el)) {
                this.$el.attr({hidden: null, id: this.id || null});
            }

            if (this.svg) {
                this.svg.then(function (svg) { return svg.parentNode && svg.parentNode.removeChild(svg); }, noop$$1);
                this.svg = null;
            }
        },

        methods: {

            getSvg: function getSvg() {
                var this$1 = this;


                if (!this.src) {
                    return promise$$1.reject();
                }

                if (svgs[this.src]) {
                    return svgs[this.src];
                }

                svgs[this.src] = promise$$1(function (resolve, reject) {

                    if (this$1.src.lastIndexOf('data:', 0) === 0) {
                        resolve(this$1.parse(decodeURIComponent(this$1.src.split(',')[1])));
                    } else {

                        $.ajax(this$1.src, {dataType: 'html'}).then(function (doc) {
                            resolve(this$1.parse(doc));
                        }, function () {
                            reject('SVG not found.');
                        });

                    }

                });

                return svgs[this.src];

            },

            parse: function parse(doc) {
                var parsed = parser.parseFromString(doc, 'image/svg+xml');
                return parsed.documentElement && parsed.documentElement.nodeName === 'svg' ? parsed : null;
            }

        }

    });

};

var Switcher = function (UIkit) {

    UIkit.component('switcher', {

        mixins: [Togglable],

        args: 'connect',

        props: {
            connect: String,
            toggle: String,
            active: Number,
            swiping: Boolean
        },

        defaults: {
            connect: false,
            toggle: ' > *',
            active: 0,
            swiping: true,
            cls: 'uk-active',
            clsContainer: 'uk-switcher',
            attrItem: 'uk-switcher-item',
            queued: true
        },

        computed: {

            connects: function connects() {
                return query$$1(this.connect, this.$el) || $__default(this.$el.next(("." + (this.clsContainer))));
            },

            toggles: function toggles() {
                return $__default(this.toggle, this.$el);
            }

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ((this.toggle) + ":not(.uk-disabled)");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.show(e.currentTarget);
                }

            },

            {
                name: 'click',

                el: function el() {
                    return this.connects;
                },

                delegate: function delegate() {
                    return ("[" + (this.attrItem) + "],[data-" + (this.attrItem) + "]");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.show($__default(e.currentTarget)[e.currentTarget.hasAttribute(this.attrItem) ? 'attr' : 'data'](this.attrItem));
                }
            },

            {
                name: 'swipeRight swipeLeft',

                filter: function filter() {
                    return this.swiping;
                },

                el: function el() {
                    return this.connects;
                },

                handler: function handler(e) {
                    if (!isTouch$$1(e)) {
                        return;
                    }

                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        this.show(e.type === 'swipeLeft' ? 'next' : 'previous');
                    }
                }
            }

        ],

        update: function update() {

            this.updateAria(this.connects.children());
            this.show(toJQuery$$1(this.toggles.filter(("." + (this.cls) + ":first"))) || toJQuery$$1(this.toggles.eq(this.active)) || this.toggles.first());

        },

        methods: {

            show: function show(item) {
                var this$1 = this;


                var length = this.toggles.length,
                    prev = this.connects.children(("." + (this.cls))).index(),
                    hasPrev = prev >= 0,
                    index = getIndex$$1(item, this.toggles, prev),
                    dir = item === 'previous' ? -1 : 1,
                    toggle;

                for (var i = 0; i < length; i++, index = (index + dir + length) % length) {
                    if (!this$1.toggles.eq(index).is('.uk-disabled, [disabled]')) {
                        toggle = this$1.toggles.eq(index);
                        break;
                    }
                }

                if (!toggle || prev >= 0 && toggle.hasClass(this.cls) || prev === index) {
                    return;
                }

                this.toggles.removeClass(this.cls).attr('aria-expanded', false);
                toggle.addClass(this.cls).attr('aria-expanded', true);

                if (!hasPrev) {
                    this.toggleNow(this.connects.children((":nth-child(" + (index + 1) + ")")));
                } else {
                    this.toggleElement(this.connects.children((":nth-child(" + (prev + 1) + "),:nth-child(" + (index + 1) + ")")));
                }
            }

        }

    });

};

var Tab = function (UIkit) {

    UIkit.component('tab', UIkit.components.switcher.extend({

        mixins: [Class],

        name: 'tab',

        props: {
            media: 'media'
        },

        defaults: {
            media: 960,
            attrItem: 'uk-tab-item'
        },

        init: function init() {

            var cls = this.$hasClass('uk-tab-left') && 'uk-tab-left' || this.$hasClass('uk-tab-right') && 'uk-tab-right';

            if (cls) {
                UIkit.toggle(this.$el, {cls: cls, mode: 'media', media: this.media});
            }
        }

    }));

};

var Toggle = function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.togglable],

        args: 'target',

        props: {
            href: String,
            target: null,
            mode: 'list',
            media: 'media'
        },

        defaults: {
            href: false,
            target: false,
            mode: 'click',
            queued: true,
            media: false
        },

        computed: {

            target: function target() {
                return query$$1(this.$props.target || this.href, this.$el) || this.$el;
            }

        },

        events: [

            {

                name: (pointerEnter + " " + pointerLeave),

                filter: function filter() {
                    return ~this.mode.indexOf('hover');
                },

                handler: function handler(e) {
                    if (!isTouch$$1(e)) {
                        this.toggle(("toggle" + (e.type === pointerEnter ? 'show' : 'hide')));
                    }
                }

            },

            {

                name: 'click',

                filter: function filter() {
                    return ~this.mode.indexOf('click') || hasTouch;
                },

                handler: function handler(e) {

                    if (!isTouch$$1(e) && !~this.mode.indexOf('click')) {
                        return;
                    }

                    // TODO better isToggled handling
                    var link = $__default(e.target).closest('a[href]')[0];
                    if ($__default(e.target).closest('a[href="#"], button').length
                        || link && (
                            this.cls
                            || !this.target.is(':visible')
                            || link.hash && this.target.is(link.hash)
                        )
                    ) {
                        e.preventDefault();
                    }

                    this.toggle();
                }

            }
        ],

        update: {

            write: function write() {

                if (!~this.mode.indexOf('media') || !this.media) {
                    return;
                }

                var toggled = this.isToggled(this.target);
                if (window.matchMedia(this.media).matches ? !toggled : toggled) {
                    this.toggle();
                }

            },

            events: ['load', 'resize']

        },

        methods: {

            toggle: function toggle(type) {
                if (!$trigger$$1(this.target, type || 'toggle', [this], true).isDefaultPrevented()) {
                    this.toggleElement(this.target);
                }
            }

        }

    });

};

var Leader = function (UIkit) {

    UIkit.component('leader', {

        mixins: [Class],

        props: {
            fill: String,
            media: 'media'
        },

        defaults: {
            fill: '',
            media: false,
            clsWrapper: 'uk-leader-fill',
            clsHide: 'uk-leader-hide',
            attrFill: 'data-fill'
        },

        computed: {

            fill: function fill() {
                return this.$props.fill || getCssVar('leader-fill');
            }

        },

        connected: function connected() {
            this.wrapper = this.$el.wrapInner(("<span class=\"" + (this.clsWrapper) + "\">")).children().first();
        },

        disconnected: function disconnected() {
            this.wrapper.contents().unwrap();
        },

        update: [

            {

                read: function read() {
                    var prev = this._width;
                    this._width = Math.floor(this.$el[0].offsetWidth / 2);
                    this._changed = prev !== this._width;
                    this._hide = this.media && !window.matchMedia(this.media).matches;
                },

                write: function write() {

                    this.wrapper.toggleClass(this.clsHide, this._hide);

                    if (this._changed) {
                        this.wrapper.attr(this.attrFill, new Array(this._width).join(this.fill));
                    }

               },

                events: ['load', 'resize']

            }
        ]
    });

};

var Video = function (UIkit) {

    UIkit.component('video', {

        props: {
            automute: Boolean,
            autoplay: Boolean,
        },

        defaults: {automute: false, autoplay: true},

        computed: {

            el: function el() {
                return this.$el[0];
            }

        },

        ready: function ready() {
            this.player = new Player$$1(this.el);

            if (this.automute) {
                this.player.mute();
            }

        },

        update: {

            write: function write() {

                if (!this.player || !this.autoplay) {
                    return;
                }

                if (this.el.offsetHeight === 0 || this.$el.css('visibility') === 'hidden') {
                    this.player.pause();
                } else {
                    this.player.play();
                }

            },

            events: ['load']

        },

    });

};

var core = function (UIkit) {

    var scroll = 0, started = 0;

    on$$1(window, 'load resize', UIkit.update);
    on$$1(window, 'scroll', function (e) {
        e.dir = scroll < window.pageYOffset ? 'down' : 'up';
        scroll = window.pageYOffset;
        UIkit.update(e);
        fastdom$$1.flush();
    });

    animationstart && on$$1(document, animationstart, function (ref) {
        var target = ref.target;

        if ((getStyle(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {
            started++;
            document.body.style.overflowX = 'hidden';
            setTimeout(function () {
                if (!--started) {
                    document.body.style.overflowX = '';
                }
            }, toMs$$1(getStyle(target, 'animationDuration')) + 100);
        }
    }, true);

    // core components
    UIkit.use(Toggle);
    UIkit.use(Accordion);
    UIkit.use(Alert);
    UIkit.use(Video);
    UIkit.use(Cover);
    UIkit.use(Drop);
    UIkit.use(Dropdown);
    UIkit.use(FormCustom);
    UIkit.use(HeightMatch);
    UIkit.use(HeightViewport);
    UIkit.use(Hover);
    UIkit.use(Margin);
    UIkit.use(Gif);
    UIkit.use(Grid);
    UIkit.use(Leader);
    UIkit.use(Modal$1);
    UIkit.use(Nav);
    UIkit.use(Navbar);
    UIkit.use(Offcanvas);
    UIkit.use(Responsive);
    UIkit.use(Scroll);
    UIkit.use(Scrollspy);
    UIkit.use(ScrollspyNav);
    UIkit.use(Sticky);
    UIkit.use(Svg);
    UIkit.use(Icon);
    UIkit.use(Switcher);
    UIkit.use(Tab);

};

var boot = function (UIkit) {

    var doc = document.documentElement;
    var connect = UIkit.connect;
    var disconnect = UIkit.disconnect;

    if (Observer) {

        if (document.body) {

            init();

        } else {

            (new Observer(function () {

                if (document.body) {
                    this.disconnect();
                    init();
                }

            })).observe(doc, {childList: true, subtree: true});

        }

    } else {

        ready$$1(function () {
            apply(document.body, connect);
            on$$1(doc, 'DOMNodeInserted', function (e) { return apply(e.target, connect); });
            on$$1(doc, 'DOMNodeRemoved', function (e) { return apply(e.target, disconnect); });
        });

    }

    function init() {

        apply(document.body, connect);

        fastdom$$1.flush();

        (new Observer(function (mutations) { return mutations.forEach(function (ref) {
                var addedNodes = ref.addedNodes;
                var removedNodes = ref.removedNodes;
                var target = ref.target;


                for (var i = 0; i < addedNodes.length; i++) {
                    apply(addedNodes[i], connect);
                }

                for (i = 0; i < removedNodes.length; i++) {
                    apply(removedNodes[i], disconnect);
                }

                UIkit.update('update', target, true);

            }); }
        )).observe(doc, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href']});

        UIkit._initialized = true;
    }

    function apply(node, fn) {

        if (node.nodeType !== Node.ELEMENT_NODE || node.hasAttribute('uk-no-boot')) {
            return;
        }

        fn(node);
        node = node.firstChild;
        while (node) {
            var next = node.nextSibling;
            apply(node, fn);
            node = next;
        }
    }

};

UIkit$1.version = '3.0.0-beta.28';

mixin(UIkit$1);
core(UIkit$1);

{
    boot(UIkit$1);
}

return UIkit$1;

})));
