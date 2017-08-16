/*! UIkit 3.0.0-beta.28 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('uikitsortable', factory) :
	(global.UIkitSortable = factory());
}(this, (function () { 'use strict';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var mixin = UIkit.mixin;
    var util = UIkit.util;
    var $ = util.$;
    var assign = util.assign;
    var doc = util.docElement;
    var docHeight = util.docHeight;
    var fastdom = util.fastdom;
    var getDimensions = util.getDimensions;
    var isWithin = util.isWithin;
    var offset = util.offset;
    var offsetTop = util.offsetTop;
    var pointerDown = util.pointerDown;
    var pointerMove = util.pointerMove;
    var pointerUp = util.pointerUp;
    var preventClick = util.preventClick;
    var promise = util.promise;
    var win = util.win;

    UIkit.component('sortable', {

        mixins: [mixin.class],

        props: {
            group: String,
            animation: Number,
            threshold: Number,
            clsItem: String,
            clsPlaceholder: String,
            clsDrag: String,
            clsDragState: String,
            clsBase: String,
            clsNoDrag: String,
            clsEmpty: String,
            clsCustom: String,
            handle: String
        },

        defaults: {
            group: false,
            animation: 150,
            threshold: 5,
            clsItem: 'uk-sortable-item',
            clsPlaceholder: 'uk-sortable-placeholder',
            clsDrag: 'uk-sortable-drag',
            clsDragState: 'uk-drag',
            clsBase: 'uk-sortable',
            clsNoDrag: 'uk-sortable-nodrag',
            clsEmpty: 'uk-sortable-empty',
            clsCustom: '',
            handle: false
        },

        init: function init() {
            var this$1 = this;

            ['init', 'start', 'move', 'end'].forEach(function (key) {
                var fn = this$1[key];
                this$1[key] = function (e) {
                    e = e.originalEvent || e;
                    this$1.scrollY = window.scrollY;
                    var ref = e.touches && e.touches[0] || e;
                    var x = ref.pageX;
                    var y = ref.pageY;
                    this$1.pos = {x: x, y: y};

                    fn(e);
                };
            });
        },

        events: ( obj = {}, obj[pointerDown] = 'init', obj ),

        update: {

            write: function write() {
                var this$1 = this;


                if (this.clsEmpty) {
                    this.$toggleClass(this.clsEmpty, !this.$el.children().length);
                }

                if (!this.drag) {
                    return;
                }

                offset(this.drag, {top: this.pos.y + this.origin.top, left: this.pos.x + this.origin.left});

                var top = offsetTop(this.drag), bottom = top + this.drag[0].offsetHeight;

                if (top > 0 && top < this.scrollY) {
                    setTimeout(function () { return win.scrollTop(this$1.scrollY - 5); }, 5);
                } else if (bottom < docHeight() && bottom > window.innerHeight + this.scrollY) {
                    setTimeout(function () { return win.scrollTop(this$1.scrollY + 5); }, 5);
                }

            }

        },

        methods: {

            init: function init(e) {

                var target = $(e.target), placeholder = this.$el.children().filter(function (i, el) { return isWithin(e.target, el); });

                if (!placeholder.length
                    || target.is(':input')
                    || this.handle && !isWithin(target, this.handle)
                    || e.button && e.button !== 0
                    || isWithin(target, ("." + (this.clsNoDrag)))
                    || e.defaultPrevented
                ) {
                    return;
                }

                e.preventDefault();

                this.touched = [this];
                this.placeholder = placeholder;
                this.origin = assign({target: target, index: this.placeholder.index()}, this.pos);

                doc.on(pointerMove, this.move);
                doc.on(pointerUp, this.end);
                win.on('scroll', this.scroll);

                if (!this.threshold) {
                    this.start(e);
                }

            },

            start: function start(e) {

                this.drag = $(this.placeholder[0].outerHTML.replace(/^<li/i, '<div').replace(/li>$/i, 'div>'))
                    .attr('uk-no-boot', '')
                    .addClass(((this.clsDrag) + " " + (this.clsCustom)))
                    .css({
                        boxSizing: 'border-box',
                        width: this.placeholder.outerWidth(),
                        height: this.placeholder.outerHeight()
                    })
                    .css(this.placeholder.css(['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']))
                    .appendTo(UIkit.container);

                this.drag.children().first().height(this.placeholder.children().height());

                var ref = getDimensions(this.placeholder);
                var left = ref.left;
                var top = ref.top;
                assign(this.origin, {left: left - this.pos.x, top: top - this.pos.y});

                this.placeholder.addClass(this.clsPlaceholder);
                this.$el.children().addClass(this.clsItem);
                doc.addClass(this.clsDragState);

                this.$el.trigger('start', [this, this.placeholder, this.drag]);

                this.move(e);
            },

            move: function move(e) {

                if (!this.drag) {

                    if (Math.abs(this.pos.x - this.origin.x) > this.threshold || Math.abs(this.pos.y - this.origin.y) > this.threshold) {
                        this.start(e);
                    }

                    return;
                }

                this.$emit();

                var target = e.type === 'mousemove' ? e.target : document.elementFromPoint(this.pos.x - document.body.scrollLeft, this.pos.y - document.body.scrollTop),
                    sortable = getSortable(target),
                    previous = getSortable(this.placeholder[0]),
                    move = sortable !== previous;

                if (!sortable || isWithin(target, this.placeholder) || move && (!sortable.group || sortable.group !== previous.group)) {
                    return;
                }

                target = sortable.$el.is(target.parentNode) && $(target) || sortable.$el.children().has(target);

                if (move) {
                    previous.remove(this.placeholder);
                } else if (!target.length) {
                    return;
                }

                sortable.insert(this.placeholder, target);

                if (!~this.touched.indexOf(sortable)) {
                    this.touched.push(sortable);
                }

            },

            scroll: function scroll() {
                var scroll = window.scrollY;
                if (scroll !== this.scrollY) {
                    this.pos.y += scroll - this.scrollY;
                    this.scrollY = scroll;
                    this.$emit();
                }
            },

            end: function end(e) {

                doc.off(pointerMove, this.move);
                doc.off(pointerUp, this.end);
                win.off('scroll', this.scroll);

                if (!this.drag) {

                    if (e.type !== 'mouseup' && isWithin(e.target, 'a[href]')) {
                        location.href = $(e.target).closest('a[href]').attr('href');
                    }

                    return;
                }

                preventClick();

                var sortable = getSortable(this.placeholder[0]);

                if (this === sortable) {
                    if (this.origin.index !== this.placeholder.index()) {
                        this.$el.trigger('change', [this, this.placeholder, 'moved']);
                    }
                } else {
                    sortable.$el.trigger('change', [sortable, this.placeholder, 'added']);
                    this.$el.trigger('change', [this, this.placeholder, 'removed']);
                }

                this.$el.trigger('stop', [this]);

                this.drag.remove();
                this.drag = null;

                var classes = this.touched.map(function (sortable) { return ((sortable.clsPlaceholder) + " " + (sortable.clsItem)); }).join(' ');
                this.touched.forEach(function (sortable) { return sortable.$el.children().removeClass(classes); });

                doc.removeClass(this.clsDragState);

            },

            insert: function insert(element, target) {
                var this$1 = this;


                this.$el.children().addClass(this.clsItem);

                var insert = function () {

                    if (target.length) {

                        if (!this$1.$el.has(element).length || element.prevAll().filter(target).length) {
                            element.insertBefore(target);
                        } else {
                            element.insertAfter(target);
                        }

                    } else {
                        this$1.$el.append(element);
                    }

                };

                if (this.animation) {
                    this.animate(insert);
                } else {
                    insert();
                }

            },

            remove: function remove(element) {

                if (!this.$el.has(element).length) {
                    return;
                }

                if (this.animation) {
                    this.animate(function () { return element.detach(); });
                } else {
                    element.detach();
                }

            },

            animate: function animate(action) {
                var this$1 = this;


                var props = [],
                    children = this.$el.children().toArray().map(function (el) {
                        el = $(el);
                        props.push(assign({
                            position: 'absolute',
                            pointerEvents: 'none',
                            width: el.outerWidth(),
                            height: el.outerHeight()
                        }, el.position()));
                        return el;
                    }),
                    reset = {position: '', width: '', height: '', pointerEvents: '', top: '', left: ''};

                action();

                children.forEach(function (el) { return el.stop(); });
                this.$el.children().css(reset);
                this.$update('update', true);
                fastdom.flush();

                this.$el.css('min-height', this.$el.height());

                var positions = children.map(function (el) { return el.position(); });
                promise.all(children.map(function (el, i) { return el.css(props[i]).animate(positions[i], this$1.animation).promise(); }))
                    .then(function () {
                        this$1.$el.css('min-height', '').children().css(reset);
                        this$1.$update('update', true);
                        fastdom.flush();
                    });

            }

        }

    });
    var obj;

    function getSortable(element) {
        return UIkit.getComponent(element, 'sortable') || element.parentNode && getSortable(element.parentNode);
    }

}

if (!false && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

return plugin;

})));
