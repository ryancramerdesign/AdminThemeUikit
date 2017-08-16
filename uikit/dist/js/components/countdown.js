/*! UIkit 3.0.0-beta.28 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('uikitcountdown', factory) :
	(global.UIkitCountdown = factory());
}(this, (function () { 'use strict';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.component('countdown', {

        mixins: [UIkit.mixin.class],

        attrs: true,

        props: {
            date: String,
            clsWrapper: String
        },

        defaults: {
            date: '',
            clsWrapper: '.uk-countdown-%unit%'
        },

        computed: {

            date: function date() {
                return Date.parse(this.$props.date);
            },

            days: function days() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'days'));
            },

            hours: function hours() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'hours'));
            },

            minutes: function minutes() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'minutes'));
            },

            seconds: function seconds() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'seconds'));
            },

            units: function units() {
                var this$1 = this;

                return ['days', 'hours', 'minutes', 'seconds'].filter(function (unit) { return this$1[unit].length; });
            }

        },

        connected: function connected() {
            this.start();
        },

        disconnected: function disconnected() {
            var this$1 = this;

            this.stop();
            this.units.forEach(function (unit) { return this$1[unit].empty(); });
        },

        update: {

            write: function write() {
                var this$1 = this;


                var timespan = getTimeSpan(this.date);

                if (timespan.total <= 0) {

                    this.stop();

                    timespan.days
                        = timespan.hours
                        = timespan.minutes
                        = timespan.seconds
                        = 0;
                }

                this.units.forEach(function (unit) {

                    var digits = String(Math.floor(timespan[unit]));

                    digits = digits.length < 2 ? ("0" + digits) : digits;

                    if (this$1[unit].text() !== digits) {
                        var el = this$1[unit];
                        digits = digits.split('');

                        if (digits.length !== el.children().length) {
                            el.empty().append(digits.map(function () { return '<span></span>'; }).join(''));
                        }

                        digits.forEach(function (digit, i) { return el[0].childNodes[i].innerText = digit; });
                    }

                });

            }

        },

        methods: {

            start: function start() {
                var this$1 = this;


                this.stop();

                if (this.date && this.units.length) {
                    this.$emit();
                    this.timer = setInterval(function () { return this$1.$emit(); }, 1000);
                }

            },

            stop: function stop() {

                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }

            }

        }

    });

    function getTimeSpan(date) {

        var total = date - Date.now();

        return {
            total: total,
            seconds: total / 1000 % 60,
            minutes: total / 1000 / 60 % 60,
            hours: total / 1000 / 60 / 60 % 24,
            days: total / 1000 / 60 / 60 / 24
        };
    }

}

if (!false && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

return plugin;

})));
