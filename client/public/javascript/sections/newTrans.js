define(["section", 'tapHandler', 'platform', 'event', 'completely'], function (Section, TapHandler, Platform, Event, Completely) {

  var newContacts;
  var names = [];

  var NewTrans = Section.extend({
    id: "page-new-trans",
    _auto: null,
    _recipient: null,
    _dropdown: null,

    init: function () {
      this._super();

      this._recipient = document.getElementById("recipient");
      this._dropdown = document.getElementById("dropdown");

      this._recipient.addEventListener("keyup", this._nameChanged.bind(this));
      this._dropdown.addEventListener("blur", this._dropdownBlurred.bind(this));


      new TapHandler(document.getElementById('btn-cancel'), {
        tap: this._cancelTapped.bind(this)
      });

      new TapHandler(document.getElementById('btn-confirm'), {
        tap: this._confirmTapped.bind(this)
      });

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

      postRequest("/server/filterList", {data: JSON.stringify(contacts)})
      .then((function(result) {
        if (typeof result.data == "object") {
          newContacts = result.data;
          names = Object.keys(newContacts);
          this._updateAutocomplete();

          console.log(newContacts);
        }
      }).bind(this));
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

    _nameChanged: function () {
      this._updateAutocomplete();
    },

    _dropdownBlurred: function(e) {
      this._recipient.value = e.target.selectedOptions[0].text;
    },

    _cancelTapped: function() {
      Event.trigger("showPage", "app");
    },

    _confirmTapped: function() {
      var amount = parseFloat(document.getElementById('amount').value);

      var transaction = {
        amount: amount,
        phoneNumber: this._dropdown.value,
        name: this._dropdown.selectedOptions[0].textContent
      };

      Event.trigger("setTransaction", transaction);
      Event.trigger("showPage", "confirmPage");

    }
  });

  return new NewTrans();

});
