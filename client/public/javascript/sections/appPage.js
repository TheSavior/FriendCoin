define(["section", "sections/transPane"], function(Section, DrawerManager) {

  var AppPage = Section.extend({
    id: "page-app",

    init: function() {
      this._super();

    },

    show: function(e) {
      console.log("showing app page");
    }

  });

  return new AppPage();

});