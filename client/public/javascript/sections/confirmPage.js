define(["section", 'tapHandler', 'platform', 'event', 'completely'], function (Section, TapHandler, Platform, Event, Completely) {

  var ConfirmPage = Section.extend({
    id: "page-confirm",
    _lastTransaction: null,

    init: function () {
      this._super();

      new TapHandler(document.getElementById('btn-def-cancel'), {
        tap: this._cancelTapped.bind(this)
      });

      new TapHandler(document.getElementById('btn-def-confirm'), {
        tap: this._confirmTapped.bind(this)
      });

      Event.addListener("setTransaction", this._gotTransaction.bind(this));
    },

    _confirmTapped: function() {
    	Event.trigger("showPage", "app");
    },

    _cancelTapped: function () {
      Event.trigger("showPage", "app");
    },

    _gotTransaction: function (transaction) {
      this._lastTransaction = transaction;
      document.getElementById("confirm-name").textContent = transaction.name;
     	document.getElementById("confirm-amount").textContent = transaction.amount;
    }

  });

  return new ConfirmPage();

});
