define(["event", "section", "tapHandler", "platform"], function(Event, Section, TapHandler, Platform) {

  var LoginPage = Section.extend({
    id: "page-login",

    init: function() {
      this._super();

      var btnLogin = document.getElementById("btn-login");

      new TapHandler(btnLogin, {
        tap: function() {
          if (btnLogin.dataset.url.indexOf("http") === 0) {
            window.location = btnLogin.dataset.url;
          }
          else
          {
            Event.trigger("showPage", "phonePage");
          }
        }
      });
    },

    show: function(e) {
      console.log("showing login page");
    },

    afterShow: function() {
      this.element.classList.remove("hidden");

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
          this.element.classList.add("hidden");
          this.element.removeEventListener("transitionend", func);
        }).bind(this);

        this.element.addEventListener("transitionend", func);
      }

      this._visible = false;
    }

  });

  return new LoginPage();

});