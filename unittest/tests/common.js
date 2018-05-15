var col, collection_classes_map, init_collections, languages, max_document_id, test_collections, translations_editing_tests_collection, _class, _fn, _i, _len, _ref;

test_collections = share.test_collections = {
  a: new i18nCollection("a"),
  b: new i18nCollection("b"),
  c: new i18nCollection("c"),
  a_aa: new i18nCollection("a_aa", {
    base_language: "aa"
  }),
  b_aa: new i18nCollection("b_aa", {
    base_language: "aa"
  }),
  c_aa: new i18nCollection("c_aa", {
    base_language: "aa"
  })
};

test_collections["a_aa-AA"] = new i18nCollection("a_aa-AA", {
  base_language: "aa-AA"
});

test_collections["b_aa-AA"] = new i18nCollection("b_aa-AA", {
  base_language: "aa-AA"
});

test_collections["c_aa-AA"] = new i18nCollection("c_aa-AA", {
  base_language: "aa-AA"
});

translations_editing_tests_collection = new i18nCollection("trans_editing");

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
  for (var collection in test_collections) {
    test_collections[collection].remove({});
  }
  var properties_to_translate = ["not_translated_to_en", "not_translated_to_aa", "not_translated_to_aa-AA"];
  var _results = [];
  for (var i = 0; i < max_document_id; i++) {
    _results.push((function() {
      var _results1 = [];
      _.each(_.keys(test_collections),(collection_name)=> {
        var collection = test_collections[collection_name];
        var base_language = collection_name.replace(/(.*_|.*)/, "") || "en";
        var collection_class = collection_name.replace(/_.*/, "");
        if (i % 3 !== collection_classes_map[collection_class]) {
          return;
        }
        var doc = {
          _id: "" + (share.lpad(i, 4)),
          id: i,
          i18n: {}
        };
        _.each(languages,(language_tag) => {
          if (language_tag !== base_language) {
            doc.i18n[language_tag] = {};
          }
        });
        _.each(languages,(language_tag) => {
          _.each(properties_to_translate,(property) => {
            var not_translated_to = property.replace("not_translated_to_", "");
            var value = property + "-" + language_tag + "-" + i;
            if (language_tag !== not_translated_to) {
              var set_on;
              if (language_tag === base_language) {
                set_on = doc;
              } else {
                set_on = doc.i18n[language_tag];
              }
              set_on[property] = value;
            }
          });
        });
        _results1.push(collection.insert(doc));
      });
      return _results1;
    })());
  }
  return _results;
};

if (Meteor.isServer) {
  init_collections();
  _ref = ["a", "b", "c"];
  _fn = function(_class) {
    return Meteor.i18nPublish("class_" + _class, function(fields) {
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
  for (var i = 0; i < _ref.length; i++) {
    _class = _ref[i];
    _fn(_class);
  }
}
