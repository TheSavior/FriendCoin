var React = require('react');
var TapHandler = require('../plugins/TapHandler');
var AppActions = require('../actions/AppActions');

var tapHandler;

var Drawer = React.createClass({
  componentDidMount: function() {
    tapHandler = new TapHandler(this.getDOMNode(), {
      tap: this._tap
    });
  },

  componentWillUnmount: function() {
    tapHandler.clear();
  },

  render: function() {
    return (
      <div id="pane-drawer" className="pane">
        <ul>
          <li>Transactions</li>
          <li>Buy</li>
          <li>Sell</li>
          <li>Settings</li>
        </ul>
      </div>
    );
  },

  _tap: function(e) {
    AppActions.showDrawer(false);
  }
});

module.exports = Drawer;