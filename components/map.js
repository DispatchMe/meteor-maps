Template.Map.helpers({
  isCordova: function () {
    return Meteor.isCordova;
  }
});

Template.Map.onCreated(function () {
  this.map = new ReactiveVar();
});

Template.Map.onRendered(function () {
  var self = this;

  Maps.onReady(function () {
    var options = _.extend(self.data.options, { container: self });

    var map = Maps.Map(self.data.id, options);

    var parentTemplate = self.parent();

    if (parentTemplate) {
      map.bindEvents(parentTemplate.view.template.__eventMaps[0]);
    }

    self.map.set(map);
  });
});
