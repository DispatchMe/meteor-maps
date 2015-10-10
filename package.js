Package.describe({
  name: 'dispatch:maps',
  version: '0.0.1',
  summary: 'General map package for both browser and cordova'
});

Cordova.depends({
  'plugin.google.maps': '1.2.5'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use([
    'templating',
    'underscore',

    // atmosphere
    'aldeed:template-extension@3.4.3',
    'raix:eventemitter@0.1.2',
    'raix:eventstate@0.0.2'
  ], 'client');

  api.addFiles([
    'maps.js',
    'maps.utility.js',

    'components/map.html',
    'components/map.js',
    'components/marker.html',
    'components/marker.js'
  ], ['web.cordova', 'web.browser']);

  api.addFiles([
    'google_maps.cordova.js'
  ], 'web.cordova');

  api.addFiles([
    'google_maps.browser.js',
    'open_layers.browser.js'
  ], 'web.browser');

  api.export('Maps');
});
