class Map {
  constructor(id, options) {
    if (!id) throw new Meteor.Error('Please specify an id for the map');

    options = options || {};

    if (options.center instanceof Array) {
      options.center = Maps.LatLng.apply(this, options.center);
    }

    options.mapTypeId = Maps.MapType(options.mapTypeId || 'ROADMAP');

    this._map = Maps.createMap(options.container.firstNode, options);
    this._markers = [];

    this._events = {};

    this._view = options.container.view;
  }

  bindEvents(eventsMap) {
    this._events = _.extend({}, this._events, eventsMap);
  }

  /**
   * Remove all markers from the map.
   */
  clear() {
    this._markers.forEach(function (marker) {
      marker.remove();
    });

    this._markers = [];
  }

  /**
   * Add a marker to the map.
   * @param  {Object} options
   * @param  {Function} callback
   */
  addMarker(id, options) {
    options = options || {};

    if (options.lat && options.lng) {
      options.position = Maps.LatLng(options.lat, options.lng);

      delete options.lat;
      delete options.lng;
    }

    // Create a new marker
    var marker = new Marker(id, this, options);

    // Push the marker to an array of markers.
    this._markers.push(marker);

    return marker;
  }

  /**
   * Remove a marker from the map.
   * @param  {String} id
   */
  removeMarker(id) {
    var marker = _.findWhere(this._markers, { id: id });
    var markerIndex = this._markers.indexOf(marker);

    // Remove the marker from the array of markers.
    this._markers.splice(markerIndex, 1);

    // Remove the marker from the map.
    marker.remove();
  }

  /**
   * Hide all marker info windows.
   */
  hideInfoWindows() {
    this._markers.forEach(function (marker) {
      marker.hideInfoWindow();
    });
  }

  /**
   * Show all marker info windows.
   */
  showInfoWindows() {
    this._markers.forEach(function (marker) {
      marker.showInfoWindow();
    });
  }

  animateCamera(options) {
    Maps._currentLibrary.animateCamera(this._map, options);
  }

  panBy(x, y) {
    Maps._currentLibrary.panBy(this._map, x, y);
  }

  panTo(position) {
    Maps._currentLibrary.panTo(this._map, position);
  }

  panToBounds(bounds) {
    Maps._currentLibrary.panToBounds(this._map, bounds);
  }

  setCenter(tilt) {
    Maps._currentLibrary.setCenter(this._map, tilt);
  }

  setHeading(heading) {
    Maps._currentLibrary.setHeading(this._map, heading);
  }

  setMapTypeId(mapTypeId) {
    Maps._currentLibrary.setMapTypeId(this._map, mapTypeId);
  }

  setStreetView(position) {
    Maps._currentLibrary.setStreetView(this._map, position);
  }

  setTilt(tilt) {
    Maps._currentLibrary.setTilt(this._map, tilt);
  }

  setZoom(zoom) {
    Maps._currentLibrary.setZoom(this._map, zoom);
  }
}

class Marker {
  constructor(id, map, options) {
    if (!id) throw new Meteor.Error('Please specify an id for the marker');

    var self = this;

    options = options || {};

    self._marker = null;
    self._infowindow = null;

    self.id = id;
    self.map = map;
    self.styles = options.styles;

    if (self.map) {
      Maps._currentLibrary.addMarker(self.map._map, options, function (marker, infowindow) {
        self._marker = marker;
        self._infowindow = infowindow;

        Maps._currentLibrary.bindMarkerEvents(self.map, self);
      });
    }
  }

  remove() {
    Maps._currentLibrary.removeMarker(this._marker);
  }

  showInfoWindow() {
    if (this._infowindow) {
      this._infowindow.open(this.map._map, this._marker);

      var eventsMap = Maps.Utility.parseEvents(this.map, 'infowindow', this._infowindow);
      if (eventsMap) $('#' + this.id).click(eventsMap);
    }
  }

  hideInfoWindow() {
    if (this._infowindow) this._infowindow.close();
  }

  setDynamicContent(newContent) {
    if (this._infowindow) {
      var contentToSet = '<div id="' + this.id + '" style="' + this.styles + '">' + newContent + '</div>';

      this._infowindow.setContent(contentToSet);

      var eventsMap = Maps.Utility.parseEvents(this.map, 'infowindow', this._infowindow);
      if (eventsMap) $('#' + this.id).click(eventsMap);
    }
  }

  getPosition() {
    return this._marker.position;
  }
}

Maps = {};
Maps.Library = {};

Maps._currentLibrary = null;
Maps._maps = {};
Maps._state = new EventState();
Maps._loaded = false;

Maps._state.once('loaded', function () {
  Maps._loaded = true;
});

Maps.load = function (mapLibrary, options) {
  Maps._currentLibrary = Maps.Library[mapLibrary];
  if (!Maps._currentLibrary) throw new Error(mapLibrary, 'is not a supported library');

  Maps._currentLibrary.load(options);
};

Maps.createMap = function (container, options) {
  if (!Maps._loaded) throw new Error('Maps has not been loaded yet');

  options = options || {};

  return Maps._currentLibrary.createMap(container, options);
};

Maps.onReady = function(hook) {
  Maps._state.once('loaded', hook);
};

Maps.MapType = function (type) {
  return Maps._currentLibrary.mapType(type);
};

Maps.LatLng = function (lat, lng) {
  return Maps._currentLibrary.LatLng(lat, lng);
};

Maps.LatLngBounds = function () {
  return Maps._currentLibrary.LatLngBounds();
};

Maps.Map = function (id, options) {
  if (Maps._maps[id]) return Maps._maps[id];

  Maps._maps[id] = new Map(id, options);

  return Maps._maps[id];
};
