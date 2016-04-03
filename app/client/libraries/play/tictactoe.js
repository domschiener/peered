Template.tictactoe.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var thisGame = FlowRouter.getParam('_id');
    self.subscribe('singleGame', thisGame);
  });

  peerSetup(function(id) {
    console.log("Success! Your Peer ID is: " + id);
  })
});

Template.tictactoe.events({
  'click .cell': function(event) {
    var gameID = FlowRouter.getParam('_id');
    var localGameData = GamesData.findOne({_id: gameID});

    // If game not open yet, stop
    if (!localGameData)
      return false;

    var opponent = localGameData.opponent;

    // Get the last element in the list of available connections
    var connection = peer.connections[opponent][peer.connections[opponent].length - 1];



    var gameMove = event.currentTarget.id;

    // Send the playmove to the other peer
    //   peer stores it in local mongodb
    //   both peers send the move to the server
  }
})

function hasPlayerWon(gameMove, playerMoves) {
  var possibilities   = [
    [1,2,3],
    [4,5,6],
    [7,8,9],

    [1,4,7],
    [2,5,8],
    [3,6,9],

    [1,5,9],
    [3,5,7]
  ];

  // First order the game moves by size

}

function illegalMove(gameMove, gamesData) {
  //  Rigorous error checking, in case someone tries to be smart and enter game
  //  moves via the console

  //
  //  gameMove does not fit schema
  //
  if (move.length !== 6)
    return false;



  //
  //  gameMove is already played
  //
  if (gamesData.allMoves.indexOf(gameMove) > -1)
    return false;



}
