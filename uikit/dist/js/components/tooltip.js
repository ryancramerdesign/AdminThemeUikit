/*! UIkit 3.0.0-beta.28 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('uikittooltip', factory) :
	(global.UIkitTooltip = factory());
}(this, (function () { 'use strict';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var util = UIkit.util;
    var mixin = UIkit.mixin;
    var $ = util.$;
    var doc = util.doc;
    var fastdom = util.fastdom;
    var flipPosition = util.flipPosition;
    var isTouch = util.isTouch;
    var isWithin = util.isWithin;
    var pointerDown = util.pointerDown;
    var pointerEnter = util.pointerEnter;
    var pointerLeave = util.pointerLeave;

    var actives = [];

    UIkit.component('tooltip', {

        attrs: true,

        mixins: [mixin.togglable, mixin.position],

        props: {
            delay: Number,
            container: Boolean,
            title: String
        },

        defaults: {
            pos: 'top',
            title: '',
            delay: 0,
            animation: ['uk-animation-scale-up'],
            duration: 100,
            cls: 'uk-active',
            clsPos: 'uk-tooltip',
            container: true,
        },

        computed: {

            container: function container() {
                return $(this.$props.container === true && UIkit.container || this.$props.container || UIkit.container);
            }

        },

        connected: function connected() {
            var this$1 = this;

            fastdom.mutate(function () { return this$1.$el.removeAttr('title').attr('aria-expanded', false); });
        },

        disconnected: function disconnected() {
            this.hide();
        },

        methods: {

            show: function show() {
                var this$1 = this;


                if (~actives.indexOf(this)) {
                    return;
                }

                actives.forEach(function (active) { return active.hide(); });
                actives.push(this);

                doc.on(("click." + (this.$options.name)), function (e) {
                    if (!isWithin(e.target, this$1.$el)) {
                        this$1.hide();
                    }
                });

                clearTimeout(this.showTimer);

                this.tooltip = $(("<div class=\"" + (this.clsPos) + "\" aria-hidden=\"true\"><div class=\"" + (this.clsPos) + "-inner\">" + (this.title) + "</div></div>")).appendTo(this.container);

                this.$el.attr('aria-expanded', true);

                this.positionAt(this.tooltip, this.$el);
                this.origin = this.getAxis() === 'y' ? ((flipPosition(this.dir)) + "-" + (this.align)) : ((this.align) + "-" + (flipPosition(this.dir)));

                this.showTimer = setTimeout(function () {
                    this$1.toggleElement(this$1.tooltip, true);

                    this$1.hideTimer = setInterval(function () {
                        if (!this$1.$el.is(':visible')) {
                            this$1.hide();
                        }
                    }, 150);

                }, this.delay);
            },

            hide: function hide() {

                var index = actives.indexOf(this);

                if (!~index || this.$el.is('input') && this.$el[0] === document.activeElement) {
                    return;
                }

                actives.splice(index, 1);

                clearTimeout(this.showTimer);
                clearInterval(this.hideTimer);
                this.$el.attr('aria-expanded', false);
                this.toggleElement(this.tooltip, false);
                this.tooltip && this.tooltip.remove();
                this.tooltip = false;
                doc.off(("click." + (this.$options.name)));

            }

        },

        events: ( obj = {

            'blur': 'hide'

        }, obj[("focus " + pointerEnter + " " + pointerDown)] = function (e) {
                if (e.type !== pointerDown || !isTouch(e)) {
                    this.show();
                }
            }, obj[pointerLeave] = function (e) {
                if (!isTouch(e)) {
                    this.hide();
                }
            }, obj )

    });
    var obj;

}

if (!false && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

return plugin;

})));
