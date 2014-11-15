var React = require('react');
var MainSection = require('./MainSection.react.jsx');
var Login = require('./Login.react.jsx');
var AppStateStore = require('../stores/AppStateStore');


function getState() {
  return {
    isLoggedIn: AppStateStore.getState('isLoggedIn') === 'true'
  };
}

var App = React.createClass({
  getInitialState: function() {
    return getState();
  },

  componentDidMount: function(e) {
    AppStateStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AppStateStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var element = this.state.isLoggedIn === true ? <MainSection /> : <Login />;

    return (
      <div id="outerWrapper">
        {element}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getState());
  },
});

module.exports = App;