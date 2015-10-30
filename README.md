# meteor-maps
An easy to use map package for using Google Maps with Blaze.

#### Install

```
$ meteor add dispatch:maps
```

For use with cordova, edit your `mobile-config.js`:
```js
App.configurePlugin('plugin.google.maps', {
  API_KEY_FOR_ANDROID: 'xxx',
  API_KEY_FOR_IOS: 'xxx'
});
```

#### Usage
```js
  Meteor.startup(function () {
    GoogleMaps.load({
      v: '3.20',
      client: Meteor.settings.public.GOOGLE_MAPS_CLIENT_ID,
      libraries: 'geometry,places',
      language: 'en'
    });
  });

  GoogleMaps.onReady(function(google) {
    // Got google.maps
  });
```
