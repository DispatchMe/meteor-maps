Template.Map.helpers({
  isCordova: function () {
    return Meteor.isCordova;
  }
});

Template.Map.onCreated(function () {
  this.map = new ReactiveVar();
});

Template.Map.onRendered(function () {
  var options = _.extend(this.data.options, { container: this });

  var map = Maps.Map(this.data.id, options);

  var parentTemplate = this.parent();

  if (parentTemplate) {
    map.bindEvents(parentTemplate.view.template.__eventMaps[0]);
  }

  this.map.set(map);
});
