'use strict';

require('./polyfills/Object.assign');

var React = require('react');
var AppDispatcher = require('./dispatcher/AppDispatcher');
var LifecycleConstants = require('./constants/LifecycleConstants');

var Platform = require('./plugins/Platform');
window.p = Platform;

var App = React.createFactory(require('./components/App.react.jsx'));

AppDispatcher.register(function (payload) {
  var action = payload.action;

  switch(action.actionType) {
    case LifecycleConstants.INITIALIZE:
      setDeviceClasses();
      renderRoot();
      break;
    default:
      return true;
  }

  return true;
});

function init() {
  AppDispatcher.dispatchAppAction({
    actionType: LifecycleConstants.INITIALIZE
  });
}

function setDeviceClasses() {
  var body = document.body;

  Platform.getDeviceType().forEach(function (device) {
    body.classList.add(device);
  });
}

function renderRoot() {
  React.render(App(), document.body);
}


if(document.readyState === 'interactive' || document.readyState === 'complete') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init, false);
}
