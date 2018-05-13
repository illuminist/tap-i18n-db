var extend;

const removeTrailingUndefs = share.helpers.removeTrailingUndefs;

extend = $.extend;

share.i18nCollectionTransform = function(doc, collection) {
var collection_base_language, dialect_of, i, language, len, ref, route;
ref = collection._disabledOnRoutes;
for (i = 0, len = ref.length; i < len; i++) {
  route = ref[i];
  if (route.test(window.location.pathname)) {
    return doc;
  }
}
collection_base_language = collection._base_language;
language = TAPi18n.getLanguage();
if ((language == null) || (doc.i18n == null)) {
  delete doc.i18n;
  return doc;
}
dialect_of = share.helpers.dialectOf(language);
  doc = _.extend({}, doc); // protect original object
  if ((dialect_of != null) && (doc.i18n[dialect_of] != null)) {
    if (language !== collection_base_language) {
      extend(true, doc, doc.i18n[dialect_of]);
    } else {
      // if the collection's base language is the dialect that is used as the
      // current language
      doc = extend(true, {}, doc.i18n[dialect_of], doc);
    }
  }
  if (doc.i18n[language] != null) {
    extend(true, doc, doc.i18n[language]);
  }
  delete doc.i18n;
  return doc;
};

share.i18nCollectionExtensions = function(obj) {
  var fn, local_session, method, original;
  original = {
    find: obj.find,
    findOne: obj.findOne
  };
  local_session = new ReactiveDict();
  fn = function(method) {
    return obj[method] = function(selector, options) {
      local_session.get("force_lang_switch_reactivity_hook");
      return original[method].apply(obj, removeTrailingUndefs([selector, options]));
    };
  };
  for (method in original) {
    fn(method);
  }
  obj.forceLangSwitchReactivity = _.once(function() {
    Deps.autorun(function() {
      return local_session.set("force_lang_switch_reactivity_hook", TAPi18n.getLanguage());
    });
  });
  obj._disabledOnRoutes = [];
  obj._disableTransformationOnRoute = function(route) {
    return obj._disabledOnRoutes.push(route);
  };
  if (Package.autopublish != null) {
    obj.forceLangSwitchReactivity();
  }
  return obj;
};

TAPi18n.subscribe = function(name) {
  var callbacks, current_computation, lastParam, local_session, onErrorCalled, onReadyCalled, original_onReady, params, subscribe, subscription, subscription_computation;
  local_session = new ReactiveDict;
  local_session.set("ready", false);
  // parse arguments
  params = Array.prototype.slice.call(arguments, 1);
  callbacks = {};
  if (params.length) {
    lastParam = params[params.length - 1];
    if (typeof lastParam === "function") {
      callbacks.onReady = params.pop();
    } else if (lastParam && (typeof lastParam.onReady === "function" || typeof lastParam.onError === "function")) {
      callbacks = params.pop();
    }
  }
  // We want the onReady/onError methods to be called only once (not for every language change)
  onReadyCalled = false;
  onErrorCalled = false;
  original_onReady = callbacks.onReady;
  callbacks.onReady = function() {
    if (onErrorCalled) {
      return;
    }
    local_session.set("ready", true);
    if (original_onReady != null) {
      return original_onReady();
    }
  };
  if (callbacks.onError != null) {
    callbacks.onError = function() {
      if (onReadyCalled) {
        return _.once(callbacks.onError);
      }
    };
  }
  subscription = null;
  subscription_computation = null;
  subscribe = function() {
    // subscription_computation, depends on TAPi18n.getLanguage(), to
    // resubscribe once the language gets changed.
    return subscription_computation = Deps.autorun(function() {
      var lang_tag;
      lang_tag = TAPi18n.getLanguage();
      subscription = Meteor.subscribe.apply(this, removeTrailingUndefs([].concat(name, params, lang_tag, callbacks)));
      // if the subscription is already ready: 
      return local_session.set("ready", subscription.ready());
    });
  };
  // If TAPi18n is called in a computation, to maintain Meteor.subscribe
  // behavior (which never gets invalidated), we don't want the computation to
  // get invalidated when TAPi18n.getLanguage get invalidated (when language get
  // changed).
  current_computation = Deps.currentComputation;
  if (typeof currentComputation !== "undefined" && currentComputation !== null) {
    // If TAPi18n.subscribe was called in a computation, call subscribe in a
    // non-reactive context, but make sure that if the computation is getting
    // invalidated also the subscription computation 
    // (invalidations are allowed up->bottom but not bottom->up)
    Deps.onInvalidate(function() {
      return subscription_computation.invalidate();
    });
    Deps.nonreactive(function() {
      return subscribe();
    });
  } else {
    // If there is no computation
    subscribe();
  }
  return {
    ready: function() {
      return local_session.get("ready");
    },
    stop: function() {
      return subscription_computation.stop();
    },
    _getSubscription: function() {
      return subscription;
    }
  };
};
