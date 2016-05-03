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
        player = currMove.player;
      }
    })

    return player;
  }
})

Template.tictactoe.events({
  'click .unchecked': function(event) {
    var gameID = FlowRouter.getParam('_id');
    var localGameData = GamesData.findOne({_id: gameID});
    var currPlayer = whichPlayer(gameID);

    // Creator of game begins
    if (currPlayer === 'player-0') {
      if (!localGameData.allMoves || )
    }

    // If game not open yet, abort
    if (!localGameData)
      return false;

    var opponent = localGameData.opponent;

    // Get the last element in the list of available connections
    var connection = peer.connections[opponent][peer.connections[opponent].length - 1];

    // If no connection, abort
    if (!connection)
      return false;

    var cellChosen = event.currentTarget.id;
    var gameMove = parseInt(cellChosen[5])

    // Check if move is illegal
    console.log(gameMove, cellChosen, localGameData)

    if (illegalMove(gameMove, cellChosen, localGameData)) {
      console.log("Illegal Move!")
      return false;
    }


    if (localGameData.myMoves) {
      // Check whether the player has won
      if (hasPlayerWon(gameMove, localGameData.myMoves)) {
        //do whatever
        console.log("You have won")
      }
    }

    // We send the chosen move to the opponent
    connection.send(cellChosen);

    // We wait for a callback from opponent
    // Then we store the gameMove in local and server collection
    connection.on('data', function(data) {
      if (data === "CB") {
        // Store gameData in local browser collection
        GamesData.update({_id: gameID}, {
          $push: {
            'myMoves': gameMove,
            'allMoves': gameMove
          }
        });

        var gameData = {
          'player': whichPlayer,
          'playerId': Meteor.userId(),
          'gameMove': gameMove
        }

        // Only the player who made the current move sends the data to the server
        Meteor.call('storeGameMove', gameID, gameData, function(error, success) {
          console.log("Do something2");
        })
      }
      // If we received no successful callback, show error
      else {
        // TODO
        console.log("Do something")
      }
    })
  }
})

function whichPlayer(gameID) {
  var currUser = Meteor.user();
  var personalGames = currUser.personalGames;

  // We find out which player made the game move
  var whichPlayer = "player-1";
  if (personalGames) {
    if (personalGames.indexOf(gameID) > -1) {
      whichPlayer = "player-0"
    }
  }

  return whichPlayer;
}