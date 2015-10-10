/* global GoogleMaps:true, Maps:false */

var GoogleMaps = {};

Maps.Library.GoogleMaps = GoogleMaps;

GoogleMaps.load = function () {
  GoogleMaps.maps = plugin.google.maps;

  Maps._state.emitState('loaded', plugin.google);
};

GoogleMaps.createMap = function (container, options) {
  var mapOptions = {};

  mapOptions.camera = {
    latLng: options.center,
    zoom: options.zoom
  };

  mapOptions.controls = {
    pan: options.panControl || false,
    zoom: options.zoomControl || false
  };

  return plugin.google.maps.Map.getMap(container, mapOptions);
};

GoogleMaps.mapType = function (type) {
  return plugin.google.maps.MapTypeId[type];
};

GoogleMaps.LatLng = function (lat, lng) {
  return new plugin.google.maps.LatLng(lat, lng);
};

GoogleMaps.addMarker = function (map, options, callback) {
  if (!map || !map.map) return;

  if (_.isObject(options.icon) && options.icon.size) {
    options.icon.size = { width: options.icon.size[0], height: options.icon.size[1] };
  }

  options.snippet = options.content;
  options.disableAutoPan = true;

  map.map.addMarker(options, function (marker) {
    marker.eventsId = options.id;

    var events = Maps.Utility.parseEvents(map, 'marker', marker);
    if (events) marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, events);

    map.markerAdded(marker);

    callback(marker);
  });
};

GoogleMaps.animateCamera = function (map, options, callback) {
  map.animateCamera(options, callback);
};
