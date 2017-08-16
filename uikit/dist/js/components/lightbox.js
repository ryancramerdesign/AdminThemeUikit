/*! UIkit 3.0.0-beta.28 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('uikitlightbox', factory) :
	(global.UIkitLightbox = factory());
}(this, (function () { 'use strict';

function plugin$2(UIkit) {

    if (plugin$2.installed) {
        return;
    }

    var ref = UIkit.util;
    var $ = ref.$;
    var doc = ref.doc;
    var fastdom = ref.fastdom;
    var getIndex = ref.getIndex;
    var noop = ref.noop;
    var on = ref.on;
    var off = ref.off;
    var pointerDown = ref.pointerDown;
    var pointerMove = ref.pointerMove;
    var pointerUp = ref.pointerUp;
    var preventClick = ref.preventClick;
    var promise = ref.promise;
    var requestAnimationFrame = ref.requestAnimationFrame;
    var Transition = ref.Transition;

    UIkit.mixin.slideshow = {

        attrs: true,

        props: {
            autoplay: Number,
            animation: String,
            transition: String,
            duration: Number
        },

        defaults: {
            autoplay: 0,
            animation: 'slide',
            transition: 'linear',
            duration: 400,
            index: 0,
            stack: [],
            threshold: 10,
            percent: 0,
            clsActive: 'uk-active'
        },

        computed: {

            slides: function slides() {
                return this.list.children(("." + (this.clsItem)));
            },

            forwardDuration: function forwardDuration() {
                return this.duration / 4;
            }

        },

        init: function init() {
            var this$1 = this;

            ['start', 'move', 'end'].forEach(function (key) {
                var fn = this$1[key];
                this$1[key] = function (e) {

                    e = e.originalEvent || e;

                    this$1.prevPos = this$1.pos;
                    this$1.pos = (e.touches && e.touches[0] || e).pageX;

                    fn(e);
                };
            });
        },

        connected: function connected() {
            this.startAutoplay();
        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ("[" + (this.attrItem) + "]");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.show($(e.currentTarget).blur().attr(this.attrItem));
                }

            },

            {

                name: pointerDown,

                delegate: function delegate() {
                    return ("." + (this.clsItem));
                },

                handler: 'start'
            },

            {

                name: pointerDown,
                handler: 'stopAutoplay'
            },

            {
                name: 'mouseenter',

                filter: function filter() {
                    return this.autoplay;
                },

                handler: function handler() {
                    this.isHovering = true;
                }
            },

            {
                name: 'mouseleave',

                filter: function filter() {
                    return this.autoplay;
                },

                handler: function handler() {
                    this.isHovering = false;
                }
            } ],

        methods: {

            start: function start(e) {

                if (e.button && e.button !== 0 || this.slides.length < 2) {
                    return;
                }

                e.preventDefault();

                var percent = 0;
                if (this.stack.length) {

                    this.percent = this._animation.percent();

                    var dir = this._animation.dir;
                    percent = this.percent * dir;

                    this.stack.splice(0, this.stack.length);

                    this._animation.cancel();
                    this._animation.translate(Math.abs(percent));

                    this.index = this.getIndex(this.index - dir);
                    this.touching = true;
                }

                on(doc, pointerMove, this.move, true);
                on(doc, pointerUp, this.end, true);

                var el = this.slides.eq(this.index);

                this.touch = {
                    el: el,
                    start: this.pos + (percent ? el.outerWidth() * percent : 0)
                };

            },

            move: function move(e) {
                var this$1 = this;


                e.preventDefault();

                var ref = this.touch;
                var start = ref.start;
                var el = ref.el;

                if (this.pos === this.prevPos || (!this.touching && Math.abs(start - this.pos) < this.threshold)) {
                    return;
                }

                this.touching = true;

                var percent = (this.pos - start) / el.outerWidth();

                if (this.percent === percent) {
                    return;
                }

                var changed = trunc(this.percent) !== trunc(percent),
                    index = this.getIndex(this.index - trunc(percent)),
                    current = this.slides.eq(index),
                    dir = percent < 0 ? 1 : -1,
                    nextIndex = getIndex(percent < 0 ? 'next' : 'previous', this.slides, index),
                    next = this.slides.eq(nextIndex);

                this.slides.each(function (i, el) { return this$1.$toggleClass(el, this$1.clsActive, i === index || i === nextIndex); });

                if (changed && this._animation) {
                    this._animation.reset();
                }

                this._animation = new Transitioner(this.animation, this.transition, current, next, dir, noop);
                this._animation.translate(Math.abs(percent % 1));

                this.percent = percent;

                UIkit.update(null, current);
                UIkit.update(null, next);
            },

            end: function end(e) {

                e.preventDefault();

                off(doc, pointerMove, this.move, true);
                off(doc, pointerUp, this.end, true);

                if (this.touching) {

                    var percent = this.percent;

                    this.percent = Math.abs(this.percent) % 1;
                    this.index = this.getIndex(this.index - trunc(percent));

                    if (this.percent < 0.2) {
                        this.index = this.getIndex(percent > 0 ? 'previous' : 'next');
                        this.percent = 1 - this.percent;
                        percent *= -1;
                    }

                    this.show(percent > 0 ? 'previous': 'next', true);

                    preventClick();

                }

                this.pos
                    = this.prevPos
                    = this.touch
                    = this.touching
                    = this.percent
                    = null;

            },

            show: function show(index, force) {
                var this$1 = this;
                if ( force === void 0 ) force = false;


                if (!force && this.touch) {
                    return;
                }

                this.stack[force ? 'unshift' : 'push'](index);

                if (!force && this.stack.length > 1) {

                    if (this.stack.length === 2) {
                        this._animation.forward(this.forwardDuration);
                    }

                    return;
                }

                var hasPrev = this.slides.hasClass('uk-active'),
                    dir = index === 'next'
                            ? 1
                            : index === 'previous'
                                ? -1
                                : index < this.index
                                    ? -1
                                    : 1;

                index = this.getIndex(index);

                if (hasPrev && index === this.index) {
                    this.stack[force ? 'shift' : 'pop']();
                    return;
                }

                var prev = hasPrev && this.slides.eq(this.index),
                    next = this.slides.eq(index);

                this.$el.trigger('beforeitemshow', [this, next]);
                prev && this.$el.trigger('beforeitemhide', [this, prev]);

                this.index = index;

                this.$addClass(next, this.clsActive);

                this._animation = new Transitioner(!prev ? 'scale' : this.animation, this.transition, prev || next, next, dir, function () {

                    prev && this$1.$removeClass(prev, this$1.clsActive);

                    this$1.stack.shift();
                    if (this$1.stack.length) {
                        requestAnimationFrame(function () { return this$1.show(this$1.stack.shift(), true); });
                    } else {
                        this$1._animation = null;
                    }

                    this$1.$el.trigger('itemshown', [this$1, next]);
                    UIkit.update(null, next);

                    if (prev) {
                        this$1.$el.trigger('itemhidden', [this$1, prev]);
                        UIkit.update(null, prev);
                    }

                });

                this._animation.show(this.stack.length > 1 ? this.forwardDuration : this.duration, this.percent);

                this.$el.trigger('itemshow', [this, next]);

                if (prev) {
                    this.$el.trigger('itemhide', [this, prev]);
                    UIkit.update(null, prev);
                }

                UIkit.update(null, next);
                fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler
            },

            getIndex: function getIndex$1(index) {
                if ( index === void 0 ) index = this.index;

                return getIndex(index, this.slides, this.index);
            },

            startAutoplay: function startAutoplay() {
                var this$1 = this;


                this.stopAutoplay();

                if (this.autoplay) {
                    this.interval = setInterval(function () {!this$1.isHovering && this$1.show('next');}, this.autoplay);
                }

            },

            stopAutoplay: function stopAutoplay() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            }

        }

    };

    var diff = 0.2;
    var Animations = {

        fade: {

            show: function show() {
                return [
                    {opacity: 0},
                    {opacity: 1}
                ];
            },

            percent: function percent(current) {
                return 1 - current.css('opacity');
            },

            translate: function translate(percent) {
                return [
                    {opacity: 1 - percent},
                    {opacity: percent}
                ];
            }

        },

        slide: {

            show: function show(dir) {
                return [
                    {transform: ("translate3d(" + (dir * -100) + "%, 0, 0)")},
                    {transform: 'translate3d(0, 0, 0)'}
                ];
            },

            percent: function percent(current) {
                return Math.abs(current.css('transform').split(',')[4] / current.outerWidth());
            },

            translate: function translate(percent, dir) {
                return [
                    {transform: ("translate3d(" + (dir * -100 * percent) + "%, 0, 0)")},
                    {transform: ("translate3d(" + (dir * 100 * (1 - percent)) + "%, 0, 0)")}
                ];
            }

        },

        scale: {

            show: function show() {
                return [
                    {opacity: 0, transform: ("scale3d(" + (1 - diff) + ", " + (1 - diff) + ", 1)")},
                    {opacity: 1, transform: 'scale3d(1, 1, 1)'}
                ];
            },

            percent: function percent(current) {
                return 1 - current.css('opacity');
            },

            translate: function translate(percent) {
                var scale1 = 1 - diff * percent,
                    scale2 = 1 - diff + diff * percent;

                return [
                    {opacity: 1 - percent, transform: ("scale3d(" + scale1 + ", " + scale1 + ", 1)")},
                    {opacity: percent, transform: ("scale3d(" + scale2 + ", " + scale2 + ", 1)")}
                ];
            }

        },

        swipe: {

            show: function show(dir) {

                if (dir < 0) {
                    return [
                        {opacity: 1, transform: "translate3d(100%, 0, 0)", zIndex: 0},
                        {opacity: 1, transform: "scale3d(1, 1, 1) translate3d(0, 0, 0)", zIndex: -1} ];
                } else {
                    return [
                        {opacity: 0.3, transform: ("scale3d(" + (1 - diff) + ", " + (1 - diff) + ", 1) translate3d(-20%, 0, 0)"), zIndex: -1},
                        {opacity: 1, transform: 'translate3d(0, 0, 0)', zIndex: 0}
                    ];
                }


            },

            percent: function percent(current, next, dir) {

                var el = dir < 0 ? current : next,
                    percent = Math.abs(el.css('transform').split(',')[4] / el.outerWidth());

                return dir < 0 ? percent : 1 - percent;
            },

            translate: function translate(percent, dir) {
                var scale;

                if (dir < 0) {
                    scale = 1 - diff * (1 - percent);
                    return [
                        {opacity: 1, transform: ("translate3d(" + (100 * percent) + "%, 0, 0)"), zIndex: 0},
                        {opacity: 0.3 + 0.7 * percent, transform: ("scale3d(" + scale + ", " + scale + ", 1) translate3d(" + (-20 * (1 - percent)) + "%, 0, 0)"), zIndex: -1} ];
                } else {
                    scale = 1 - diff * percent;
                    return [
                        {opacity: 1 - 0.7 * percent, transform: ("scale3d(" + scale + ", " + scale + ", 1) translate3d(" + (-20 * percent) + "%, 0, 0)"), zIndex: -1},
                        {opacity: 1, transform: ("translate3d(" + (100 * (1 - percent)) + "%, 0, 0)"), zIndex: 0}
                    ];
                }

            }

        },

    };

    function Transitioner (animation, transition, current, next, dir, cb) {

        animation = animation in Animations ? Animations[animation] : Animations.slide;

        var props = animation.show(dir);

        return {

            dir: dir,
            current: current,
            next: next,

            show: function show(duration, percent) {
                var this$1 = this;
                if ( percent === void 0 ) percent = 0;


                duration -= Math.round(duration * percent);

                this.translate(percent);

                return promise.all([
                    Transition.start(current, props[0], duration, transition),
                    Transition.start(next, props[1], duration, transition)
                ]).then(function () {
                    this$1.reset();
                    cb();
                }, noop);
            },

            stop: function stop() {
                return promise.all([
                    Transition.stop(next),
                    Transition.stop(current)
                ]);
            },

            cancel: function cancel() {
                return promise.all([
                    Transition.cancel(next),
                    Transition.cancel(current)
                ]);
            },

            reset: function reset() {
                for (var prop in props[0]) {
                    $([next[0], current[0]]).css(prop, '');
                }
            },

            forward: function forward(duration) {
                var this$1 = this;


                var percent = this.percent();

                return promise.all([
                    Transition.cancel(next),
                    Transition.cancel(current)
                ]).then(function () { return this$1.show(duration, percent); });

            },

            translate: function translate(percent) {

                var props = animation.translate(percent, dir);
                current.css(props[0]);
                next.css(props[1]);

            },

            percent: function percent() {
                return animation.percent(current, next, dir);
            }

        }

    }

    // polyfill for Math.trunc (IE)
    function trunc(x) {
        return ~~x;
    }

}

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(plugin$2);

    var mixin = UIkit.mixin;
    var util = UIkit.util;
    var $ = util.$;
    var $trigger = util.$trigger;
    var Animation = util.Animation;
    var ajax = util.ajax;
    var assign = util.assign;
    var doc = util.doc;
    var docElement = util.docElement;
    var getData = util.getData;
    var getImage = util.getImage;
    var pointerDown = util.pointerDown;
    var pointerMove = util.pointerMove;
    var Transition = util.Transition;

    UIkit.component('lightbox', {

        attrs: true,

        props: {
            animation: String,
            toggle: String
        },

        defaults: {
            animation: undefined,
            toggle: 'a'
        },

        computed: {

            toggles: function toggles() {
                var this$1 = this;

                var toggles = $(this.toggle, this.$el);

                this._changed = !this._toggles
                    || toggles.length !== this._toggles.length
                    || toggles.toArray().some(function (el, i) { return el !== this$1._toggles.get(i); });

                return this._toggles = toggles;
            }

        },

        disconnected: function disconnected() {

            if (this.panel) {
                this.panel.$destroy(true);
                this.panel = null;
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
                    this.show(this.toggles.index($(e.currentTarget).blur()));
                }

            }

        ],

        update: function update() {

            if (this.panel && this.animation) {
                this.panel.$props.animation = this.animation;
                this.panel.$emit();
            }

            if (!this.toggles.length || !this._changed || !this.panel) {
                return;
            }

            this.panel.$destroy(true);
            this._init();

        },

        methods: {

            _init: function _init() {
                return this.panel = this.panel || UIkit.lightboxPanel({
                        animation: this.animation,
                        items: this.toggles.toArray().reduce(function (items, el) {
                            items.push(['href', 'caption', 'type'].reduce(function (obj, attr) {
                                obj[attr === 'href' ? 'source' : attr] = getData(el, attr);
                                return obj;
                            }, {}));
                            return items;
                        }, [])
                    });
            },

            show: function show(index) {

                if (!this.panel) {
                    this._init();
                }

                return this.panel.show(index);

            },

            hide: function hide() {

                return this.panel && this.panel.hide();

            }

        }

    });

    UIkit.component('lightbox-panel', {

        mixins: [mixin.togglable, mixin.slideshow],

        functional: true,

        defaults: {
            preload: 1,
            delayControls: 3000,
            items: [],
            cls: 'uk-open',
            clsPage: 'uk-lightbox-page',
            clsItem: 'uk-lightbox-item',
            attrItem: 'uk-lightbox-item',
            template: " <div class=\"uk-lightbox uk-overflow-hidden\"> <ul class=\"uk-lightbox-items\"></ul> <div class=\"uk-lightbox-toolbar uk-position-top uk-text-right\"> <button class=\"uk-lightbox-toolbar-icon uk-close-large\" type=\"button\" uk-close uk-toggle=\"!.uk-lightbox\"></button> </div> <a class=\"uk-lightbox-button uk-position-center-left uk-position-medium\" href=\"#\" uk-slidenav-previous uk-lightbox-item=\"previous\"></a> <a class=\"uk-lightbox-button uk-position-center-right uk-position-medium\" href=\"#\" uk-slidenav-next uk-lightbox-item=\"next\"></a> <div class=\"uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center\"></div> </div>"
        },

        computed: {

            container: function container() {
                return $(this.$props.container === true && UIkit.container || this.$props.container || UIkit.container);
            }

        },

        created: function created() {
            var this$1 = this;


            this.$mount($(this.template).appendTo(this.container)[0]);

            this.list = this.$el.find('.uk-lightbox-items');
            this.toolbars = this.$el.find('.uk-lightbox-toolbar');
            this.nav = this.$el.find('a[uk-lightbox-item]');
            this.caption = this.$el.find('.uk-lightbox-caption');

            this.items.forEach(function (el, i) { return this$1.list.append(("<li class=\"" + (this$1.clsItem) + " item-" + i + "\"></li>")); });

        },

        events: [

            {

                name: (pointerMove + " " + pointerDown + " keydown"),

                handler: 'showControls'

            },

            {

                name: 'click',

                self: true,

                handler: function handler(e) {
                    e.preventDefault();
                    this.hide();
                }

            },

            {

                name: 'click',

                self: true,

                delegate: function delegate() {
                    return ("." + (this.clsItem));
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.hide();
                }

            },

            {

                name: 'show',

                self: true,

                handler: function handler() {

                    this.$addClass(docElement, this.clsPage);

                }
            },

            {

                name: 'shown',

                self: true,

                handler: function handler() {

                    this.$addClass(this.caption, 'uk-animation-slide-bottom');
                    this.toolbars.attr('hidden', true);
                    this.nav.attr('hidden', true);
                    this.showControls();

                }
            },

            {

                name: 'hide',

                self: true,

                handler: function handler() {

                    this.$removeClass(this.caption, 'uk-animation-slide-bottom');
                    this.toolbars.attr('hidden', true);
                    this.nav.attr('hidden', true);

                }
            },

            {

                name: 'hidden',

                self: true,

                handler: function handler() {

                    this.$removeClass(docElement, this.clsPage);

                }
            },

            {

                name: 'keydown',

                el: function el() {
                    return doc;
                },

                handler: function handler(e) {

                    if (!this.isToggled(this.$el)) {
                        return;
                    }

                    switch (e.keyCode) {
                        case 27:
                            this.hide();
                            break;
                        case 37:
                            this.show('previous');
                            break;
                        case 39:
                            this.show('next');
                            break;
                    }
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

                name: 'beforeitemshow',

                self: true,

                handler: function handler() {
                    if (!this.isToggled()) {
                        this.toggleNow(this.$el, true);
                    }
                }

            },

            {

                name: 'itemshow',

                self: true,

                handler: function handler() {
                    var this$1 = this;


                    var caption = this.getItem().caption;
                    this.caption.toggle(!!caption).html(caption);

                    for (var i = 0; i <= this.preload; i++) {
                        this$1.loadItem(this$1.getIndex(this$1.index + i));
                        this$1.loadItem(this$1.getIndex(this$1.index - i));
                    }

                }

            },

            {

                name: 'itemload',

                handler: function handler(_, item) {
                    var this$1 = this;


                    var source = item.source;
                    var type = item.type;
                    var matches;

                    this.setItem(item, '<span uk-spinner></span>');

                    if (!source) {
                        return;
                    }

                    // Image
                    if (type === 'image' || source.match(/\.(jp(e)?g|png|gif|svg)$/i)) {

                        getImage(source).then(
                            function (img) { return this$1.setItem(item, ("<img width=\"" + (img.width) + "\" height=\"" + (img.height) + "\" src=\"" + source + "\">")); },
                            function () { return this$1.setError(item); }
                        );

                    // Video
                    } else if (type === 'video' || source.match(/\.(mp4|webm|ogv)$/i)) {

                        var video = $('<video controls playsinline uk-video></video>')
                            .on('loadedmetadata', function () { return this$1.setItem(item, video.attr({width: video[0].videoWidth, height: video[0].videoHeight})); })
                            .on('error', function () { return this$1.setError(item); })
                            .attr('src', source);

                    // Iframe
                    } else if (type === 'iframe') {

                        this.setItem(item, ("<iframe class=\"uk-lightbox-iframe\" src=\"" + source + "\" frameborder=\"0\" allowfullscreen></iframe>"));

                    // Youtube
                    } else if (matches = source.match(/\/\/.*?youtube\.[a-z]+\/watch\?v=([^&\s]+)/) || source.match(/youtu\.be\/(.*)/)) {

                        var id = matches[1],
                            setIframe = function (width, height) {
                                if ( width === void 0 ) width = 640;
                                if ( height === void 0 ) height = 450;

                                return this$1.setItem(item, getIframe(("//www.youtube.com/embed/" + id), width, height));
                        };

                        getImage(("//img.youtube.com/vi/" + id + "/maxresdefault.jpg")).then(
                            function (img) {
                                //youtube default 404 thumb, fall back to lowres
                                if (img.width === 120 && img.height === 90) {
                                    getImage(("//img.youtube.com/vi/" + id + "/0.jpg")).then(
                                        function (img) { return setIframe(img.width, img.height); },
                                        setIframe
                                    );
                                } else {
                                    setIframe(img.width, img.height);
                                }
                            },
                            setIframe
                        );

                    // Vimeo
                    } else if (matches = source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/)) {

                        ajax({type: 'GET', url: ("//vimeo.com/api/oembed.json?url=" + (encodeURI(source))), jsonp: 'callback', dataType: 'jsonp'})
                            .then(function (ref) {
                                var height = ref.height;
                                var width = ref.width;

                                return this$1.setItem(item, getIframe(("//player.vimeo.com/video/" + (matches[2])), width, height));
                        });

                    } else {

                        return;

                    }

                    return true;

                }

            }

        ],

        methods: {

            toggle: function toggle() {
                return this.isToggled() ? this.hide() : this.show();
            },

            hide: function hide() {

                if (this.isToggled()) {
                    this.toggleNow(this.$el, false);
                }

                this.slides
                    .removeClass(this.clsActive)
                    .each(function (_, el) { return Transition.stop(el); });

                delete this.index;
                delete this.percent;
                delete this._animation;

            },

            loadItem: function loadItem(index) {
                if ( index === void 0 ) index = this.index;


                var item = this.getItem(index);

                if (item.content) {
                    return;
                }

                if (!$trigger(this.$el, 'itemload', [item], true).result) {
                    this.setError(item);
                }
            },

            getItem: function getItem(index) {
                if ( index === void 0 ) index = this.index;

                return this.items[index] || {};
            },

            setItem: function setItem(item, content) {
                assign(item, {content: content});
                var el = this.slides.eq(this.items.indexOf(item)).html(content);
                this.$el.trigger('itemloaded', [this, el]);
                UIkit.update(null, el);
            },

            setError: function setError(item) {
                this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
            },

            showControls: function showControls() {

                clearTimeout(this.controlsTimer);
                this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

                if (!this.toolbars.attr('hidden')) {
                    return;
                }

                animate(this.toolbars.eq(0), 'uk-animation-slide-top');
                animate(this.toolbars.eq(1), 'uk-animation-slide-bottom');

                this.nav.attr('hidden', this.items.length <= 1);

                if (this.items.length > 1) {
                    animate(this.nav, 'uk-animation-fade');
                }

            },

            hideControls: function hideControls() {

                if (this.toolbars.attr('hidden')) {
                    return;
                }

                animate(this.toolbars.eq(0), 'uk-animation-slide-top', 'out');
                animate(this.toolbars.eq(1), 'uk-animation-slide-bottom', 'out');

                if (this.items.length > 1) {
                    animate(this.nav, 'uk-animation-fade', 'out');
                }

            }

        }

    });

    function animate(el, animation, dir) {
        if ( dir === void 0 ) dir = 'in';

        el.each(function (i) { return Animation[dir](el.eq(i).attr('hidden', false), animation).then(function () { dir === 'out' && el.eq(i).attr('hidden', true);}); });
    }

    function getIframe(src, width, height) {
        return ("<iframe src=\"" + src + "\" width=\"" + width + "\" height=\"" + height + "\" style=\"max-width: 100%; box-sizing: border-box;\" uk-video uk-responsive></iframe>");
    }

}

if (!false && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

return plugin;

})));
