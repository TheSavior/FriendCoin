'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var LifecycleConstants = require('../constants/LifecycleConstants');

var AppActions = {
	login: function() {
		AppDispatcher.dispatchAppAction({
      actionType: LifecycleConstants.LOGGED_IN,
      loggedInStatus: true
    });
	},

  showDrawer: function (shouldShow) {
    AppDispatcher.dispatchViewAction({
      actionType: AppConstants.APP_SHOW_DRAWER,
      show: shouldShow
    });
  }
};

module.exports = AppActions;
