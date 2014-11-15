define(["section", 'tapHandler', 'platform', 'event'], function(Section, TapHandler, Platform, Event) {

  var TransPane = Section.extend({
    id: "pane-translist",

    init: function() {
      this._super();

      new TapHandler(document.getElementById("scan-button"), {
        tap: this._scanTapped.bind(this)
      });
    },

    show: function(e) {
      console.log("showing transaction pane");
    },

    afterShow: function() {},

    afterHide: function() {},

    _scanTapped: function(e) {
      e.stopPropagation();

      this._addResult("Loading scanner");

      window.qrCodeResult = (function(result) {
        this._addResult("You scanned "+result);
        window.qrCodeResult = undefined;
      }).bind(this);

      window.location = "coinbase://readQRCode";
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