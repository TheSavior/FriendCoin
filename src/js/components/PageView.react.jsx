var React = require('react');

var TapHandler = require('../plugins/TapHandler');
var AppStateStore = require('../stores/AppStateStore');
var Platform = require('../plugins/Platform');
var AppActions = require('../actions/AppActions');

var menuTapHandler;
var scanTapHandler;

var MainSection = React.createClass({
  componentDidMount: function(e) {
    menuTapHandler = new TapHandler(this.refs['open-menu-button'].getDOMNode(), {
      tap: this._menuTapped,
      start: this._stopPropagation,
      end: this._stopPropagation
    });

    menuTapHandler = new TapHandler(this.refs['scan-button'].getDOMNode(), {
      tap: this._scanTapped,
      start: this._stopPropagation,
      end: this._stopPropagation
    });
  },

  componentWillUnmount: function() {
    menuTapHandler.clear();
  },

  render: function() {
    return (
      <div className="pane">
        <div id="phone-title-bar">
          <div className="left">
            <span ref="open-menu-button" className="icon-menu"></span>
          </div>

          <div className="center">
            coinbase
          </div>
        </div>

        <div id="button-bar"><div ref="scan-button">Scan</div></div>

        <ul className="transaction-list">
          <li>
            <span>You purhcased bitcoins</span><span className="positive">2.39</span>
          </li>
          <li>
            <span>You purchased bitcoins</span><span className="positive">.01</span>
          </li>
          <li>
            <span>You sold bitcoins</span><span className="negative">.01</span>
          </li>
        </ul>
      </div>
    );
  },

  _menuTapped: function(e) {
    e.stopPropagation();

    AppActions.showDrawer(true);
  },

  _scanTapped: function(e) {
    e.stopPropagation();

    console.log("Loading scanner");

    if (Platform.isiOS()) {
      this._nativeReadQRCode();
    }
    else
    {
      console.log("Can only read QR Code on iOS");
    }


  },

  _nativeReadQRCode: function() {
    window.qrCodeResult = (function(result) {
      console.log("You scanned "+result);
      window.qrCodeResult = undefined;
      delete window.qrCodeResult;
    }).bind(this);

    window.location = "coinbase://readQRCode";
  },

  _stopPropagation: function(e) {
    e.stopPropagation();
  }
});

module.exports = MainSection;