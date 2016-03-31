Template.play.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var thisGame = FlowRouter.getParam('_id');
    self.subscribe('singleGame', thisGame);
  });

  peerSetup(function(peerID) {
    console.log("You're successfully connected again");
  })
});

Template.play.helpers({
  game: function() {
    var thisGame = FlowRouter.getParam('_id');
    return Games.findOne({_id: thisGame});
  },
  isActiveGame: function(userGames) {
    var thisGame = FlowRouter.getParam('_id');
    return userGames.indexOf(thisGame) > -1;
  }
})

Template.play.events({
  'click .cell': function(event) {
    //var turns = Games.findOne({_id: this._id}).turns;
    var cell = event.currentTarget.id;
    console.log(cell);

    // Send the playmove to the other peer
    //   peer stores it in local mongodb
    //   both peers send the move to the server
  }
})

function illegalMove(move, gameID) {
  //
  // Check if move value fits the schema
  //
  if (move.length !== 6)
    return false;

  //if

  var allMoves = GamesDate.findOne({_id: gameID}).moves;

}
