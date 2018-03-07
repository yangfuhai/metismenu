/*!
* metismenu - v2.7.4
* A jQuery menu plugin
* https://github.com/onokumus/metismenu#readme
*
* Made by Osman Nuri Okumus <onokumus@gmail.com> (https://github.com/onokumus)
* Under MIT License
*/
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var $ = _interopDefault(require('jquery'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var Util = function ($$$1) {
  // eslint-disable-line no-shadow
  var transition = false;
  var Util = {
    // eslint-disable-line no-shadow
    TRANSITION_END: 'mmTransitionEnd',
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $$$1(element).trigger(transition.end);
    },
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(transition);
    }
  };

  function getSpecialTransitionEndEvent() {
    return {
      bindType: transition.end,
      delegateType: transition.end,
      handle: function handle(event) {
        if ($$$1(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined;
      }
    };
  }

  function transitionEndTest() {
    if (typeof window !== 'undefined' && window.QUnit) {
      return false;
    }

    return {
      end: 'transitionend'
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $$$1(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    transition = transitionEndTest();
    $$$1.fn.mmEmulateTransitionEnd = transitionEndEmulator; // eslint-disable-line no-param-reassign

    if (Util.supportsTransitionEnd()) {
      // eslint-disable-next-line no-param-reassign
      $$$1.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
    }
  }

  setTransitionEndSupport();
  return Util;
}($);

var MetisMenu = function ($$$1) {
  // eslint-disable-line no-shadow
  var NAME = 'metisMenu';
  var DATA_KEY = 'metisMenu';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var TRANSITION_DURATION = 350;
  var Default = {
    toggle: true,
    preventDefault: true,
    activeClass: 'active',
    collapseClass: 'collapse',
    collapseInClass: 'in',
    collapsingClass: 'collapsing',
    triggerElement: 'a',
    parentTrigger: 'li',
    subMenu: 'ul'
  };
  var Event = {
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };

  var MetisMenu =
  /*#__PURE__*/
  function () {
    // eslint-disable-line no-shadow
    function MetisMenu(element, config) {
      this.element = element;
      this.config = _extends({}, Default, config);
      this.transitioning = null;
      this.init();
    }

    var _proto = MetisMenu.prototype;

    _proto.init = function init() {
      var self = this;
      var conf = this.config;
      $$$1(this.element).find(conf.parentTrigger + "." + conf.activeClass).has(conf.subMenu).children(conf.subMenu).attr('aria-expanded', true).addClass(conf.collapseClass + " " + conf.collapseInClass);
      $$$1(this.element).find(conf.parentTrigger).not("." + conf.activeClass).has(conf.subMenu).children(conf.subMenu).attr('aria-expanded', false).addClass(conf.collapseClass);
      $$$1(this.element).find(conf.parentTrigger).has(conf.subMenu).children(conf.triggerElement).on(Event.CLICK_DATA_API, function (e) {
        var eTar = $$$1(e.target);
        var paRent = eTar.parent(conf.parentTrigger);
        var sibLings = paRent.siblings(conf.parentTrigger).children(conf.triggerElement);
        var List = paRent.children(conf.subMenu);

        if (conf.preventDefault) {
          e.preventDefault();
        }

        if (eTar.attr('aria-disabled') === 'true') {
          return;
        }

        if (paRent.hasClass(conf.activeClass)) {
          eTar.attr('aria-expanded', false);
          self.hide(List);
        } else {
          self.show(List);
          eTar.attr('aria-expanded', true);

          if (conf.toggle) {
            sibLings.attr('aria-expanded', false);
          }
        }

        if (conf.onTransitionStart) {
          conf.onTransitionStart(e);
        }
      });
    };

    _proto.show = function show(element) {
      var _this = this;

      if (this.transitioning || $$$1(element).hasClass(this.config.collapsingClass)) {
        return;
      }

      var elem = $$$1(element);
      var startEvent = $$$1.Event(Event.SHOW);
      elem.trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      elem.parent(this.config.parentTrigger).addClass(this.config.activeClass);

      if (this.config.toggle) {
        this.hide(elem.parent(this.config.parentTrigger).siblings().children(this.config.subMenu + "." + this.config.collapseInClass).attr('aria-expanded', false));
      }

      elem.removeClass(this.config.collapseClass).addClass(this.config.collapsingClass).height(0);
      this.setTransitioning(true);

      var complete = function complete() {
        // check if disposed
        if (!_this.config || !_this.element) {
          return;
        }

        elem.removeClass(_this.config.collapsingClass).addClass(_this.config.collapseClass + " " + _this.config.collapseInClass).height('').attr('aria-expanded', true);

        _this.setTransitioning(false);

        elem.trigger(Event.SHOWN);
      };

      if (!Util.supportsTransitionEnd()) {
        complete();
        return;
      }

      elem.height(elem[0].scrollHeight).one(Util.TRANSITION_END, complete).mmEmulateTransitionEnd(TRANSITION_DURATION);
    };

    _proto.hide = function hide(element) {
      var _this2 = this;

      if (this.transitioning || !$$$1(element).hasClass(this.config.collapseInClass)) {
        return;
      }

      var elem = $$$1(element);
      var startEvent = $$$1.Event(Event.HIDE);
      elem.trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      elem.parent(this.config.parentTrigger).removeClass(this.config.activeClass); // eslint-disable-next-line no-unused-expressions

      elem.height(elem.height())[0].offsetHeight;
      elem.addClass(this.config.collapsingClass).removeClass(this.config.collapseClass).removeClass(this.config.collapseInClass);
      this.setTransitioning(true);

      var complete = function complete() {
        // check if disposed
        if (!_this2.config || !_this2.element) {
          return;
        }

        if (_this2.transitioning && _this2.config.onTransitionEnd) {
          _this2.config.onTransitionEnd();
        }

        _this2.setTransitioning(false);

        elem.trigger(Event.HIDDEN);
        elem.removeClass(_this2.config.collapsingClass).addClass(_this2.config.collapseClass).attr('aria-expanded', false);
      };

      if (!Util.supportsTransitionEnd()) {
        complete();
        return;
      }

      if (elem.height() === 0 || elem.css('display') === 'none') {
        complete();
      } else {
        elem.height(0).one(Util.TRANSITION_END, complete).mmEmulateTransitionEnd(TRANSITION_DURATION);
      }
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this.transitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this.element, DATA_KEY);
      $$$1(this.element).find(this.config.parentTrigger).has(this.config.subMenu).children(this.config.triggerElement).off('click');
      this.transitioning = null;
      this.config = null;
      this.element = null;
    };

    MetisMenu.jQueryInterface = function jQueryInterface(config) {
      // eslint-disable-next-line func-names
      return this.each(function () {
        var $this = $$$1(this);
        var data = $this.data(DATA_KEY);
        var conf = $$$1.extend({}, Default, $this.data(), typeof config === 'object' && config);

        if (!data && /dispose/.test(config)) {
          this.dispose();
        }

        if (!data) {
          data = new MetisMenu(this, conf);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    return MetisMenu;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $$$1.fn[NAME] = MetisMenu.jQueryInterface; // eslint-disable-line no-param-reassign

  $$$1.fn[NAME].Constructor = MetisMenu; // eslint-disable-line no-param-reassign

  $$$1.fn[NAME].noConflict = function () {
    // eslint-disable-line no-param-reassign
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT; // eslint-disable-line no-param-reassign

    return MetisMenu.jQueryInterface;
  };

  return MetisMenu;
}($);

module.exports = MetisMenu;