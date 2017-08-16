/*! UIkit 3.0.0-beta.28 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define('uikittest', factory) :
	(factory());
}(this, (function () { 'use strict';

var storage = window.sessionStorage;
var key = '_uikit_style';
var keyinverse = '_uikit_inverse';
var themes = {};
var $html = $('html');

// try to load themes.json
var request = new XMLHttpRequest();
request.open('GET', '../themes.json', false);
request.send(null);

if (request.status === 200) {
    themes = JSON.parse(request.responseText);
}

var styles = $.extend({
        core: {css: '../dist/css/uikit-core.css'},
        theme: {css: '../dist/css/uikit.css'}
    }, themes);
var component = location.pathname.split('/').pop().replace(/.html$/, '');

if (getParam('style') && getParam('style').match(/\.(json|css)$/)) {
    styles.custom = getParam('style');
}

storage[key] = storage[key] || 'core';
storage[keyinverse] = storage[keyinverse] || 'default';

var dir = storage._uikit_dir || 'ltr';

// set dir
$html.attr('dir', dir);

var style = styles[storage[key]] || styles.theme;

// add style
document.writeln(("<link rel=\"stylesheet\" href=\"" + (dir !== 'rtl' ? style.css : style.css.replace('.css', '').concat('-rtl.css')) + "\">"));

// add javascript
document.writeln("<script src=\"../dist/js/uikit.js\"></script>");
document.writeln(("<script src=\"" + (style.icons ? style.icons : '../dist/js/uikit-icons.js') + "\"></script>"));

jQuery(function ($) {

    var $body = $('body');
    var $container = $('<div class="uk-container"></div>').prependTo('body');
    var $tests = $('<select class="uk-select uk-form-width-small"></select>').css('margin', '20px 20px 20px 0').prependTo($container);
    var $styles = $('<select class="uk-select uk-form-width-small"></select>').css('margin', '20px').appendTo($container);
    var $inverse = $('<select class="uk-select uk-form-width-small"></select>').css('margin', '20px').appendTo($container);
    var $label = $('<label></label>').css('margin', '20px').appendTo($container);

    // Tests
    // ------------------------------

    [
        'accordion',
        'alert',
        'align',
        'animation',
        'article',
        'background',
        'badge',
        'base',
        'breadcrumb',
        'button',
        'card',
        'close',
        'column',
        'comment',
        'container',
        'countdown',
        'cover',
        'description-list',
        'divider',
        'dotnav',
        'drop',
        'dropdown',
        'flex',
        'form',
        'grid',
        'grid-parallax',
        'heading',
        'height-expand',
        'height-viewport',
        'icon',
        'iconnav',
        'label',
        'lightbox',
        'link',
        'list',
        'margin',
        'marker',
        'modal',
        'nav',
        'navbar',
        'notification',
        'offcanvas',
        'overlay',
        'padding',
        'pagination',
        'parallax',
        'position',
        'placeholder',
        'progress',
        'scroll',
        'scrollspy',
        'search',
        'section',
        'slidenav',
        'sortable',
        'spinner',
        'sticky',
        'sticky-navbar',
        'subnav',
        'switcher',
        'tab',
        'table',
        'text',
        'tile',
        'toggle',
        'tooltip',
        'totop',
        'transition',
        'utility',
        'upload',
        'visibility',
        'width'
    ].sort().forEach(function (name) { return $(("<option value=\"" + name + ".html\">" + (name.split('-').map(ucfirst).join(' ')) + "</option>")).appendTo($tests); });

    $tests.on('change', function () {
        if ($tests.val()) {
            var style = styles.custom ? ("?style=" + (getParam('style'))) : '';
            location.href = "../" + ($html.find('script[src*="test.js"]').attr('src').replace('js/test.js', '')) + "tests/" + ($tests.val()) + style;
        }
    }).val(component && (component + ".html"));

    $tests.prepend("<option value=\"index.html\">Overview</option>");

    // Styles
    // ------------------------------

    Object.keys(styles).forEach(function (style) { return $styles.append(("<option value=\"" + style + "\">" + (ucfirst(style)) + "</option>")); });

    $styles.on('change', function () {
        storage[key] = $styles.val();
        location.reload();
    }).val(storage[key]);

    // Variations
    // ------------------------------

    var variations = {
        'default': 'Default',
        'light': 'Dark',
        'dark': 'Light'
    };

    Object.keys(variations).forEach(function (name) { return $(("<option value=\"" + name + "\">" + (variations[name]) + "</option>")).appendTo($inverse); });

    $inverse.on('change', function () {

        $body.removeClass('uk-dark uk-light');

        switch ($inverse.val()) {
            case 'dark':
                $html.css('background', '#fff');
                $body.addClass('uk-dark');
                break;

            case 'light':
                $html.css('background', '#222');
                $body.addClass('uk-light');
                break;

            default:
                $html.css('background', '');
        }

        storage[keyinverse] = $inverse.val();

    }).val(storage[keyinverse]).trigger('change');

    // RTL
    // ------------------------------

    var $rtl = $('<input type="checkbox" class="uk-checkbox" />').on('change', function () {
        storage._uikit_dir = $rtl.prop('checked') ? 'rtl' : 'ltr';
        location.reload();
    }).appendTo($label).after('<span style="margin:5px;">RTL</span>');

    if (dir == 'rtl') {
        $rtl.prop('checked', true);
    }

    $html.css('padding-top', '');
});

$html.css('padding-top', '80px');

function ucfirst(str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function getParam(name) {
    var match = RegExp(("[?&]" + name + "=([^&]*)")).exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

})));
