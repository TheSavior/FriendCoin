define(['platform', 'event', "sections/drawerPane", "sections/transPane"], function (Platform, Event, DrawerPane, TransPane) {
  function DrawerManager() {
    this.init();
  }

  DrawerManager.prototype = {
    pages: null,
    currentPage: "",

    init: function() {
      this.pages = {};

      Event.addListener("showDrawer", this._showDrawer.bind(this));

      this.pages.drawer = DrawerPane;
      this.pages.trans = TransPane;

      window.d = this;
    },

    _showDrawer: function(e) {
      var show = e.show;

      var pane = this.pages.trans;
      var finalPosition = show ? window.innerWidth * 0.8 : 0;

      pane.offsetX = finalPosition;
      var translate = "translateX(" + finalPosition + "px)";

      pane.element.classList.add('animating');
      pane.element.style[Platform.transform] = translate;

      window.setTimeout(function() {
        pane.element.classList.remove("animating");
      }, 200);
    },
  };

  return new DrawerManager();
});