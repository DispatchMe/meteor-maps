Template.Marker.onCreated(function () {
  var self = this;
  var parentTemplate = self.parent(null, true);

  // Create the marker and add it to the map
  self.autorun(function (c) {
    var map = parentTemplate && parentTemplate.map && parentTemplate.map.get();
    if (!map) return;

    c.stop();

    map.addMarker(self.data, function (marker) {
      self.marker = marker;
    });
  });

  // Wait for reactive changes to the template
  // data and update the marker and info window.
  self.autorun(function () {
    var data = Template.currentData();
    if (!self.marker) return;

    // Update marker properties
    Maps.Utility.updateProperties(self.marker, data);

    // Update info window properties
    Maps.Utility.updateProperties(self.marker.infowindow, data);
  });
});
