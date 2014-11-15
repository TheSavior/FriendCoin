define(["section", 'tapHandler', 'platform', 'event'], function(Section, TapHandler, Platform, Event) {

  var TransPane = Section.extend({
    id: "pane-translist",
    _continueLoop: false,
    offsetX: 0,
    _maxOffset: undefined,

    init: function() {
      this._super();

      this._maxOffset = window.innerWidth * 0.8;

      new TapHandler(this.element, {
        start: this._start.bind(this),
        move: this._move.bind(this),
        end: this._end.bind(this)
      });

      new TapHandler(document.getElementById("phone-title-bar"), {
        tap: this._menuTapped.bind(this),
        start: this._stopPropagation.bind(this),
        end: this._stopPropagation.bind(this)
      });

      new TapHandler(document.getElementById("scan-button"), {
        tap: this._scanTapped.bind(this),
        start: this._stopPropagation.bind(this),
        end: this._stopPropagation.bind(this)
      });

      this.aniLoop = this.aniLoop.bind(this);
    },

    show: function(e) {
      console.log("showing transaction pane");
    },

    afterShow: function() {},

    afterHide: function() {},

    _start: function() {
      this.continueLoop = true;

      requestAnimationFrame(this.aniLoop);
    },

    _move: function(e) {
      this.offsetX += e.xFromLast;
      this.offsetX = Math.max(0, Math.min(this.offsetX, this._maxOffset));
    },

    _end: function(e) {
      console.log(e);
      this.continueLoop = false;

      if (this.offsetX > this._maxOffset / 2) {
        Event.trigger("showDrawer", {show: true});
      }
      else
      {
        Event.trigger("showDrawer", {show: false});
      }
    },

    aniLoop: function() {
      if (!this.continueLoop) {
        return;
      }

      this.element.style[Platform.transform] = "translateX("+this.offsetX+"px)";

      requestAnimationFrame(this.aniLoop);
    },

    _menuTapped: function(e) {
      Event.trigger("showDrawer", {show: true});
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