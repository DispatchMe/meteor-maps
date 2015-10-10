if (Meteor.isClient) {
  label = new ReactiveVar('test');

  Meteor.startup(function () {
    Maps.load('GoogleMaps', {
      v: '3.20',
      client: Meteor.settings.public.GOOGLE_MAPS_CLIENT_ID,
      libraries: 'places'
    });
  });

  var mapReady = new ReactiveVar(false);

  Maps.onReady(function () {
    mapReady.set(true);
  });

  Template.registerHelper('ready', function () {
    return mapReady.get();
  });

  Template.example.events({
    'click marker': function (event, template, marker) {
      // marker.setAnimation(google.maps.Animation.j);
    },
    'click marker#marker1': function (event, template, marker) {
      marker.showInfoWindow();
      console.log('yse')
    },
    'click marker#marker2': function () {
      console.log('set');
      label.set('test ' + Math.random())
    },
    'click infowindow#marker1': function (event, template, infowindow) {
      alert(infowindow.getContent());
    }
  });

  Template.example.helpers({
    mapOptions: function () {
      return {
        center: Maps.LatLng(42.3601, -71.0589),
        zoom: 8,
        mapTypeId: Maps.mapType('ROADMAP')
      };
    },
    marker1Content: function () {
      return label.get();
    }
  });

  Template.example.onCreated(function () {
    this.marker1Size = new ReactiveVar([10, 10]);
  });
}
