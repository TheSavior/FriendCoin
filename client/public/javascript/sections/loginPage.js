define(["event", "section", "tapHandler", "platform"], function(Event, Section, TapHandler, Platform) {

  var LoginPage = Section.extend({
    id: "page-login",

    init: function() {
      this._super();

      new TapHandler(document.getElementById("btn-login"), {
        tap: function() {
          Event.trigger("showPage", "app");
        }
      });
    },

    show: function(e) {
      console.log("showing login page");
    },

    afterShow: function() {
      this.element.style.display = "";

      setTimeout(function() {
        document.body.classList.remove("open");
      }, 0);

      this._visible = true;
    },

    hide: function(e) {
      console.log('Hiding login page');
    },

    afterHide: function() {
      if (this.element) {
        document.body.classList.add("open");

        var func = (function afterTransition() {
          this.element.style.display = "none";
          this.element.removeEventListener("transitionend", func);
        }).bind(this);

        this.element.addEventListener("transitionend", func);
      }

      this._visible = false;
    }

  });

  return new LoginPage();

});