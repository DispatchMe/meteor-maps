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

GoogleMaps.addMarker = function (map, options, callback) {
  if (!map) return;

  if (_.isObject(options.icon) && options.icon.size) {
    options.icon.size = { width: options.icon.size[0], height: options.icon.size[1] };
  }

  options.snippet = options.content;
  options.disableAutoPan = true;

  map.addMarker(options, function (marker) {
    marker.eventsId = options.id;

    marker.position = options.position;

    callback(marker);
  });
};

GoogleMaps.LatLng = function (lat, lng) {
  return new plugin.google.maps.LatLng(lat, lng);
};

GoogleMaps.LatLngBounds = function () {
  return new plugin.google.maps.LatLngBounds();
};

GoogleMaps.mapType = function (type) {
  return plugin.google.maps.MapTypeId[type];
};

GoogleMaps.removeMarker = function (marker) {
  marker.remove();
};

GoogleMaps.bindMarkerEvents = function (map, marker) {
  var eventsMap = Maps.Utility.parseEvents(map, 'marker', marker);
  if (eventsMap) marker._marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, eventsMap);
};
