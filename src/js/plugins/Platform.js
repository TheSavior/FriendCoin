'use strict';

var Platform = function () {
  this.init();
};

var body;

Platform.prototype = {
  standalone: null,

  transition: null,
  transitionEnd: null,
  animation: null,
  transform: null,
  transformOrigin: null,
  mouseWheel: null,

  init: function () {
    this.standalone = !!window.navigator.standalone;

    this.mouseWheel = typeof (window.onwheel) != 'undefined' ? 'wheel' : 'mousewheel';

    window.requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

    window.indexedDB = window.indexedDB ||
      window.webkitIndexedDB ||
      window.mozIndexedDB ||
      window.msIndexedDB ||
      window.oIndexedDB;

    if(document.readyState === 'interactive' || document.readyState === 'complete') {
      this._initWithDOM();
    } else {
      document.addEventListener('DOMContentLoaded', this._initWithDom.bind(this), false);
    }
  },

  _initWithDom: function () {
    body = document.body;

    this.transition = this.addPrefix('transition');

    this.transitionEnd = {
      'transition': 'transitionend',
      'webkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionEnd',
      'OTransition': 'oTransitionEnd'
    }[this.transition];

    this.animation = this.addPrefix('animation');
    this.transform = this.addPrefix('transform');
    this.transformOrigin = this.addPrefix('transformOrigin');
  },

  addPrefix: function (property) {
    var prefix = '';
    var vendor = ['ms', 'webkit', 'mox', 'o'];
    var style = body.style;

    if(typeof style[property] == 'string') {
      prefix = '';
    } else {
      for(var i = 0; i < vendor.length; i++) {
        if(typeof style['-' + vendor[i] + '-' + property] == 'string') {
          prefix = vendor[i];
          break;
        }
      }
    }

    var styleString = (prefix.length > 0) ? property.charAt(0).toUpperCase() + property.slice(1) : property;

    if(prefix) {
      return prefix + styleString;
    } else {
      return styleString;
    }
  },

  isiOS: function () {
    return this.hasDeviceType('iOS');
  },

  isPC: function () {
    return this.hasDeviceType('PC');
  },

  isMac: function () {
    return this.hasDeviceType('Mac');
  },

  isComputer: function () {
    return this.hasDeviceType('computer');
  },

  isPhone: function () {
    return this.hasDeviceType('phone');
  },

  isTablet: function () {
    return this.hasDeviceType('tablet');
  },

  isMobile: function () {
    return this.isPhone() || this.isTablet();
  },

  hasDeviceType: function (type) {
    return this.getDeviceType().indexOf(type) !== -1;
  },

  getDeviceType: function () {
    // if (localStorage.deviceType) {
    //   return JSON.parse(localStorage.deviceType);
    // }

    var devices = [];
    var userAgent = navigator.userAgent;

    if(userAgent.match(/iPad/g)) {
      devices.push('iOS');
      devices.push('iPad');
      devices.push('tablet');
    } else if(userAgent.match(/iPhone/g)) {
      devices.push('iOS');
      devices.push('iPhone');
      devices.push('phone');
    } else if(userAgent.match(/Mac/g)) {
      devices.push('Mac');
      devices.push('computer');
    } else if(userAgent.match(/Android/g)) {
      devices.push('Android');

      if(userAgent.match(/Mobile/g)) {
        devices.push('phone');
      } else {
        devices.push('tablet');
      }
    } else {
      devices.push('PC');
      devices.push('computer');
    }

    localStorage.deviceType = JSON.stringify(devices);

    return devices;
  }
};

module.exports = new Platform();
