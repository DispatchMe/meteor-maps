Maps = {};
Maps.Library = {};

Maps._currentLibrary = null;
Maps._loaded = false;
Maps._maps = {};
Maps._markers = {};
Maps._state = new EventState();

Maps._state.once('loaded', function () {
  Maps._loaded = true;
});

Maps.load = function (mapLibrary, options) {
  Meteor.startup(function () {
    Maps._currentLibrary = Maps.Library[mapLibrary];
    if (!Maps._currentLibrary) throw new Error(mapLibrary, 'is not a supported library');

    Maps._currentLibrary.load(options);
  });
};

Maps.onReady = function(hook) {
  Maps._state.once('loaded', hook);
};

Maps.createMap = function (container, options) {
  if (!Maps._loaded) throw new Error('Maps has not been loaded yet');

  options = options || {};

  return Maps._currentLibrary.createMap(container, options);
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

Maps.Marker = function (id, options) {
  if (Maps._markers[id]) return Maps._markers[id];

  Maps._markers[id] = new Marker(id, options);

  return Maps._markers[id];
};
