define(["event", "sections/loginPage", "sections/appPage", "sections/newTrans"], function(Event, LoginPage, AppPage, NewTrans) {
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

      if (localStorage.isLoggedIn === "true") {
        document.body.classList.add("open");
        this.setPage("app");
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
        this.setPage("app");
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
  };

  return new LoginManager();
});