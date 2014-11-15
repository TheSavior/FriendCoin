define(["section", 'tapHandler', 'platform', 'event'], function(Section, TapHandler, Platform, Event) {

  var NewTrans = Section.extend({
    id: "page-new-trans",

    init: function() {
      this._super();
    }
  });

  return new NewTrans();

});