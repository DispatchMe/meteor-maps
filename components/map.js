Template.Map.onCreated(function () {
  this.map = new ReactiveVar();
});

Template.Map.onRendered(function () {
  var map = Maps.Map(this.data.id, this.data.options, this);

  this.map.set(map);
});
