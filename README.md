
# Meteor Maps
Meteor maps is meant to be an easy to use map package for use with Blaze.  The same code base can work with both browser and native maps.

This package is still very much a work in progress and will have more functionality pulled in regularly.

Currently only Google Maps [Javascript API](https://developers.google.com/maps/documentation/javascript/) and [Cordova Plugin](https://github.com/mapsplugin/cordova-plugin-googlemaps) are supported, but there is room for including other map libraries such as [Open Layers](http://openlayers.org/en/v3.10.1/doc/quickstart.html).

#### Install

```
$ meteor add dispatch:maps
```

For use with cordova, edit your `mobile-config.js`:

```js
App.configurePlugin('plugin.google.maps', {
  API_KEY_FOR_ANDROID: "Shhh it's a secret.",
  API_KEY_FOR_IOS: "You beter believe this is too."
});
```

#### Usage
```js
Maps.load('GoogleMaps', {
  v: '3.20',

  // Key should a the Google Maps API key.
  key: Meteor.settings.public.GOOGLE_MAPS_KEY,

  // Alternatively, client can be used for a Google Maps for work account.
  client: Meteor.settings.public.GOOGLE_MAPS_CLIENT_ID,

  libraries: 'geometry,places',
  language: 'en'
});

Maps.onReady(function() {
  console.log('Meteor maps is loaded!');
});
```

#### Templates
```html
<!-- Create a map using the Map template -->
{{#Map}}
  <!-- Markers can be added to a map by using the Marker template in the content block for a map -->
  {{> Marker id="marker1" lat="42.3601" lng="-71.0589" content="I am a marker, I swear." }}

  <!-- Directions can be added to a map by using the Directions template in the content block for a map -->
  {{> Directions id="directions1" origin="Boston, MA" destination="New York, NY" }}

  <!-- HTML can be included inside the map content block -->
  <button class="js-myMapButton">My Map Button</button>
{{/Map}}
```
