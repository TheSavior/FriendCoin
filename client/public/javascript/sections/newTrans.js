define(["section", 'tapHandler', 'platform', 'event'], function(Section, TapHandler, Platform, Event) {

  var NewTrans = Section.extend({
    id: "page-new-trans",

    init: function() {
      this._super();
    },

    show: function() {
      window.contactResult = (function(contacts) {
        window.contactResult = undefined;
        this._gotContacts(contacts);
      }).bind(this);

      window.location = 'coinbase://getContacts';
    },

    _gotContacts: function(contacts) {
      var keys = Object.keys(contacts);

      var newFormat = {};

      keys.forEach(function(key) {
        var newKey = '';

        for (var i = 0; i < key.length; i++) {
          if (parseInt(key[i])) {
            newKey += key[i];
          }
        }

        newFormat[newKey] = contacts[key];
      });

      console.log("Contacts", newFormat);
    },
  });

  return new NewTrans();

});