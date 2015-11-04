Package.describe({
  name: 'dispatch:maps',
  version: '1.0.0',
  summary: 'General map package for both browser and cordova'
});

Cordova.depends({
  'plugin.google.maps':
  'https://github.com/DispatchMe/cordova-plugin-googlemaps.git#c407039ad9334ba122fedd16ea6d0c254cdf9a25'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');

  api.use([
    'ecmascript',
    'reactive-var',
    'templating',
    'underscore',

    // atmosphere
    'aldeed:template-extension@3.4.3',
    'raix:eventemitter@0.1.2',
    'raix:eventstate@0.0.2'
  ], 'client');

  api.addFiles([
    'components/marker.html',
    'components/marker.js',
    'components/map.html',
    'components/map.js',

    'maps.js',
    'maps.utility.js'
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
