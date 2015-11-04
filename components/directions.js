Template.Directions.onCreated(function () {
  var self = this;
  var parentTemplate = self.parent(null, true);

  // Create the marker and add it to the map
  self.autorun(function (c) {
    // Wait for map to be ready.
    var map = parentTemplate && parentTemplate.map && parentTemplate.map.get();
    if (!map) return;

    c.stop();

    self.directions = map.addDirections(self.data.id, self.data);
  });
});

Template.Directions.onDestroyed(function () {
  var self = this;
  var parentTemplate = self.parent(null, true);
  var map = parentTemplate && parentTemplate.map.get();

  if (self.directions) map.removeMarker(self.directions.id);
});
