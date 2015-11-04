Map = class Map {
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

  addDirections(id, options) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setMap(this._map);

    if (options.origin instanceof Array) {
      options.origin = Maps.LatLng.apply(this, options.origin);
    }

    if (options.destination instanceof Array) {
      options.destination = Maps.LatLng.apply(this, options.destination);
    }

    var request = {
      origin: options.origin,
      destination: options.destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) directionsDisplay.setDirections(response);
    });
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
};

/**
 * Map Template
 */
Template.Map.helpers({
  isCordova: function () {
    return Meteor.isCordova;
  }
});

Template.Map.onCreated(function () {
  this.map = new ReactiveVar();
});

Template.Map.onRendered(function () {
  var self = this;

  Maps.onReady(function () {
    var options = _.extend(self.data.options, { container: self });

    var map = Maps.Map(self.data.id, options);

    var parentTemplate = self.parent();

    if (parentTemplate) {
      map.bindEvents(parentTemplate.view.template.__eventMaps[0]);
    }

    self.map.set(map);
  });
});
