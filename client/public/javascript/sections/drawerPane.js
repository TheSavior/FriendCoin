define(["section", 'tapHandler', 'event'], function(Section, TapHandler, Event) {

  var DrawerPane = Section.extend({
    id: "pane-drawer",

    init: function() {
      this._super();
      new TapHandler(this.element, {
        tap: function() {
          Event.trigger("showDrawer",
            {show: false}
          );
        }
      });

    },

    show: function(e) {
      console.log("showing drawer pane");
    },

    afterShow: function() {},

    afterHide: function() {}

  });

  return new DrawerPane();

});