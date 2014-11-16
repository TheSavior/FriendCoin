define(["section", 'tapHandler', 'platform', 'event'], function(Section, TapHandler, Platform, Event) {

  var TransPane = Section.extend({
    id: "pane-translist",

    init: function() {
      this._super();

      new TapHandler(document.getElementById("phone-title-bar"), {
        tap: this._menuTapped.bind(this),
        start: this._stopPropagation.bind(this),
        end: this._stopPropagation.bind(this)
      });

      new TapHandler(document.getElementById("scan-button"), {
        tap: this._scanTapped.bind(this),
      });
    },

    show: function(e) {
      console.log("showing transaction pane");
    },

    _menuTapped: function(e) {
      Event.trigger("showPage", "newTrans");

      e.stopPropagation();
    },

    _scanTapped: function(e) {
      e.stopPropagation();

      this._addResult("Loading scanner");

      window.qrCodeResult = (function(result) {
        this._addResult("You scanned "+result);
        window.qrCodeResult = undefined;
      }).bind(this);

      window.location = "coinbase://readQRCode";
    },

    _stopPropagation: function(e) {
      e.stopPropagation();
    },

    _addResult: function(result) {
      var list = document.getElementsByClassName("transaction-list")[0];

      var newItem = document.createElement("li");
      newItem.innerText = result;
      list.appendChild(newItem);
    }
  });

  return new TransPane();

});