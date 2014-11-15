define(["section", 'tapHandler', 'platform', 'event', 'completely'], function(Section, TapHandler, Platform, Event, Completely) {

  var NewTrans = Section.extend({
    id: "page-new-trans",

    init: function() {
      this._super();
    },

    show:function() {
    	var auto = Completely(document.getElementById('container'), {
            fontSize : '24px',
            fontFamily : 'Arial',
            color:'#933',
            });
          auto.options = ['cocoa','coffee','orange'];
          auto.repaint(); 
          setTimeout(function() {
          auto.input.focus();
          },0);
    }
  });

  return new NewTrans();

});