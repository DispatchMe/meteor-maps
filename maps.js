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

  return Maps._currentLibrary.createMap(container, options);;
};

Maps.onReady = function(hook) {
  Maps._state.once('loaded', hook);
};

Maps.mapType = function (type) {
  return Maps._currentLibrary.mapType(type);
};

Maps.LatLng = function (lat, lng) {
  return Maps._currentLibrary.LatLng(lat, lng);
};

Maps.LatLngBounds = function () {
  return Maps._currentLibrary.LatLngBounds();
};

Maps.Map = function (id, options, template) {
  if (!id) throw new Meteor.Error('Please specify an id for the map');

  var self = this;

  options = options || {};

  if (Maps._maps[id]) return Maps._maps[id];

  if (!(self instanceof Maps.Map)) return new Maps.Map(id, options, template);

  // Set up an event emitter for tracking changes.
  self._emitter = new EventEmitter();
  self.emit = self._emitter.emit.bind(self._emitter);
  self.on = self._emitter.on.bind(self._emitter);
  self.removeListener = self._emitter.removeListener.bind(self._emitter);

  self._markers = [];

  Maps._maps[id] = self;

  if (!template) return;

  var container = template && template.firstNode;

  self.map = Maps.createMap(container, options);

  var parentTemplate = template.parent();
  if (!parentTemplate) return;

  self._view = parentTemplate.view;
  self._events = parentTemplate.view.template.__eventMaps[0];
};

Maps.Map.prototype.addMarker = function (options, callback) {
  var self = this;

  options = options || {};

  var markerOptions = {};

  if (options.lat && options.lng) {
    markerOptions.position = Maps.LatLng(options.lat, options.lng);
  }

  _.extend(markerOptions, _.omit(options, 'lat', 'lng'));

  return Maps._currentLibrary.addMarker(self, markerOptions, callback);
};

Maps.Map.prototype.markerAdded = function (marker) {
  this._markers.push(marker);

  this.emit('markerAdded', marker);
};

/**
 * Remove all map markers from the map.
 */
Maps.Map.prototype.clear = function () {
  this._markers.forEach(function (marker) {
    marker.remove();
  });

  this._markers = [];
};
