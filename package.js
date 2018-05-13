Package.describe({
  name: 'tap:i18n-db',
  summary: 'Internationalization for Meteor Collections',
  version: '0.4.0',
  git: 'https://github.com/TAPevents/tap-i18n-db'
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.6.1');

  api.use(["underscore", "meteor", "jquery", "reactive-dict"], ['server', 'client']);

  api.use("autopublish", ['server', 'client'], {weak: true})

  api.use('tap:i18n@1.0.3', ['client', 'server']);
  api.imply('tap:i18n', ['client', 'server']);

  api.use('yogiben:admin@1.1.0', {weak: true});

  api.add_files('globals.js', ['client', 'server']);
  api.add_files('tap_i18n_db-common.js', ['client', 'server']);
  api.add_files('tap_i18n_db-server.js', 'server');
  api.add_files('tap_i18n_db-client.js', 'client');
});
