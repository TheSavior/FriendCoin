define(["event", "section", "tapHandler", "platform"], function (Event, Section, TapHandler, Platform) {

  var PhonePage = Section.extend({
    id: "page-phone",

    init: function () {
      this._super();

      var btnPhone = document.getElementById("btn-phone");

      new TapHandler(btnPhone, {
        tap: this._btnPhoneTapped.bind(this)
      });
    },

    _btnPhoneTapped: function () {

      var number = document.getElementById("phone-number").value;


      postRequest("/server/attachPhone", {
        phone: number
      }).then(console.log.bind(console));

      Event.trigger("showPage", "app");
    }
  });

  return new PhonePage();

});
