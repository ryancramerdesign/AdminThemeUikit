/*! UIkit 3.0.0-beta.28 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('uikitparallax', factory) :
	(global.UIkitParallax = factory());
}(this, (function () { 'use strict';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var mixin = UIkit.mixin;
    var util = UIkit.util;
    var assign = util.assign;
    var clamp = util.clamp;
    var Dimensions = util.Dimensions;
    var getImage = util.getImage;
    var isUndefined = util.isUndefined;
    var scrolledOver = util.scrolledOver;
    var query = util.query;

    var props = ['x', 'y', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

    mixin.parallax = {

        props: props.reduce(function (props, prop) {
            props[prop] = 'list';
            return props;
        }, {
            easing: Number,
            media: 'media'
        }),

        defaults: props.reduce(function (defaults, prop) {
            defaults[prop] = undefined;
            return defaults;
        }, {
            easing: 1,
            media: false
        }),

        computed: {

            props: function props$1() {
                var this$1 = this;


                return props.reduce(function (props, prop) {

                    if (isUndefined(this$1.$props[prop])) {
                        return props;
                    }

                    var isColor = prop.match(/color/i),
                        isCssProp = isColor || prop === 'opacity',
                        values = this$1.$props[prop];

                    if (isCssProp) {
                        this$1.$el.css(prop, '');
                    }

                    var start = (!isUndefined(values[1])
                            ? values[0]
                            : prop === 'scale'
                                ? 1
                                : isCssProp
                                    ? this$1.$el.css(prop)
                                    : 0) || 0,
                        end = isUndefined(values[1]) ? values[0] : values[1],
                        unit = ~values.join('').indexOf('%') ? '%' : 'px',
                        diff;

                    if (isColor) {

                        var color = this$1.$el[0].style.color;
                        this$1.$el[0].style.color = start;
                        start = parseColor(this$1.$el.css('color'));
                        this$1.$el[0].style.color = end;
                        end = parseColor(this$1.$el.css('color'));
                        this$1.$el[0].style.color = color;

                    } else {

                        start = parseFloat(start);
                        end = parseFloat(end);
                        diff = Math.abs(start - end);

                    }

                    props[prop] = {start: start, end: end, diff: diff, unit: unit};

                    if (prop.match(/^bg/)) {

                        var attr = "background-position-" + (prop[2]);
                        props[prop].pos = this$1.$el.css(attr, '').css('background-position').split(' ')[prop[2] === 'x' ? 0 : 1]; // IE 11 can't read background-position-[x|y]

                        if (this$1.covers) {
                            assign(props[prop], {start: 0, end: start <= end ? diff : -diff});
                        }
                    }

                    return props;

                }, {});

            },

            bgProps: function bgProps() {
                var this$1 = this;

                return ['bgx', 'bgy'].filter(function (bg) { return bg in this$1.props; });
            },

            covers: function covers() {
                return this.$el.css('backgroundSize', '').css('backgroundSize') === 'cover';
            }

        },

        disconnected: function disconnected() {
            delete this._image;
        },

        update: [

            {

                read: function read() {
                    var this$1 = this;


                    delete this._computeds.props;

                    this._active = !this.media || window.matchMedia(this.media).matches;

                    if (this._image) {
                        this._image.dimEl = {
                            width: this.$el[0].offsetWidth,
                            height: this.$el[0].offsetHeight
                        };
                    }

                    if (!isUndefined(this._image) || !this.covers || !this.bgProps.length) {
                        return;
                    }

                    var src = this.$el.css('backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

                    if (!src) {
                        return;
                    }

                    this._image = false;

                    getImage(src).then(function (img) {
                        this$1._image = {
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        };

                        this$1.$emit();
                    });

                },

                write: function write() {
                    var this$1 = this;


                    if (!this._image) {
                        return;
                    }

                    if (!this._active) {
                        this.$el.css({backgroundSize: '', backgroundRepeat: ''});
                        return;
                    }

                    var image = this._image,
                        dimEl = image.dimEl,
                        dim = Dimensions.cover(image, dimEl);

                    this.bgProps.forEach(function (prop) {

                        var ref = this$1.props[prop];
                        var start = ref.start;
                        var end = ref.end;
                        var pos = ref.pos;
                        var diff = ref.diff;
                        var attr = prop === 'bgy' ? 'height' : 'width',
                            span = dim[attr] - dimEl[attr];

                        if (!pos.match(/%$/)) {
                            return;
                        }

                        if (start >= end) {

                            if (span < diff) {
                                dimEl[attr] = dim[attr] + diff - span;
                                this$1.props[prop].pos = '0px';
                            } else {
                                pos = -1 * span / 100 * parseFloat(pos);
                                pos = clamp(pos, diff - span, 0);
                                this$1.props[prop].pos = pos + "px";
                            }

                        } else {

                            if (span < diff) {
                                dimEl[attr] = dim[attr] + diff - span;
                            } else if ((span / 100 * parseFloat(pos)) > diff) {
                                return;
                            }

                            this$1.props[prop].pos = "-" + diff + "px";

                        }

                        dim = Dimensions.cover(image, dimEl);
                    });

                    this.$el.css({
                        backgroundSize: ((dim.width) + "px " + (dim.height) + "px"),
                        backgroundRepeat: 'no-repeat'
                    });

                },

                events: ['load', 'resize']

            }

        ],

        methods: {

            reset: function reset() {
                var this$1 = this;

                Object.keys(this.getCss(0)).forEach(function (prop) { return this$1.$el.css(prop, ''); });
            },

            getCss: function getCss(percent) {

                var translated = false, props = this.props;
                return Object.keys(props).reduce(function (css, prop) {

                    var values = props[prop],
                        value = getValue(values, percent);

                    switch (prop) {

                        // transforms
                        case 'x':
                        case 'y':

                            if (translated) {
                                break;
                            }

                            var ref = ['x', 'y'].map(function (dir) { return prop === dir
                                ? value + values.unit
                                : props[dir]
                                    ? getValue(props[dir], percent) + props[dir].unit
                                    : 0; }
                            );
                    var x = ref[0];
                    var y = ref[1];

                            translated = css.transform += " translate3d(" + x + ", " + y + ", 0)";
                            break;
                        case 'rotate':
                            css.transform += " rotate(" + value + "deg)";
                            break;
                        case 'scale':
                            css.transform += " scale(" + value + ")";
                            break;

                        // bg image
                        case 'bgy':
                        case 'bgx':
                            css[("background-position-" + (prop[2]))] = "calc(" + (values.pos) + " + " + (value + values.unit) + ")";
                            break;

                        // color
                        case 'color':
                        case 'backgroundColor':
                        case 'borderColor':
                            css[prop] = "rgba(" + (values.start.map(function (value, i) {
                                    value = value + percent * (values.end[i] - value);
                                    return i === 3 ? parseFloat(value) : parseInt(value, 10);
                                }).join(',')) + ")";
                            break;

                        // CSS Filter
                        case 'blur':
                            css.filter += " blur(" + value + "px)";
                            break;
                        case 'hue':
                            css.filter += " hue-rotate(" + value + "deg)";
                            break;
                        case 'fopacity':
                            css.filter += " opacity(" + value + "%)";
                            break;
                        case 'grayscale':
                        case 'invert':
                        case 'saturate':
                        case 'sepia':
                            css.filter += " " + prop + "(" + value + "%)";
                            break;

                        default:
                            css[prop] = value;
                    }

                    return css;

                }, {transform: '', filter: ''});

            }

        }

    };

    UIkit.component('parallax', {

        mixins: [mixin.parallax],

        props: {
            target: String,
            viewport: Number
        },

        defaults: {
            target: false,
            viewport: 1
        },

        computed: {

            target: function target() {
                return this.$props.target && query(this.$props.target, this.$el) || this.$el;
            }

        },

        disconnected: function disconnected() {
            delete this._prev;
        },

        update: [

            {

                read: function read() {
                    delete this._prev;
                }

            },

            {

                read: function read() {

                    var percent = scrolledOver(this.target) / (this.viewport || 1);
                    this._percent = clamp(percent * (1 - (this.easing - this.easing * percent)));

                },

                write: function write() {

                    if (!this._active) {
                        this.reset();
                        return;
                    }

                    if (this._prev !== this._percent) {
                        this.$el.css(this.getCss(this._percent));
                        this._prev = this._percent;
                    }

                },

                events: ['scroll', 'load', 'resize']
            }

        ]

    });

    function parseColor(color) {
        return color.split(/[(),]/g).slice(1, -1).concat(1).slice(0, 4).map(function (n) { return parseFloat(n); });
    }

    function getValue(prop, percent) {
        return +(!isUndefined(prop.diff)
            ? prop.start + prop.diff * percent * (prop.start < prop.end ? 1 : -1)
            : +prop.end).toFixed(2);
    }

}

if (!false && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

return plugin;

})));
