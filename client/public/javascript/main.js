function init() {
  // Console isn't defined in internet explorer if dev tools are closed
  if(!window.console) {
    window.console = {
      log: function() {},
      warn: function() {},
      error: function() {}
    };
  }

  window.log = console.log.bind(console);

  require(['event', 'managers/login'], function (Event, LoginManager) {
    // setTimeout(function () {
    //   Event.trigger("showPage", "app");
    // }, 3000);
  });
}

if (document.readyState === "interactive" || document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init, false);
}


if (!window.Promise) {
  require(["promise"], function(Promise) {
    console.warn("Loading Promise polyfill");
    window.Promise = Promise;
  });
}

// Put things that are used without internet here. Make sure they aren't included later!