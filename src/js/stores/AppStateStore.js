'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var LifecycleConstants = require('../constants/LifecycleConstants');

var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'settingsChange';

function checkSetup() {
  if(localStorage.isLoggedIn === undefined) {
    localStorage.isLoggedIn = false;
  }

  tempState.showDrawer = false;
}

var tempState = {};

var AppStateStore = Object.assign(EventEmitter.prototype, {
  getState: function (name) {
    return localStorage[name];
  },

  getTempState: function (name) {
    return tempState[name];
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch(action.actionType) {
      case LifecycleConstants.INITIALIZE:
        checkSetup();
        break;
      case LifecycleConstants.LOGGED_IN:
        localStorage.isLoggedIn = action.loggedInStatus;
        break;
      case AppConstants.APP_SHOW_DRAWER:
        tempState.showDrawer = action.show;
        break;
      default:
        return true;
    }


    // This often goes in each case that should trigger a UI change. This store
    // needs to trigger a UI change after every view action, so we can make the
    // code less repetitive by putting it here.  We need the default case,
    // however, to make sure this only gets called after one of the cases above.
    AppStateStore.emitChange();

    return true; // No errors.  Needed by promise in Dispatcher.
  })
});

module.exports = AppStateStore;
