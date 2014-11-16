define(["section", 'tapHandler', 'platform', 'event', 'completely'], function (Section, TapHandler, Platform, Event, Completely) {

  var newContacts;
  var names = [];

  var NewTrans = Section.extend({
    id: "page-new-trans",
    _auto: null,
    _recipient: null,

    init: function () {
      this._super();

      this._recipient = document.getElementById("recipient");

      this._recipient.addEventListener("keyup", this._nameChanged.bind(this));
    },

    show: function () {

      window.contactResult = (function (contacts) {
        window.contactResult = undefined;
        this._gotContacts(contacts);
      }).bind(this);

      window.location = 'coinbase://getContacts';
    },

    _gotContacts: function (contacts) {
      for (var name in contacts) {
        var newKey = '';

        for(var i = 0; i < contacts[name].length; i++) {
          if(parseInt(contacts[name][i])) {
            newKey += contacts[name][i];
          }
        }

        contacts[name] = newKey;
      }
      newContacts = contacts;
      names = Object.keys(contacts);

      this._updateAutocomplete();
    },

    _updateAutocomplete: function () {
      var vals = names.filter((function (item) {
          return item.toLowerCase().indexOf(this._recipient.value.toLowerCase()) === 0;
        }).bind(this))
        .sort()
        .map(function (name) {
          return '<option value="' + newContacts[name] + '">' + name + '</option>';
        });

      document.getElementById('dropdown').innerHTML = vals;
    },

    _nameChanged: function (e) {
      this._updateAutocomplete();
    }
  });

  return new NewTrans();

});
