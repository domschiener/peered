Template.tictactoe.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var thisGame = FlowRouter.getParam('_id');
    self.subscribe('thisGame', thisGame);
  });

  // Setup the Peerjs connection
  peerSetup(function(id) {
    console.log("Success! Your Peer ID is: " + id);
  })
});

Template.tictactoe.helpers({
  gameData: function() {
    var thisGame = FlowRouter.getParam('_id');
    return Games.findOne({_id: thisGame});
  },
  playerData: function(playerID) {
    return Meteor.users.findOne({_id: playerID});
  },
  gameElements: function() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  },
  isGameMove: function(element, gameMoves) {
    var isGameFound = false;

    if (!gameMoves)
      return isGameFound;

    gameMoves.forEach(function(currMove) {
      if (currMove.gameMove === element) {
        isGameFound = true;
      }
    })

    return isGameFound;
  },
  findPlayer: function(element, gameMoves) {
    var player;
    gameMoves.forEach(function(currMove) {
      if (currMove.gameMove === element) {
        if (currMove.player === 'playerZero') {
          player = "player-0";
        } else {
          player = "player-1"
        }
      }
    })

    return player;
  }
})

Template.tictactoe.events({
  'click .unchecked': function(event) {
    var gameID = FlowRouter.getParam('_id');
    var localGameData = GamesData.findOne({_id: gameID});

    // If a player has won, we make it impossible to move
    if (localGameData.hasWon)
      return false;

    var currPlayer = whichPlayer(gameID);

    // Creator of game begins
    if (currPlayer === 'playerOne') {
      if (!localGameData.allMoves) {
        console.log("Player 0's turn");
        return false;
      }

      if (localGameData.allMoves.length % 2 === 0) {
        console.log("Player 0's turn");
        return false;
      }
    }
    else {
      if (localGameData.allMoves) {
        if (localGameData.allMoves.length % 2 !== 0) {
          console.log("Player 1's turn");
          return false;
        }
      }
    }

    // If game not open yet, abort
    if (!localGameData)
      return false;

    var opponent = localGameData.opponent;

    // Get the last element in the list of available connections
    var conn = peer.connections[opponent][peer.connections[opponent].length - 1];

    // If no connection, abort
    if (!conn)
      return false;

    var cellChosen = event.currentTarget.id;
    var gameMove = parseInt(cellChosen[5])

    // Check if move is illegal
    if (illegalMove(gameMove, cellChosen, localGameData)) {
      console.log("Illegal Move!")
      return false;
    }

    var playerHasWon = false;
    if (localGameData.myMoves) {
      // Check whether the player has won
      if (hasPlayerWon(gameMove, localGameData.myMoves)) {
        //do whatever
        console.log("You have won")
        playerHasWon = true;
      }
    }

    // We send the chosen move to the opponent
    console.log("trying to send data")
    conn.send(cellChosen);

    // We wait for a callback from opponent
    // Then we store the gameMove in local and server collection
    conn.once('data', function(data) {
      if (data === "CB") {
        // Store gameData in local browser collection
        var gameData = {
          'player': currPlayer,
          'playerId': Meteor.userId(),
          'gameMove': gameMove
        }

        // Only the player who made the current move sends the data to the server
        Meteor.call('storeGameMove', gameID, gameData, function(error, success) {
          GamesData.update({_id: gameID}, {
            $push: {
              'myMoves': gameMove,
              'allMoves': gameMove
            }
          });
        })
      }
      // If we received no successful callback, show error
      else {
        // TODO
        if (data === "WON" && playerHasWon) {
          var gameData = {
            'player': currPlayer,
            'playerId': Meteor.userId(),
            'gameMove': gameMove
          }

          var string = "score." + currPlayer
          var player = {};
          player[string] = 1;
          var playerScore = JSON.stringify(player)

          Meteor.call('playerWon', gameID, gameData, playerScore)
        }
      }
    })

    delete conn;
  }
})

function whichPlayer(gameID) {
  var currUser = Meteor.user();
  var personalGames = currUser.personalGames;

  // We find out which player made the game move
  var whichPlayer = "playerOne";
  if (personalGames) {
    if (personalGames.indexOf(gameID) > -1) {
      whichPlayer = "playerZero"
    }
  }

  return whichPlayer;
}
