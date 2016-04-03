Template.play.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var thisGame = FlowRouter.getParam('_id');
    self.subscribe('singleGame', thisGame);
  });
});

Template.play.helpers({
  game: function() {
    var thisGame = FlowRouter.getParam('_id');
    return Games.findOne({_id: thisGame});
  },
  isActiveGame: function(userGames) {
    if (!userGames)
      return
      
    var thisGame = FlowRouter.getParam('_id');
    return userGames.indexOf(thisGame) > -1;
  }
})
