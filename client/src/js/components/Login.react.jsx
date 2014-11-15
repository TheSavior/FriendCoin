var React = require('react');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var TapHandler = require('../plugins/TapHandler');

var AppActions = require('../actions/AppActions');

var tapHandler;

var Login = React.createClass({
  componentDidMount: function(e) {
    tapHandler = new TapHandler(this.getDOMNode(), {
      tap: this._tap
    });
  },

  componentWillUnmount: function() {
    tapHandler.clear();
  },

  render: function() {
    return (
      <div id="page-login" className="page">
        Coinbase
        <div id="btn-login">Log in</div>
      </div>
    );
  },

  _tap: function(e) {
    AppActions.login();
  }
});

module.exports = Login;