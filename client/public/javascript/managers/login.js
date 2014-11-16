define(["event", "sections/loginPage", "sections/appPage", "sections/newTrans", "sections/phonePage"], function(Event, LoginPage, AppPage, NewTrans, PhonePage) {
  function LoginManager() {
    this.init();
  }

  LoginManager.prototype = {
    pages: null,
    currentPage: "",

    init: function() {
      this.pages = {};

      Event.addListener("authenticatedStatusChanged", this._authenticatedStatusChanged.bind(this));
      Event.addListener("showPage", this._showPage.bind(this));

      this.pages.loginPage = LoginPage;
      this.pages.app = AppPage;
      this.pages.newTrans = NewTrans;
      this.pages.phonePage = PhonePage;

      if (localStorage.isLoggedIn === "true") {
        document.body.classList.add("open");

        if(this._hasPhoneNumber()) {
          this.setPage("app");
        }
        else
        {
          this.setPage("phonePage");
        }
      }
      else
      {
        this.setPage("loginPage");
      }

      window.m = this;
    },

    setPage: function(page) {
      if (this.currentPage == page) {
        return;
      }

      var pageobj = null;

      if (this.currentPage) {

        pageobj = this.pages[this.currentPage];

        if (pageobj.hide) {
          pageobj.hide();
        }
        pageobj.afterHide();
      }

      pageobj = this.pages[page];

      if (pageobj.show) {
        pageobj.show();
      }
      pageobj.afterShow();

      this.currentPage = page;
    },

    _authenticatedStatusChanged: function(status) {
      if (status.loggedIn) {
        localStorage.isLoggedIn = true;

        if(this._hasPhoneNumber()) {
          this.setPage("app");
        }
        else
        {
          this.setPage("phonePage");
        }
      }
      else
      {
        delete localStorage.isLoggedIn;
        this.setPage("loginPage");
      }
    },

    _showPage: function(pageName) {
      this.setPage(pageName);
    },

    _hasPhoneNumber: function() {
      return docCookie.getItem("phone") && docCookie.getItem("phone") === '1';
    }
  };

  return new LoginManager();
});