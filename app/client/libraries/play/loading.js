Template.loading.onCreated(function() {
  Tracker.autorun(function() {
      FlowRouter.subsReady("thisGame");
  });
})

Template.loading.onRendered(function() {

  if (FlowRouter.subsReady("thisGame")) {
    var gameID = FlowRouter.getParam('_id');
    var currentGame = Games.findOne({_id: gameID});

    if (!currentGame) 
      return


    var opponent = currentGame.game.peer;

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
              // We add the game to the user's games collection and make the game live
              console.log("Successfully connected to game: ", gameID);
              Meteor.call('makeGameLive', gameID, Meteor.userId());
            }
          });
        });

        conn.on('data', function(data) {
          // If data is a callback, abort
          if (data === "CB" || data === "GAMEOVER" || data === "WRONGMOVE" || data === "PLAY")
            return

          var localGameData = GamesData.findOne({_id: gameID});
          var opponent = localGameData.opponent;
          var cellChosen = data;
          var gameMove = parseInt(cellChosen[5])

          // Check if move is illegal
          if (illegalMove(gameMove, cellChosen, localGameData)) {
            console.log("wrongmove")
            conn.send('WRONGMOVE');
            return
          }

          var playerHasWon = false;
          var gameIsOver = false;
          if (localGameData.opponentMoves) {
            // Check whether the player has won
            if (hasPlayerWon(gameMove, localGameData.opponentMoves)) {
              //do whatever
              playerHasWon = true;
              console.log("Opponent has won")
            }

            // Check whether there is a tie
            // If the player has won, set to false. Else check if all moves equal to 9
            gameIsOver = playerHasWon ? false : localGameData.allMoves.length + 1 === 9 ? true : false;
          }

          GamesData.update({_id: conn.label}, {
            $push: {
              'opponentMoves': gameMove,
              'allMoves': gameMove
            }
          }, function(error, success) {
            if (!error) {
              if (playerHasWon || gameIsOver) {
                conn.send("GAMEOVER")
              } else {
                conn.send("CB");
              }
            }
          });
        })
      }
    })
  }
})
