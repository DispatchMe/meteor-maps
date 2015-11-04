var Utility = {};

Maps.Utility = Utility;

var browserPropertyMap = {

};

var cordovaPropertyMap = {
  'snippet': 'content'
};

var getPropertyToSet = function (key) {
  var property = (Meteor.isCordova) ? cordovaPropertyMap[key] : browserPropertyMap[key];
  return property || key;
};

Utility.parseEvents = function (map, entityType, entity) {
  var events = map && map._events;
  if (!events) return;

  if (!events['click ' + entityType] && !events['click ' + entityType + '#' + entity.id]) return;

  return function () {
    if (events['click ' + entityType]) {
      events['click ' + entityType].call(map._view, { currentTarget: map._view }, entity);
    }

    if (events['click ' + entityType + '#' + entity.id]) {
      events['click ' + entityType + '#' + entity.id].call(map._view, { currentTarget: map._view }, entity);
    }
  };
};

Utility.updateProperties = function (entity, data) {
  for (var key in entity) {
    if (!entity.hasOwnProperty(key) && key.substring(0, 3) === 'set') {
      var propertyToSet = getPropertyToSet(key.substring(3).toLowerCase());
      var valueToSet = data[propertyToSet];

      // If there is a value to set for the current property
      // then run the set function with that value.
      // Otherwise, we do not run the set function because
      // we do not want to set a null value for a property.
      if (valueToSet) entity[key].call(entity, valueToSet);
    }
  }
};

// Scale the bounding box by a given exponent.
// The exponent allows us to view more of the map
// if the markers are close together.
Utility.scaleBounds = function (bounds, exponent) {
  if (!bounds) return;
  if (!exponent) return bounds;

  var center = bounds.getCenter();
  var scaledBounds = Maps.LatLngBounds();

  _.each(bounds, function (point, key) {
    if (isNaN(key)) return;

    var latChange = point.lat - center.lat;
    var lngChange = point.lng - center.lng;

    var newLat = point.lat +
      latChange / Math.abs(latChange) * Math.pow(Math.abs(latChange), exponent);
    var newLng = point.lng +
      lngChange / Math.abs(lngChange) * Math.pow(Math.abs(lngChange), exponent);

    var newPosition = Maps.LatLng(newLat, newLng);
    scaledBounds.extend(newPosition);
  });

  return scaledBounds;
};
