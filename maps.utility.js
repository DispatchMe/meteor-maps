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

  if (!events['click ' + entityType] && !events['click ' + entityType + '#' + entity.eventsId]) return;

  return function () {
    if (events['click ' + entityType]) {
      events['click ' + entityType].call(map._view, { currentTarget: map._view }, entity);
    }

    if (events['click ' + entityType + '#' + entity.eventsId]) {
      events['click ' + entityType + '#' + entity.eventsId].call(map._view, { currentTarget: map._view }, entity);
    }
  };
};

Utility.updateProperties = function (entity, data) {
  for (var key in entity) {
    if (!entity.hasOwnProperty(key) && key.substring(0, 3) === 'set') {
      var propertyToSet = getPropertyToSet(key.substring(3).toLowerCase());
      var valueToSet = data[propertyToSet];

      // If the content is being updated use the 'setDynamicContent' function
      // which will change the content and set the events up on the new DOM element.
      if (!Meteor.isCordova && key === 'setContent') key = 'setDynamicContent';

      // If there is a value to set for the current property
      // then run the set function with that value.
      // Otherwise, we do not run the set function because
      // we do not want to set a null value for a property.
      if (valueToSet) entity[key].call(entity, valueToSet);
    }
  }
};
