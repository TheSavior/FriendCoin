function init() {
  // Console isn't defined in internet explorer if dev tools are closed
  if(!window.console) {
    window.console = {
      log: function () {},
      warn: function () {},
      error: function () {}
    };
  }

  window.log = console.log.bind(console);

  require(['event', 'managers/login'], function (Event, LoginManager) {
    setTimeout(function () {
      if(docCookie.getItem("authed") && docCookie.getItem("authed") === '1') {//} && localStorage.isLoggedIn !== "true") {

        Event.trigger("authenticatedStatusChanged", {
          loggedIn: true
        });

        // docCookie.removeItem("authed");
      }
    }, 0);

  });
}

if(document.readyState === "interactive" || document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init, false);
}


if(!window.Promise) {
  require(["promise"], function (Promise) {
    console.warn("Loading Promise polyfill");
    window.Promise = Promise;
  });
}

window.docCookie = {
  getItem: function (sKey) {
    if(!sKey) {
      return null;
    }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if(!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var sExpires = "";
    if(vEnd) {
      switch(vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if(!this.hasItem(sKey)) {
      return false;
    }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if(!sKey) {
      return false;
    }
    return(new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for(var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  }
};

window.getRequest = function (url) {
  return new Promise(function (resolve, reject) {


    var request = new XMLHttpRequest();

    request.open('GET', url, true);

    request.onload = function () {
      if(request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        resolve(data);
      } else {
        // We reached our target server, but it returned an error
        reject(request);
      }
    };

    request.onerror = function (error) {
      reject(error)
        // There was a connection error of some sort
    };

    request.send();

  });
};

window.postRequest = function (url, data) {
  return new Promise(function (resolve, reject) {


    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    request.onload = function () {
      if(request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        resolve(data);
      } else {
        reject(request);
      }
    };

    request.onerror = function (error) {
      reject(error);
    };

    var params = Object.keys(data)
      .map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      }).join('&');


    request.send(params);

  });
}

// Put things that are used without internet here. Make sure they aren't included later!
