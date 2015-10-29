// XXX
// OpenLayers has yet to be fully implemented.
// This is just an example to show how the map library could be easily switched.

var OpenLayers = {};

Maps.Library.OpenLayers = OpenLayers;

OpenLayers.OPTIONS_MAP = {};

OpenLayers.load = function () {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'http://openlayers.org/en/v3.8.2/build/ol.js';

  script.onload = function () {
    Maps._maps = ol;
    Maps._state.emitState('loaded', ol);
  };

  document.body.appendChild(script);
};

OpenLayers.createMap = function (container, options) {
  return new Maps._maps.Map({
    target: container.id,
    layers: [
      new Maps._maps.layer.Tile({
        source: new Maps._maps.source.MapQuest({layer: 'osm'})
      })
    ],
    view: new Maps._maps.View({
      center: [0, 0],
      zoom: 8
    })
  });
};
