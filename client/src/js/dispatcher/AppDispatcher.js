'use strict';

var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = Object.assign(new Dispatcher(), {

  /**
   * A bridge function between the views and the dispatcher, marking the action
   * as a view action.  Another variant here could be handleServerAction.
   * @param  {object} action The data coming from the view.
   */
  dispatchViewAction: function (action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  dispatchAppAction: function (action) {
    this.dispatch({
      source: 'APP_ACTION',
      action: action
    });
  }

});

module.exports = AppDispatcher;
