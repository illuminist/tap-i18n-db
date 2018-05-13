var general_tests, get_all_docs, get_basic_collections_docs, get_dialect_base_language_collections_docs, get_general_classed_collections, get_regular_base_language_collections_docs, idle_time, max_document_id, null_language_tests, once, stop_all_subscriptions, subscribe_complex_subscriptions, subscribe_simple_subscriptions, subscription_a, subscription_b, subscription_c, supported_languages, test_collections, translations_editing_tests_collection, validate_complex_subscriptions_documents, validate_simple_subscriptions_documents;

test_collections = share.test_collections;

translations_editing_tests_collection = share.translations_editing_tests_collection;

idle_time = 2000;

once = share.once;

Tinytest.add('tap-i18n-db - translations editing - insertTranslations - valid test', function(test) {
  var _id;
  return test.equal(translations_editing_tests_collection.findOne(_id = translations_editing_tests_collection.insertTranslations({
    a: 1,
    b: 5
  }, {
    aa: {
      c: 3
    },
    en: {
      b: 2,
      d: 4
    }
  }), {
    transform: null
  }), {
    a: 1,
    b: 2,
    d: 4,
    i18n: {
      aa: {
        c: 3
      }
    },
    _id: _id
  });
});

Tinytest.add('tap-i18n-db - translations editing - insertTranslations - no translations', function(test) {
  var _id;
  return test.equal(translations_editing_tests_collection.findOne(_id = translations_editing_tests_collection.insertTranslations({
    a: 1,
    b: 2
  }), {
    transform: null
  }), {
    a: 1,
    b: 2,
    _id: _id
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - insertTranslations - unsupported lang', function(test, onComplete) {
  var result;
  return result = translations_editing_tests_collection.insertTranslations({
    a: 1,
    b: 2
  }, {
    ru: {
      c: 3
    }
  }, function(err, id) {
    test.isFalse(id);
    test.instanceOf(err, Meteor.Error);
    test.equal(err.reason, "Not supported language: ru");
    test.isNull(result);
    return onComplete();
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - insertLanguage - language: collection\'s base language', function(test, onComplete) {
  return translations_editing_tests_collection.insertLanguage({
    a: 1,
    b: 5
  }, {
    b: 2,
    d: 4
  }, "en", function(err, id) {
    test.equal(translations_editing_tests_collection.findOne(id, {
      transform: null
    }), {
      a: 1,
      b: 2,
      d: 4,
      _id: id
    });
    return onComplete();
  });
});

Tinytest.add('tap-i18n-db - translations editing - insertLanguage - language: not collection\'s base language', function(test) {
  var _id;
  return test.equal(translations_editing_tests_collection.findOne(_id = translations_editing_tests_collection.insertLanguage({
    a: 1,
    b: 5
  }, {
    b: 2,
    d: 4
  }, "aa"), {
    transform: null
  }), {
    a: 1,
    b: 5,
    i18n: {
      aa: {
        b: 2,
        d: 4
      }
    },
    _id: _id
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - insertLanguage - language: not supported language', function(test, onComplete) {
  var result;
  return result = translations_editing_tests_collection.insertLanguage({
    a: 1,
    b: 5
  }, {
    b: 2,
    d: 4
  }, "ru", function(err, id) {
    test.isFalse(id);
    test.instanceOf(err, Meteor.Error);
    test.equal(err.reason, "Not supported language: ru");
    test.isNull(result);
    return onComplete();
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - insertLanguage - language: not specified', function(test, onComplete) {
  var result;
  return result = translations_editing_tests_collection.insertLanguage({
    a: 1,
    b: 5
  }, {
    b: 2,
    d: 4
  }, function(err, id) {
    test.isFalse(id);
    test.instanceOf(err, Meteor.Error);
    test.equal(err.reason, "Missing language_tag");
    test.isNull(result);
    return onComplete();
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - updateTranslations - valid update', function(test, onComplete) {
  var result, _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 5,
    b: 6
  }, {
    aa: {
      x: 4,
      y: 5
    },
    "aa-AA": {
      l: 1,
      m: 2
    }
  });
  result = translations_editing_tests_collection.updateTranslations(_id, {
    en: {
      a: 1
    },
    aa: {
      x: 1
    }
  });
  result = translations_editing_tests_collection.updateTranslations(_id, {
    en: {
      b: 2,
      c: 3
    },
    aa: {
      y: 2,
      z: 3
    },
    "aa-AA": {
      n: 3
    }
  });
  test.equal(result, 1, "Correct number of affected documents");
  test.equal(translations_editing_tests_collection.findOne(_id, {
    transform: null
  }), {
    a: 1,
    b: 2,
    c: 3,
    i18n: {
      aa: {
        x: 1,
        y: 2,
        z: 3
      },
      "aa-AA": {
        l: 1,
        m: 2,
        n: 3
      }
    },
    _id: _id
  });
  return onComplete();
});

Tinytest.addAsync('tap-i18n-db - translations editing - updateTranslations - empty update', function(test, onComplete) {
  var result, _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 1
  }, {
    aa: {
      x: 1
    }
  });
  result = translations_editing_tests_collection.updateTranslations(_id);
  test.equal(translations_editing_tests_collection.findOne(_id, {
    transform: null
  }), {
    a: 1,
    i18n: {
      aa: {
        x: 1
      }
    },
    _id: _id
  });
  test.equal(result, 1, "Correct number of affected documents");
  return onComplete();
});

Tinytest.addAsync('tap-i18n-db - translations editing - updateTranslations - unsupported lang', function(test, onComplete) {
  var result, _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 1
  }, {
    aa: {
      x: 1
    }
  });
  return result = translations_editing_tests_collection.updateTranslations(_id, {
    ru: {
      c: 3
    }
  }, function(err, id) {
    test.isFalse(id);
    test.instanceOf(err, Meteor.Error);
    test.equal(err.reason, "Not supported language: ru");
    test.isNull(result);
    return onComplete();
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - translate - valid update', function(test, onComplete) {
  var result, _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 5,
    b: 2
  }, {
    aa: {
      x: 4,
      y: 2
    }
  });
  result = translations_editing_tests_collection.translate(_id, {
    a: 1,
    c: 3
  }, "en");
  test.equal(result, 1, "Correct number of affected documents");
  result = translations_editing_tests_collection.translate(_id, {
    x: 1,
    z: 3
  }, "aa", {});
  test.equal(result, 1, "Correct number of affected documents");
  return result = translations_editing_tests_collection.translate(_id, {
    l: 1,
    m: 2,
    n: 3
  }, "aa-AA", {}, function(err, affected_rows) {
    return Meteor.setTimeout((function() {
      test.equal(1, affected_rows);
      test.equal(translations_editing_tests_collection.findOne(_id, {
        transform: null
      }), {
        a: 1,
        b: 2,
        c: 3,
        i18n: {
          aa: {
            x: 1,
            y: 2,
            z: 3
          },
          "aa-AA": {
            l: 1,
            m: 2,
            n: 3
          }
        },
        _id: _id
      });
      return onComplete();
    }), 1000);
  });
});

Tinytest.add('tap-i18n-db - translations editing - remove translation - valid remove', function(test) {
  var result, _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 1,
    b: 2
  }, {
    aa: {
      x: 1,
      y: 2
    },
    "aa-AA": {
      l: 1,
      m: 2
    }
  });
  result = translations_editing_tests_collection.removeTranslations(_id, ["en.a", "aa.y", "aa-AA"]);
  test.equal(result, 1, "Correct number of affected documents");
  result = translations_editing_tests_collection.removeTranslations(_id, [], {});
  test.equal(result, 1, "Correct number of affected documents");
  return test.equal(translations_editing_tests_collection.findOne(_id, {
    transform: null
  }), {
    b: 2,
    i18n: {
      aa: {
        x: 1
      }
    },
    _id: _id
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - remove translation - attempt to remove base language', function(test, onComplete) {
  var result, _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 1,
    b: 2
  }, {
    aa: {
      x: 1,
      y: 2
    },
    "aa-AA": {
      l: 1,
      m: 2
    }
  });
  return result = translations_editing_tests_collection.removeTranslations(_id, ["en"], function(err, affected_rows) {
    test.isFalse(affected_rows);
    test.instanceOf(err, Meteor.Error);
    test.equal(err.reason, "Complete removal of collection's base language from a document is not permitted");
    test.isNull(result);
    return onComplete();
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - remove translation - fields argument is not an array', function(test, onComplete) {
  var result, _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 1,
    b: 2
  }, {
    aa: {
      x: 1,
      y: 2
    },
    "aa-AA": {
      l: 1,
      m: 2
    }
  });
  return result = translations_editing_tests_collection.removeTranslations(_id, {}, function(err, affected_rows) {
    test.isFalse(affected_rows);
    test.instanceOf(err, Meteor.Error);
    test.isNull(result);
    return onComplete();
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - remove language - valid remove', function(test, onComplete) {
  var result, _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 1,
    b: 2,
    c: 3
  }, {
    aa: {
      x: 1,
      y: 2
    },
    "aa-AA": {
      l: 1,
      m: 2
    }
  });
  result = translations_editing_tests_collection.removeLanguage(_id, ["a", "c"], "en");
  test.equal(result, 1, "Correct number of affected documents");
  result = translations_editing_tests_collection.removeLanguage(_id, ["x"], "aa", {}, function(err, affected_rows) {
    return test.equal(affected_rows, 1, "Correct number of affected documents");
  });
  result = translations_editing_tests_collection.removeLanguage(_id, [], "aa");
  test.equal(result, 1, "Correct number of affected documents");
  return result = translations_editing_tests_collection.removeLanguage(_id, null, "aa-AA", function(err, affected_rows) {
    return Meteor.setTimeout((function() {
      test.equal(affected_rows, 1, "Correct number of affected documents");
      test.equal(translations_editing_tests_collection.findOne(_id, {
        transform: null
      }), {
        b: 2,
        i18n: {
          aa: {
            y: 2
          }
        },
        _id: _id
      });
      return onComplete();
    }));
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - remove language - attempt to remove base language', function(test, onComplete) {
  var _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 1,
    b: 2,
    c: 3
  }, {
    aa: {
      x: 1,
      y: 2
    },
    "aa-AA": {
      l: 1,
      m: 2
    }
  });
  return translations_editing_tests_collection.removeLanguage(_id, null, "en", function(err, affected_rows) {
    return Meteor.setTimeout((function() {
      test.isFalse(affected_rows);
      test.instanceOf(err, Meteor.Error);
      test.equal(err.reason, "Complete removal of collection's base language from a document is not permitted");
      return onComplete();
    }));
  });
});

Tinytest.addAsync('tap-i18n-db - translations editing - remove language - fields argument is not an array', function(test, onComplete) {
  var result, _id;
  _id = translations_editing_tests_collection.insertTranslations({
    a: 1,
    b: 2
  }, {
    aa: {
      x: 1,
      y: 2
    },
    "aa-AA": {
      l: 1,
      m: 2
    }
  });
  return result = translations_editing_tests_collection.removeLanguage(_id, {}, "aa", function(err, affected_rows) {
    test.isFalse(affected_rows);
    test.instanceOf(err, Meteor.Error);
    test.isNull(result);
    return onComplete();
  });
});

if (Meteor.isServer) {
  Tinytest.add('tap-i18n-db - TAPi18n.i18nFind works only from TAPi18n.publish', function(test) {
    return test.throws((function() {
      return test_collections.a.i18nFind();
    }), "TAPi18n.i18nFind should be called only from TAPi18n.publish functions");
  });
}

if (Meteor.isClient) {
  document.title = "UnitTest: tap-i18n-db used in a tap-i18n enabled project";
  supported_languages = _.keys(Meteor.settings.currentLanguage);
  max_document_id = share.max_document_id;
  get_general_classed_collections = function(class_suffix) {
    var collections_docs, docs, i, remap_results, _i;
    if (class_suffix == null) {
      class_suffix = "";
    }
    remap_results = function(results) {
      return _.reduce(_.values(results), (function(a, b) {
        a[b.id] = b;
        return a;
      }), {});
    };
    collections_docs = [
      remap_results(test_collections["a" + class_suffix].find({}, {
        sort: {
          "id": 1
        }
      }).fetch()), remap_results(test_collections["b" + class_suffix].find({}, {
        sort: {
          "id": 1
        }
      }).fetch()), remap_results(test_collections["c" + class_suffix].find({}, {
        sort: {
          "id": 1
        }
      }).fetch())
    ];
    docs = [];
    for (i = _i = 0; 0 <= max_document_id ? _i < max_document_id : _i > max_document_id; i = 0 <= max_document_id ? ++_i : --_i) {
      if (i in collections_docs[i % 3]) {
        if (collections_docs[i % 3][i] != null) {
          docs.push(collections_docs[i % 3][i]);
        }
      }
    }
    return docs;
  };
  get_basic_collections_docs = function() {
    return get_general_classed_collections();
  };
  get_regular_base_language_collections_docs = function() {
    return get_general_classed_collections("_aa");
  };
  get_dialect_base_language_collections_docs = function() {
    return get_general_classed_collections("_aa-AA");
  };
  get_all_docs = function() {
    var all, basic, dialect, regular_lang;
    basic = get_basic_collections_docs();
    regular_lang = get_regular_base_language_collections_docs();
    dialect = get_dialect_base_language_collections_docs();
    all = [].concat(basic, regular_lang, dialect);
    return {
      basic: basic,
      regular_lang: regular_lang,
      dialect: dialect,
      all: all
    };
  };
  subscription_a = subscription_b = subscription_c = null;
  stop_all_subscriptions = function() {
    var i, _i, _len, _ref;
    _ref = [subscription_a, subscription_b, subscription_c];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i != null) {
        i.stop();
      }
    }
    return Deps.flush();
  };
  subscribe_simple_subscriptions = function() {
    var a_dfd, b_dfd, c_dfd;
    stop_all_subscriptions();
    a_dfd = new $.Deferred();
    subscription_a = Meteor.i18nSubscribe("class_a", {
      onReady: (function() {
        return a_dfd.resolve();
      }),
      onError: (function(error) {
        return a_dfd.reject();
      })
    });
    b_dfd = new $.Deferred();
    subscription_b = Meteor.i18nSubscribe("class_b", {
      onReady: (function() {
        return b_dfd.resolve();
      }),
      onError: (function(error) {
        return b_dfd.reject();
      })
    });
    c_dfd = new $.Deferred();
    subscription_c = Meteor.i18nSubscribe("class_c", {
      onReady: (function() {
        return c_dfd.resolve();
      }),
      onError: (function(error) {
        return c_dfd.reject();
      })
    });
    return [[subscription_a, subscription_b, subscription_c], [a_dfd, b_dfd, c_dfd]];
  };
  subscribe_complex_subscriptions = function() {
    var a_dfd, b_dfd, c_dfd, language, language_to_exclude_from_class_a_and_b, projection, _i, _len;
    stop_all_subscriptions();
    language_to_exclude_from_class_a_and_b = supported_languages[(supported_languages.indexOf(Meteor.settings.currentLanguage) + 1) % supported_languages.length];
    a_dfd = new $.Deferred();
    projection = {
      _id: 1,
      id: 1
    };
    for (_i = 0, _len = supported_languages.length; _i < _len; _i++) {
      language = supported_languages[_i];
      if (language !== language_to_exclude_from_class_a_and_b) {
        projection["not_translated_to_" + language] = 1;
      }
    }
    subscription_a = Meteor.i18nSubscribe("class_a", projection, {
      onReady: (function() {
        return a_dfd.resolve();
      }),
      onError: (function(error) {
        return a_dfd.reject();
      })
    });
    b_dfd = new $.Deferred();
    projection = {
      _id: 1
    };
    projection["not_translated_to_" + language_to_exclude_from_class_a_and_b] = 0;
    subscription_b = Meteor.i18nSubscribe("class_b", projection, {
      onReady: (function() {
        return b_dfd.resolve();
      }),
      onError: (function(error) {
        return b_dfd.reject();
      })
    });
    c_dfd = new $.Deferred();
    projection = {
      _id: 1
    };
    projection["not_translated_to_" + (Meteor.settings.currentLanguage)] = 0;
    subscription_c = Meteor.i18nSubscribe("class_c", projection, {
      onReady: (function() {
        return c_dfd.resolve();
      }),
      onError: (function(error) {
        return c_dfd.reject();
      })
    });
    return [[subscription_a, subscription_b, subscription_c], [a_dfd, b_dfd, c_dfd]];
  };
  validate_simple_subscriptions_documents = function(test, subscriptions, documents) {
    var base_language_by_collection_type, collection_base_language, collection_type, collection_type_documents, current_language, i18n_supported, _results;
    current_language = Meteor.settings.currentLanguage;
    i18n_supported = current_language != null;
    base_language_by_collection_type = {
      basic: test_collections.a._base_language,
      regular_lang: test_collections.a_aa._base_language,
      dialect: test_collections["a_aa-AA"]._base_language
    };
    _results = [];
    for (collection_type in base_language_by_collection_type) {
      collection_base_language = base_language_by_collection_type[collection_type];
      collection_type_documents = documents[collection_type];
      _results.push(_.each(collection_type_documents, function(doc) {
        var expected_value, language_property_not_translated_to, property, should_translate_to, should_translate_to_dialect_of, value, _i, _len, _results1;
        _results1 = [];
        for (_i = 0, _len = supported_languages.length; _i < _len; _i++) {
          language_property_not_translated_to = supported_languages[_i];
          should_translate_to = current_language;
          if (should_translate_to === null) {
            should_translate_to = collection_base_language;
          }
          should_translate_to_dialect_of = share.dialectOf(should_translate_to);
          property = "not_translated_to_" + language_property_not_translated_to;
          value = doc[property];
          if (should_translate_to !== language_property_not_translated_to) {
            expected_value = property + "-" + should_translate_to + "-" + doc.id;
          } else {
            if (i18n_supported) {
              if (should_translate_to_dialect_of != null) {
                expected_value = property + "-" + should_translate_to_dialect_of + "-" + doc.id;
              } else if (collection_base_language !== should_translate_to) {
                expected_value = property + "-" + collection_base_language + "-" + doc.id;
              } else {
                expected_value = void 0;
              }
            } else {
              expected_value = void 0;
            }
          }
          _results1.push(test.equal(expected_value, value));
        }
        return _results1;
      }));
    }
    return _results;
  };
  validate_complex_subscriptions_documents = function(test, subscriptions, documents) {
    var base_language_by_collection_type, collection_base_language, collection_type, collection_type_documents, current_language, i18n_supported, _results;
    current_language = Meteor.settings.currentLanguage;
    i18n_supported = current_language != null;
    base_language_by_collection_type = {
      basic: test_collections.a._base_language
    };
    _results = [];
    for (collection_type in base_language_by_collection_type) {
      collection_base_language = base_language_by_collection_type[collection_type];
      collection_type_documents = documents[collection_type];
      _results.push(_.each(collection_type_documents, function(doc) {
        var expected_value, field_excluded_from_doc, language_excluded_from_class_a_and_b, language_property_not_translated_to, property, should_translate_to, should_translate_to_dialect_of, value, _i, _len, _results1;
        language_excluded_from_class_a_and_b = supported_languages[(supported_languages.indexOf(current_language) + 1) % supported_languages.length];
        field_excluded_from_doc = null;
        switch (doc.id % 3) {
          case 0:
            field_excluded_from_doc = language_excluded_from_class_a_and_b;
            break;
          case 1:
            field_excluded_from_doc = language_excluded_from_class_a_and_b;
            break;
          case 2:
            field_excluded_from_doc = current_language;
        }
        _results1 = [];
        for (_i = 0, _len = supported_languages.length; _i < _len; _i++) {
          language_property_not_translated_to = supported_languages[_i];
          should_translate_to = current_language;
          if (should_translate_to === null) {
            should_translate_to = collection_base_language;
          }
          should_translate_to_dialect_of = share.dialectOf(should_translate_to);
          property = "not_translated_to_" + language_property_not_translated_to;
          value = doc[property];
          if (language_property_not_translated_to === field_excluded_from_doc) {
            expected_value = void 0;
          } else if (should_translate_to !== language_property_not_translated_to) {
            expected_value = property + "-" + should_translate_to + "-" + doc.id;
          } else {
            if (i18n_supported) {
              if (should_translate_to_dialect_of != null) {
                expected_value = property + "-" + should_translate_to_dialect_of + "-" + doc.id;
              } else if (collection_base_language !== should_translate_to) {
                expected_value = property + "-" + collection_base_language + "-" + doc.id;
              } else {
                expected_value = void 0;
              }
            } else {
              expected_value = void 0;
            }
          }
          _results1.push(test.equal(expected_value, value, "col_type=" + collection_type + ", property=" + property));
        }
        return _results1;
      }));
    }
    return _results;
  };
  general_tests = function(test, subscriptions, documents) {
    test.equal(documents.all.length, max_document_id * 3, "Expected documents count in collections");
    return test.isTrue(_.reduce(_.map(documents.all, function(doc) {
      return doc.i18n == null;
    }), (function(memo, current) {
      return memo && current;
    }), true), "The subdocument i18n is not part of the documents");
  };
  null_language_tests = function(test, subscriptions, documents) {};
  Tinytest.addAsync('tap-i18n-db - language: null; simple pub/sub - general tests', function(test, onComplete) {
    var subscriptions, test_case;
    subscriptions = subscribe_simple_subscriptions();
    test_case = once(function() {
      var documents;
      documents = get_all_docs();
      general_tests(test, subscriptions, documents);
      null_language_tests(test, subscriptions, documents);
      validate_simple_subscriptions_documents(test, subscriptions, documents);
      return onComplete();
    });
    return Deps.autorun(function() {
      if (subscription_a.ready() && subscription_b.ready() && subscription_c.ready()) {
        return test_case();
      }
    });
  });
  if (Package.autopublish == null) {
    Tinytest.addAsync('tap-i18n-db - language: null; complex pub/sub - general tests', function(test, onComplete) {
      var subscriptions, test_case;
      subscriptions = subscribe_complex_subscriptions();
      test_case = once(function() {
        var documents;
        documents = get_all_docs();
        general_tests(test, subscriptions, documents);
        null_language_tests(test, subscriptions, documents);
        validate_complex_subscriptions_documents(test, subscriptions, documents);
        return onComplete();
      });
      return Deps.autorun(function() {
        if (subscription_a.ready() && subscription_b.ready() && subscription_c.ready()) {
          return test_case();
        }
      });
    });
  }
  Tinytest.addAsync('tap-i18n-db - language: en; simple pub/sub - general tests', function(test, onComplete) {
    Meteor.settings.currentLanguage = "en";
    var subscriptions;
    subscriptions = subscribe_simple_subscriptions();
    return $.when.apply(this, subscriptions[1]).done(function() {
      var documents;
      documents = get_all_docs();
      general_tests(test, subscriptions, documents);
      validate_simple_subscriptions_documents(test, subscriptions, documents);
      return onComplete();
    });
  });
  if (Package.autopublish == null) {
    Tinytest.addAsync('tap-i18n-db - language: en; complex pub/sub - general tests', function(test, onComplete) {
      Meteor.settings.currentLanguage = "en";
      var subscriptions;
      subscriptions = subscribe_complex_subscriptions();
      return $.when.apply(this, subscriptions[1]).done(function() {
        var documents;
        documents = get_all_docs();
        general_tests(test, subscriptions, documents);
        validate_complex_subscriptions_documents(test, subscriptions, documents);
        return onComplete();
      });
    });
  }
  Tinytest.addAsync('tap-i18n-db - language: aa; simple pub/sub - general tests', function(test, onComplete) {
    Meteor.settings.currentLanguage = "aa";
    var subscriptions;
    subscriptions = subscribe_simple_subscriptions();
    return $.when.apply(this, subscriptions[1]).done(function() {
      var documents;
      documents = get_all_docs();
      general_tests(test, subscriptions, documents);
      validate_simple_subscriptions_documents(test, subscriptions, documents);
      return onComplete();
    });
  });
  if (Package.autopublish == null) {
    Tinytest.addAsync('tap-i18n-db - language: aa; complex pub/sub - general tests', function(test, onComplete) {
      Meteor.settings.currentLanguage = "aa";
      var subscriptions;
      subscriptions = subscribe_complex_subscriptions();
      return $.when.apply(this, subscriptions[1]).done(function() {
        var documents;
        documents = get_all_docs();
        general_tests(test, subscriptions, documents);
        validate_complex_subscriptions_documents(test, subscriptions, documents);
        return onComplete();
      });
    });
  }
  Tinytest.addAsync('tap-i18n-db - language: aa-AA; simple pub/sub - general tests', function(test, onComplete) {
    Meteor.settings.currentLanguage = "aa-AA";
    var subscriptions;
    subscriptions = subscribe_simple_subscriptions();
    return $.when.apply(this, subscriptions[1]).done(function() {
      var documents;
      documents = get_all_docs();
      general_tests(test, subscriptions, documents);
      validate_simple_subscriptions_documents(test, subscriptions, documents);
      return onComplete();
    });
  });
  if (Package.autopublish == null) {
    Tinytest.addAsync('tap-i18n-db - language: aa-AA; complex pub/sub - general tests', function(test, onComplete) {
      Meteor.settings.currentLanguage = "aa-AA";
      var subscriptions;
      subscriptions = subscribe_complex_subscriptions();
      return $.when.apply(this, subscriptions[1]).done(function() {
        var documents;
        documents = get_all_docs();
        general_tests(test, subscriptions, documents);
        validate_complex_subscriptions_documents(test, subscriptions, documents);
        return onComplete();
      });
    });
  }
  Tinytest.addAsync('tap-i18n-db - subscribing with a not-supported language fails', function(test, onComplete) {
    var dfd;
    dfd = new $.Deferred();
    Meteor.subscribe("class_a", "gg-GG", {
      onReady: function() {
        return dfd.reject();
      },
      onError: function(e) {
        test.equal(400, e.error);
        test.equal("Not supported language", e.reason);
        return dfd.resolve(e);
      }
    });
    return dfd.fail(function() {
      return test.fail("Subscriptions that should have failed succeeded");
    }).always(function() {
      return onComplete();
    });
  });
  Tinytest.addAsync('tap-i18n-db - reactivity test - simple subscription', function(test, onComplete) {
    var comp, documents, interval_handle, last_invalidation, subscriptions;
    Meteor.settings.currentLanguage = supported_languages[0];
    subscriptions = subscribe_simple_subscriptions();
    last_invalidation = null;
    documents = null;
    comp = Deps.autorun(function() {
      documents = get_all_docs();
      return last_invalidation = share.now();
    });
    return interval_handle = Meteor.setInterval((function() {
      var lang_id;
      if (last_invalidation + idle_time < share.now()) {
        console.log("Testing simple subscriptions' reactivity: language=" + (Meteor.settings.currentLanguage));
        general_tests(test, subscriptions, documents);
        validate_simple_subscriptions_documents(test, subscriptions, documents);
        lang_id = supported_languages.indexOf(Meteor.settings.currentLanguage);
        if (lang_id + 1 < supported_languages.length) {
          Meteor.settings.currentLanguage = supported_languages[lang_id + 1];
        } else {
          comp.stop();
          Meteor.clearInterval(interval_handle);
          return onComplete();
        }
      }
    }), idle_time);
  });
  if (Package.autopublish == null) {
    Tinytest.addAsync('tap-i18n-db - reactivity test - complex subscription', function(test, onComplete) {
      var comp, documents, fields, fields_to_exclude, interval_handle, last_invalidation, local_session, subscriptions;
      stop_all_subscriptions();
      Meteor.settings.currentLanguage = supported_languages[0];
      fields_to_exclude = ["not_translated_to_en", "not_translated_to_aa", "not_translated_to_aa-AA"];
      local_session = new ReactiveDict();
      local_session.set("field_to_exclude", fields_to_exclude[0]);
      local_session.set("projection_type", 0);
      fields = null;
      subscriptions = null;
      Deps.autorun(function() {
        var a_dfd, b_dfd, c_dfd, field, field_to_exclude, _i, _len;
        field_to_exclude = local_session.get("field_to_exclude");
        fields = {};
        if (local_session.get("projection_type") === 0) {
          fields[field_to_exclude] = 0;
        } else {
          for (_i = 0, _len = fields_to_exclude.length; _i < _len; _i++) {
            field = fields_to_exclude[_i];
            if (field !== field_to_exclude) {
              fields[field] = 1;
            }
          }
          fields["id"] = 1;
        }
        a_dfd = new $.Deferred();
        subscription_a = Meteor.i18nSubscribe("class_a", fields, {
          onReady: (function() {
            return a_dfd.resolve();
          }),
          onError: (function(error) {
            return a_dfd.reject();
          })
        });
        b_dfd = new $.Deferred();
        subscription_b = Meteor.i18nSubscribe("class_b", fields, {
          onReady: (function() {
            return b_dfd.resolve();
          }),
          onError: (function(error) {
            return b_dfd.reject();
          })
        });
        c_dfd = new $.Deferred();
        subscription_c = Meteor.i18nSubscribe("class_c", fields, {
          onReady: (function() {
            return c_dfd.resolve();
          }),
          onError: (function(error) {
            return c_dfd.reject();
          })
        });
        return subscriptions = [[subscription_a, subscription_b, subscription_c], [a_dfd, b_dfd, c_dfd]];
      });
      last_invalidation = null;
      documents = null;
      comp = Deps.autorun(function() {
        documents = get_all_docs();
        return last_invalidation = share.now();
      });
      return interval_handle = Meteor.setInterval((function() {
        var lang_id, projection_id;
        if (last_invalidation + idle_time < share.now()) {
          console.log("Testing complex subscriptions' reactivity: language=" + (Meteor.settings.currentLanguage) + "; field_to_exclude=" + (local_session.get("field_to_exclude")) + "; projection_type=" + (local_session.get("projection_type") ? "inclusive" : "exclusive") + "; projection=" + (EJSON.stringify(fields)));
        }
        general_tests(test, subscriptions, documents);
        documents.all.forEach(function(doc) {
          return test.isUndefined(doc[local_session.get("field_to_exclude")]);
        });
        if (local_session.get("projection_type") === 0) {
          return local_session.set("projection_type", 1);
        } else if (local_session.get("projection_type") === 1 && ((projection_id = fields_to_exclude.indexOf(local_session.get("field_to_exclude"))) + 1) < fields_to_exclude.length) {
          local_session.set("projection_type", 0);
          return local_session.set("field_to_exclude", fields_to_exclude[projection_id + 1]);
        } else if ((lang_id = supported_languages.indexOf(Meteor.settings.currentLanguage)) + 1 < supported_languages.length) {
          Meteor.settings.currentLanguage = supported_languages[lang_id + 1];
          local_session.set("projection_type", 0);
          return local_session.set("field_to_exclude", fields_to_exclude[0]);
        } else {
          comp.stop();
          Meteor.clearInterval(interval_handle);
          return onComplete();
        }
      }), idle_time);
    });
  }
}

if (Meteor.isClient) {
  Tinytest.addAsync('tap-i18n-db - translations editing - insertLanguage - language_tag=Meteor.settings.currentLanguage', function(test, onComplete) {
    Meteor.settings.currentLanguage = "aa";
      var _id;
    return test.equal(translations_editing_tests_collection.findOne(_id = translations_editing_tests_collection.insertLanguage({
      a: 1,
      b: 5
    }, {
      b: 2,
      d: 4
    }, (function() {
      return onComplete();
    })), {
      transform: null
    }, {
      transform: null
    }), {
      a: 1,
      b: 5,
      i18n: {
        aa: {
          b: 2,
          d: 4
        }
      },
      _id: _id
    });
  });
  Tinytest.addAsync('tap-i18n-db - translations editing - translate - language_tag=Meteor.settings.currentLanguage', function(test, onComplete) {
    Meteor.settings.currentLanguage = "aa";
    var result, _id;
    _id = translations_editing_tests_collection.insertTranslations({
      a: 5,
      b: 2
    }, {
      aa: {
        x: 4,
        y: 2
      }
    });
    result = translations_editing_tests_collection.translate(_id, {
      a: 1,
      c: 3
    });
    test.equal(result, 1, "Correct number of affected documents");
    result = translations_editing_tests_collection.translate(_id, {
      x: 1,
      z: 3
    }, {});
    test.equal(result, 1, "Correct number of affected documents");
    return result = translations_editing_tests_collection.translate(_id, {
      l: 1,
      m: 2
    }, function(err, affected_rows) {
      return Meteor.setTimeout((function() {
        test.equal(1, affected_rows);
        test.equal(translations_editing_tests_collection.findOne(_id, {
          transform: null
        }), {
          a: 5,
          b: 2,
          i18n: {
            aa: {
              a: 1,
              c: 3,
              x: 1,
              y: 2,
              z: 3,
              l: 1,
              m: 2
            }
          },
          _id: _id
        });
        return onComplete();
      }), 1000);
    });
  });
  Tinytest.addAsync('tap-i18n-db - translations editing - removeLanguage - language_tag=Meteor.settings.currentLanguage', function(test, onComplete) {
    Meteor.settings.currentLanguage = "aa";
    var result, _id;
    _id = translations_editing_tests_collection.insertTranslations({
      a: 5,
      b: 2
    }, {
      aa: {
        u: 1,
        v: 2,
        w: 3,
        x: 4,
        y: 2,
        z: 1
      }
    });
    result = translations_editing_tests_collection.removeLanguage(_id, ["x", "y"]);
    test.equal(result, 1, "Correct number of affected documents");
    result = translations_editing_tests_collection.removeLanguage(_id, ["y", "z"], {});
    test.equal(result, 1, "Correct number of affected documents");
    return result = translations_editing_tests_collection.removeLanguage(_id, ["u", "v"], function(err, affected_rows) {
      return Meteor.setTimeout((function() {
        test.equal(1, affected_rows);
        test.equal(translations_editing_tests_collection.findOne(_id, {
          transform: null
        }), {
          a: 5,
          b: 2,
          i18n: {
            aa: {
              w: 3
            }
          },
          _id: _id
        });
        return onComplete();
      }), 1000);
    });
  });
  Tinytest.addAsync('tap-i18n-db - translations editing - removeLanguage - complete remove - language_tag=Meteor.settings.currentLanguage', function(test, onComplete) {
    Meteor.settings.currentLanguage = "aa";
    var result, _id;
    _id = translations_editing_tests_collection.insertTranslations({
      a: 5,
      b: 2
    }, {
      aa: {
        u: 1,
        v: 2,
        w: 3,
        x: 4,
        y: 2,
        z: 1
      }
    });
    return result = translations_editing_tests_collection.removeLanguage(_id, null, function(err, affected_rows) {
      return Meteor.setTimeout((function() {
        test.equal(1, affected_rows);
        test.equal(translations_editing_tests_collection.findOne(_id, {
          transform: null
        }), {
          a: 5,
          b: 2,
          i18n: {},
          _id: _id
        });
        return onComplete();
      }), 1000);
    });
  });
  Tinytest.addAsync('tap-i18n-db - translations editing - removeLanguage - attempt complete remove base language - language_tag=Meteor.settings.currentLanguage', function(test, onComplete) {
    Meteor.settings.currentLanguage = "aa";
    var result, _id;
    _id = translations_editing_tests_collection.insertTranslations({
      a: 5,
      b: 2
    }, {
      aa: {
        u: 1,
        v: 2,
        w: 3,
        x: 4,
        y: 2,
        z: 1
      }
    });
    return result = translations_editing_tests_collection.removeLanguage(_id, null, function(err, affected_rows) {
      return Meteor.setTimeout((function() {
        test.isFalse(affected_rows);
        test.instanceOf(err, Meteor.Error);
        test.equal(err.reason, "Complete removal of collection's base language from a document is not permitted");
        return onComplete();
      }), 1000);
    });
  });
}

