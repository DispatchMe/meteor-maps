/* global GoogleMaps:true, Maps:false */

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

GoogleMaps.mapType = function (type) {
  return google.maps.MapTypeId[type];
};

GoogleMaps.addMarker = function (map, options, callback) {
  options = _.extend({ map: map.map }, options);

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

  marker.infowindow = new google.maps.InfoWindow({
    content: content,
    enableEventPropagation: true
  });

  marker.infowindow.eventsId = options.id;

  marker.infowindow.setDynamicContent = function (newContent) {
    var contentToSet = '<div id="' + options.id + '" style="' + styles + '">' + newContent + '</div>';

    marker.infowindow.setContent(contentToSet);

    var events = Maps.Utility.parseEvents(map, 'infowindow', marker.infowindow);
    if (events) $('#' + options.id).click(events);
  };

  marker.showInfoWindow = function () {
    marker.infowindow.open(map.map, marker);

    var events = Maps.Utility.parseEvents(map, 'infowindow', marker.infowindow);
    if (events) $('#' + options.id).click(events);
  };

  marker.remove = function () {
    marker.setMap(null);
  };

  var events = Maps.Utility.parseEvents(map, 'marker', marker);
  if (events) marker.addListener('click', events);

  map.markerAdded(marker);

  callback(marker);
};

GoogleMaps.LatLng = function (lat, lng) {
  return new google.maps.LatLng(lat, lng);
};

GoogleMaps.LatLngBounds = function () {
  return new google.maps.LatLngBounds();
};
