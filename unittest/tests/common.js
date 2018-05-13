var col, collection_classes_map, init_collections, languages, max_document_id, test_collections, translations_editing_tests_collection, _class, _fn, _i, _len, _ref;

test_collections = share.test_collections = {
  a: new TAPi18n.Collection("a"),
  b: new TAPi18n.Collection("b"),
  c: new TAPi18n.Collection("c"),
  a_aa: new TAPi18n.Collection("a_aa", {
    base_language: "aa"
  }),
  b_aa: new TAPi18n.Collection("b_aa", {
    base_language: "aa"
  }),
  c_aa: new TAPi18n.Collection("c_aa", {
    base_language: "aa"
  })
};

test_collections["a_aa-AA"] = new TAPi18n.Collection("a_aa-AA", {
  base_language: "aa-AA"
});

test_collections["b_aa-AA"] = new TAPi18n.Collection("b_aa-AA", {
  base_language: "aa-AA"
});

test_collections["c_aa-AA"] = new TAPi18n.Collection("c_aa-AA", {
  base_language: "aa-AA"
});

translations_editing_tests_collection = new TAPi18n.Collection("trans_editing");

translations_editing_tests_collection.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

if (Meteor.isServer) {
  Meteor.publish("trans_editing", function() {
    return translations_editing_tests_collection.find({});
  });
} else {
  Meteor.subscribe("trans_editing");
}

share.translations_editing_tests_collection = translations_editing_tests_collection;

for (col in test_collections) {
  test_collections[col].allow({
    insert: function() {
      return true;
    },
    update: function() {
      return true;
    },
    remove: function() {
      return true;
    }
  });
}

collection_classes_map = {
  a: 0,
  b: 1,
  c: 2
};

languages = share.supported_languages = ["en", "aa", "aa-AA"];

max_document_id = share.max_document_id = 30;

if (Meteor.isClient) {
  window.test_collections = test_collections;
  window.translations_editing_tests_collection = translations_editing_tests_collection;
}

init_collections = function() {
  var base_language, collection, collection_class, collection_name, doc, i, language_tag, not_translated_to, properties_to_translate, property, set_on, value, _i, _results;
  for (collection in test_collections) {
    test_collections[collection].remove({});
  }
  properties_to_translate = ["not_translated_to_en", "not_translated_to_aa", "not_translated_to_aa-AA"];
  _results = [];
  for (i = _i = 0; 0 <= max_document_id ? _i < max_document_id : _i > max_document_id; i = 0 <= max_document_id ? ++_i : --_i) {
    _results.push((function() {
      var _j, _k, _l, _len, _len1, _len2, _results1;
      _results1 = [];
      for (collection_name in test_collections) {
        collection = test_collections[collection_name];
        base_language = collection_name.replace(/(.*_|.*)/, "") || "en";
        collection_class = collection_name.replace(/_.*/, "");
        if (i % 3 !== collection_classes_map[collection_class]) {
          continue;
        }
        doc = {
          _id: "" + (share.lpad(i, 4)),
          id: i,
          i18n: {}
        };
        for (_j = 0, _len = languages.length; _j < _len; _j++) {
          language_tag = languages[_j];
          if (language_tag !== base_language) {
            doc.i18n[language_tag] = {};
          }
        }
        for (_k = 0, _len1 = languages.length; _k < _len1; _k++) {
          language_tag = languages[_k];
          for (_l = 0, _len2 = properties_to_translate.length; _l < _len2; _l++) {
            property = properties_to_translate[_l];
            not_translated_to = property.replace("not_translated_to_", "");
            value = property + "-" + language_tag + "-" + i;
            if (language_tag !== not_translated_to) {
              if (language_tag === base_language) {
                set_on = doc;
              } else {
                set_on = doc.i18n[language_tag];
              }
              set_on[property] = value;
            }
          }
        }
        _results1.push(collection.insert(doc));
      }
      return _results1;
    })());
  }
  return _results;
};

if (Meteor.isServer) {
  init_collections();
  _ref = ["a", "b", "c"];
  _fn = function(_class) {
    return TAPi18n.publish("class_" + _class, function(fields) {
      var cursors;
      if (fields == null) {
        fields = null;
      }
      cursors = [];
      if (fields == null) {
        cursors = cursors.concat(test_collections["" + _class].i18nFind());
        cursors = cursors.concat(test_collections[_class + "_aa"].i18nFind());
        cursors = cursors.concat(test_collections[_class + "_aa-AA"].i18nFind());
      } else {
        cursors = cursors.concat(test_collections["" + _class].i18nFind({}, {
          fields: fields
        }));
        cursors = cursors.concat(test_collections[_class + "_aa"].i18nFind({}, {
          fields: fields
        }));
        cursors = cursors.concat(test_collections[_class + "_aa-AA"].i18nFind({}, {
          fields: fields
        }));
      }
      return cursors;
    });
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    _class = _ref[_i];
    _fn(_class);
  }
}
