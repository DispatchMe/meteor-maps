var GoogleMaps = {};

Maps.Library.GoogleMaps = GoogleMaps;

GoogleMaps.load = function (options) {
  // Default Google Maps options
  options = _.extend({ v: '3.20' }, options);

  var params = _.map(options, function(value, key) { return key + '=' + value; }).join('&');

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?' + params + '&callback=_mapLoaded';

  // Place _mapLoaded on window for callback after API loads
  window._mapLoaded = function() {
    Maps._state.emitState('loaded', google.maps);
  };

  document.body.appendChild(script);
};

GoogleMaps.createMap = function (container, options) {
  return new google.maps.Map(container, options);
};

GoogleMaps.addMarker = function (map, options, callback) {
  options = _.extend({ map: map }, options);

  if (_.isObject(options.icon)) {
    if (options.icon.size) options.icon.size = new google.maps.Size(options.icon.size[0], options.icon.size[1]);
    if (options.icon.origin) options.icon.origin = new google.maps.Point(options.icon.origin[0], options.icon.origin[1]);
    if (options.icon.anchor) options.icon.anchor = new google.maps.Point(options.icon.anchor[0], options.icon.anchor[1]);
  }

  var marker = new google.maps.Marker(options);

  marker.eventsId = options.id;

  var styles = '';

  _.each(options.styles, function (value, key) {
    styles += key  + ':' + value + ';';
  });

  var content = '<div id="' + options.id + '" style="' + styles + '">' + options.content + '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: content,
    enableEventPropagation: true
  });

  infowindow.id = options.id;
  infowindow.eventsId = options.id;

  callback(marker, infowindow);
};

GoogleMaps.LatLng = function (lat, lng) {
  return new google.maps.LatLng(lat, lng);
};

GoogleMaps.LatLngBounds = function () {
  return new google.maps.LatLngBounds();
};

GoogleMaps.mapType = function (type) {
  return google.maps.MapTypeId[type];
};


/**
 * Javascript v3 Map Functions
 *
 * These functions are available on the Map object as described in the docs:
 * https://developers.google.com/maps/documentation/javascript/3.exp/reference
 */

GoogleMaps.fitBounds = function (map, bounds) {
  if (map) map.fitBounds(bounds);
};

GoogleMaps.getBounds = function (map) {
  if (map) map.getBounds();
};

GoogleMaps.getCenter = function (map) {
  if (map) map.getCenter();
};

GoogleMaps.getDiv = function (map) {
  if (map) map.getDiv();
};

GoogleMaps.getHeading = function (map) {
  if (map) map.getHeading();
};

GoogleMaps.getMapTypeId = function (map) {
  if (map) map.getMapTypeId();
};

GoogleMaps.getProjection = function (map) {
  if (map) map.getProjection();
};

GoogleMaps.getStreetView = function (map) {
  if (map) map.getStreetView();
};

GoogleMaps.getTilt = function (map) {
  if (map) map.getTilt();
};

GoogleMaps.getZoom = function (map) {
  if (map) map.getZoom();
};

GoogleMaps.panBy = function (map, x, y) {
  if (map) map.panBy(x, y);
};

GoogleMaps.panTo = function (map, position) {
  if (map) map.panTo(position);
};

GoogleMaps.panToBounds = function (map, bounds) {
  if (map) map.panToBounds(bounds);
};

GoogleMaps.setCenter = function (map, center) {
  if (map) map.setCenter(center);
};

GoogleMaps.setHeading = function (map, heading) {
  if (map) map.setHeading(heading);
};

GoogleMaps.setMapTypeId = function (map, mapTypeId) {
  if (map) map.setMapTypeId(mapTypeId);
};

GoogleMaps.setStreetView = function (map, position) {
  if (map) map.setStreetView(position);
};

GoogleMaps.setTilt = function (map, tilt) {
  if (map) map.setTilt(tilt);
};

GoogleMaps.setZoom = function (map, zoom) {
  if (map) map.setZoom(zoom);
};


/**
 * Additional Map Functions
 *
 * These functions are not available on the Map object in the v3 API.
 * They have been created to attempt to mimic some functionality in the native API.
 */

GoogleMaps.animateCamera = function (map, options, callback) {
  options = options || {};

  console.log(map, options)
  if (options.target) {
    if (options.target instanceof google.maps.LatLng) {
      map.panTo(options.target);
    }

    if (options.target instanceof google.maps.LatLngBounds) {
      map.fitBounds(options.target);
    }

    // Wait to zoom until after pan
    Meteor.setTimeout(function () {
      if (options.zoom) map.setZoom(options.zoom);
    }, 500);
  } else {
    if (options.zoom) map.setZoom(options.zoom);
  }
};

GoogleMaps.removeMarker = function (marker) {
  marker.setMap(null);
};

GoogleMaps.bindMarkerEvents = function (map, marker) {
  var eventsMap = Maps.Utility.parseEvents(map, 'marker', marker);
  if (eventsMap) marker._marker.addListener('click', eventsMap);
};
