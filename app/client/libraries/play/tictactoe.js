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
  //
  // TODO: Find a better way to determine the winner
  //  This is pretty inefficient
  //
  var possibilities = {
    0: {
      combo: [1,2,3],
      found: 0
    },
    1: {
      combo: [4,5,6],
      found: 0
    },
    2: {
      combo: [7,8,9],
      found: 0
    },
    3: {
      combo: [1,4,7],
      found: 0
    },
    4: {
      combo: [2,5,8],
      found: 0
    },
    5: {
      combo: [3,6,9],
      found: 0
    },
    6: {
      combo: [1,5,9],
      found: 0
    },
    7: {
      combo: [3,5,7],
      found: 0
    }
  }

  var newMove = parseInt(gameMove[5]);
  playerMoves.push(newMove);

  if (playerMoves < 3)
    return false;

  var playerWon = false;
  playerMoves.forEach(function(el) {
    for (var i = 0; i < 8; i++) {
      if (possibilities[i].combo.indexOf(el) > -1) {
        possibilities[i].found += 1;

        if (possibilities[i].found === 3) {
          playerWon = true;
        }
      }
    }
  });
  return playerWon;
}

function illegalMove(gameMove, gamesData) {
  //  Rigorous error checking, in case someone tries to be smart and enter game
  //  moves via the console

  //
  //  gameMove does not fit schema
  //
  if (move.length !== 6)
    return false;

  if (gameMove.slice(0, 5) !== "cell-")
    return false;

  if (!parseInt(gameMove[5]))
    return false;

  //
  //  gameMove is already played
  //  is triple checked (player moves, opponent moves, shared moves)
  //
  if (gamesData.allMoves.indexOf(gameMove) > -1)
    return false;

  if (gamesData.myMoves.indexOf(gameMove) > -1)
    return false;

  if (gamesData.opponentMoves.indexOf(gameMove) > -1)
    return false;
}
