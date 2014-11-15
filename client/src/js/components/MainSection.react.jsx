var React = require('react/addons');
var Drawer = require('./Drawer.react.jsx');
var PageView = require('./PageView.react.jsx');

var TapHandler = require('../plugins/TapHandler');
var AppStateStore = require('../stores/AppStateStore');
var Platform = require('../plugins/Platform');
var AppActions = require('../actions/AppActions');

var paneTapHandler;
var catchTapHandler;

var continueLoop = false;
var maxOffset = window.innerWidth * 0.8;

// We store this outside of state so we only update state inside of the RAF
var tempOffset = 0;


function getState() {
  return {
    translateX: tempOffset,
    showDrawer: AppStateStore.getTempState('showDrawer')
  };
}

var MainSection = React.createClass({
  getInitialState: function() {
    var state = getState();

    state.animating = true;

    return state;
  },

  componentDidMount: function(e) {
    paneTapHandler = new TapHandler(this.refs.slidingPane.getDOMNode(), {
      start: this._start,
      move: this._move,
      end: this._end,
      tap: this._catchTapped
    });
  },

  componentWillUnmount: function() {
    paneTapHandler.clear();
  },

  componentWillReceiveProps: function(nextProps) {
    // If the drawer was previously closed and now it is open
    if (!this.state.showDrawer && AppStateStore.getTempState('showDrawer')) {
      this._showDrawer(true);
    }
    // Was shown but should now be hidden
    else if (this.state.showDrawer && !AppStateStore.getTempState('showDrawer')) {
      this._showDrawer(false);
    }
  },

  render: function() {
    var cx = React.addons.classSet;

    var style = {};
    style[Platform.transform] = "translate3D("+this.state.translateX+"px, 0px, 0px)";

    var paneClasses = cx({
      'pane': true,
      'animating': this.state.animating
    });

    var catchClasses = cx({
      'pane': true,
      'tap-catch': true,
      'visible': this.state.showDrawer
    });

    return (
      <div id="page-app" className="page pane-slider">
        <Drawer />
        <div id="pane-translist" ref="slidingPane" style={style} className={paneClasses}>
          <div ref="catchPane" className={catchClasses}></div>
          <PageView />
        </div>
      </div>
    );
  },

  _start: function() {
    continueLoop = true;

    this.setState({
      animating: false
    });

    requestAnimationFrame(this._aniLoop);
  },

  _move: function(e) {
    tempOffset += e.xFromLast;
    tempOffset = Math.max(0, Math.min(tempOffset, maxOffset));
  },

  _end: function(e) {
    continueLoop = false;

    this.setState({
      animating: true
    });

    var shouldShow = (this.state.translateX > maxOffset / 2);
    if (shouldShow == this.state.showDrawer) {
      this._showDrawer(shouldShow);
    }
    else
    {
      AppActions.showDrawer(shouldShow);
    }
  },

  _aniLoop: function() {
    if (!continueLoop) {
      return;
    }

    this.setState({
      translateX: tempOffset
    });

    requestAnimationFrame(this._aniLoop);
  },

  _catchTapped: function(e) {
    if (e.target === this.refs.catchPane.getDOMNode()) {
      AppActions.showDrawer(false);
    }
  },

  _showDrawer: function(show) {
    var offset = 0;

    if (show) {
      offset = window.innerWidth * 0.8;
    }

    tempOffset = offset;

    this.setState(getState());
  },

  _stopPropagation: function(e) {
    e.stopPropagation();
  }
});

module.exports = MainSection;