Template.play.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var thisGame = FlowRouter.getParam('_id');
    self.subscribe('singleGame', thisGame);
  });
});

Template.play.helpers({
  isGameReady: function() {
    var thisGame = FlowRouter.getParam('_id');
    return Games.findOne({_id: thisGame}).game.ready;
  },
  isPlayer: function() {
    var currUser = Meteor.user();
    var activeGames = currUser.games;
    var personalGames = currUser.personalGames;
    var thisGame = FlowRouter.getParam('_id');

    if (activeGames.indexOf(thisGame) === -1) {
      // Redirect user if not active gamer
      FlowRouter.go('/games');
      return false;
    }

    var isPersonalGame;
    if (!personalGames) {
      isPersonalGame = false;
    }
    else {
      isPersonalGame = personalGames.indexOf(thisGame) > -1;
    }

    if (!isPersonalGame) {
      var gameID =  FlowRouter.getParam('_id');
      var currentGame = Games.findOne({_id: gameID})
      var opponent = currentGame.game.peer;

      if (typeof peer.connections !== 'undefined') {
        var connections = peer.connections[opponent]
        if (connections) {
          //If we already have an active connection, abort connection process
          if (connections[connections.length - 1].open) {
            return true;
          }
        }
      }

      peerSetup(function(peerID) {
        if (peerID) {
          var conn = peer.connect(opponent, {label: gameID, metadata: 'connect'});

          conn.on('open', function() {
            // We store the Game metadata in a local client-side collection
            GamesData.insert({
              '_id': gameID,
              'opponent': opponent,
              'hasWon': false
            }, function(error, success) {
              if (!error) {
                // We add the game to the user's games collection
                Meteor.call('addGameToUser', gameID, Meteor.userId(), function(err, succ) {
                  if (!err) {
                    console.log("Successfully connected to game: ", gameID);
                  }
                })
              }
            });
          });

          conn.on('data', function(data) {
            // If data is a callback, abort
            if (data === "CB")
              return

            var localGameData = GamesData.findOne({_id: gameID});
            var opponent = localGameData.opponent;
            var cellChosen = data;
            var gameMove = parseInt(cellChosen[5])

            // Check if move is illegal
            if (illegalMove(gameMove, cellChosen, localGameData)) {
              conn.send('WRONGMOVE');
              return
            }

            var playerHasWon = false;
            if (localGameData.opponentMoves) {
              // Check whether the player has won
              if (hasPlayerWon(gameMove, localGameData.opponentMoves)) {
                //do whatever
                playerHasWon = true;
                console.log("You have won")
              }
            }

            GamesData.update({_id: conn.label}, {
              $push: {
                'opponentMoves': gameMove,
                'allMoves': gameMove
              }
            }, function(error, success) {
              if (!error) {
                if (playerHasWon) {
                  conn.send("WON")
                } else {
                  conn.send("CB");
                }
              }
            });

          })
        }
      })
    }

    return true;
  },
  isPersonalGame: function() {
    // Check if creator of game
    var personalGames = Meteor.user().personalGames;
    if (!personalGames)
      return false;

    var thisGame = FlowRouter.getParam('_id');
    return personalGames.indexOf(thisGame) > -1;
  }
})
