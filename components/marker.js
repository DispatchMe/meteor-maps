Marker = class Marker {
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

  getContent() {
    return $('#' + this.id).html();
  }

  setContent(newContent) {
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
};

/**
 * Marker Template
 */
Template.Marker.onCreated(function () {
  var self = this;
  var parentTemplate = self.parent(null, true);

  // Create the marker and add it to the map
  self.autorun(function (c) {
    // Wait for map to be ready.
    var map = parentTemplate && parentTemplate.map && parentTemplate.map.get();
    if (!map) return;

    c.stop();

    self.marker = map.addMarker(self.data.id, self.data);
  });

  // Wait for reactive changes to the template
  // data and update the marker and info window.
  self.autorun(function () {
    var data = Template.currentData();
    if (!self.marker) return;

    // Update marker properties
    Maps.Utility.updateProperties(self.marker, data);
  });
});

Template.Marker.onDestroyed(function () {
  var self = this;
  var parentTemplate = self.parent(null, true);
  var map = parentTemplate && parentTemplate.map.get();

  if (self.marker) map.removeMarker(self.marker.id);
});
