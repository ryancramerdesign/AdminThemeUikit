/*! UIkit 3.0.0-beta.28 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('uikitgrid_parallax', factory) :
	(global.UIkitGrid_parallax = factory());
}(this, (function () { 'use strict';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var ref = UIkit.util;
    var scrolledOver = ref.scrolledOver;

    UIkit.component('grid-parallax', UIkit.components.grid.extend({

        props: {
            target: String,
            translate: Number
        },

        defaults: {
            target: false,
            translate: 150
        },

        init: function init() {
            this.$addClass('uk-grid');
        },

        disconnected: function disconnected() {
            this.reset();
            this.$el.css('margin-bottom', '');
        },

        computed: {

            translate: function translate() {
                return Math.abs(this.$props.translate);
            },

            items: function items() {
                return (this.target ? this.$el.find(this.target) : this.$el.children()).toArray();
            }

        },

        update: [

            {

                read: function read() {
                    this.columns = this.rows && this.rows[0] && this.rows[0].length || 0;
                    this.rows = this.rows && this.rows.map(function (elements) { return sortBy(elements, 'offsetLeft'); });
                },

                write: function write() {
                    this.$el
                        .css('margin-bottom', '')
                        .css('margin-bottom', this.columns > 1 ? this.translate + parseFloat(this.$el.css('margin-bottom')) : '');
                },

                events: ['load', 'resize']
            },

            {

                read: function read() {

                    this.scrolled = scrolledOver(this.$el) * this.translate;

                },

                write: function write() {
                    var this$1 = this;


                    if (!this.rows || this.columns === 1 || !this.scrolled) {
                        return this.reset();
                    }

                    this.rows.forEach(function (row) { return row.forEach(function (el, i) { return el.style.transform = "translateY(" + (i % 2 ? this$1.scrolled : this$1.scrolled / 8) + "px)"; }
                        ); }
                    );

                },

                events: ['scroll', 'load', 'resize']
            }
        ],

        methods: {

            reset: function reset() {
                this.items.forEach(function (item) { return item.style.transform = ''; });
            }

        }

    }));

    UIkit.component('grid-parallax').options.update.unshift({

        read: function read() {
            this.reset();
        },

        events: ['load', 'resize']

    });

    function sortBy(collection, prop) {
        return collection.sort(function (a,b) { return a[prop] > b[prop]
                ? 1
                : b[prop] > a[prop]
                    ? -1
                    : 0; }
        )
    }

}



if (!false && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

return plugin;

})));
