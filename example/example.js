if (Meteor.isClient) {
  var label = new ReactiveVar('test');

  Maps.load('GoogleMaps', {
    v: '3.20',
    client: Meteor.settings.public.GOOGLE_MAPS_CLIENT_ID,
    libraries: 'places'
  });

  Template.example.events({
    'click marker': function (event, template, marker) {
      marker.showInfoWindow();
    },
    'click marker#marker2': function () {
      label.set('Check it, I have reactively updated: ' + Math.random());
    },
    'click infowindow#marker1': function (event, template, infowindow) {
      alert(infowindow.getContent());
    }
  });

  Template.example.helpers({
    mapOptions: function () {
      return {
        center: [42.3601, -71.0589],
        zoom: 8,
        mapTypeId: 'ROADMAP',
        scrollwheel: false
      };
    },
    marker1Content: function () {
      return label.get();
    },
    directionsOptions1: function () {
      return {
        origin: [42.3601, -74.0589],
        destination: [42.3601, -71.0589]
      };
    },
    directionsOptions2: function () {
      return {
        origin: [41.3601, -72.0589],
        destination: [43.3601, -72.0589]
      };
    }
  });
}

