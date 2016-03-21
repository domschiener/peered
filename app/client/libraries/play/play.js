Template.play.rendered = function() {
  var currentUser = peerSetup();
}

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
