Meteor.methods({
  // Insert a new Game into the Games collection
  newGame: function(data) {
    return Games.insert({
      game: data,
      createdAt: Date.now()
    }, function(error, success) {
      if (!error) {
        Meteor.users.update({_id: data.peer}, {
          $push: {
            'games': success,
            'personalGames': success
          }
        });
        return success
      }
    });
  },
  // Set a game to ready
  makeGameLive: function(gameID, user) {
    // We add the gameID to the users collection
    Meteor.users.update({_id: user}, {
      $push: {
        'games': gameID
      }
    });

    // Then we add user as opponent to game and update the game to ready
    return Games.update({_id: gameID}, {
      $set: {
        'score.playerZero': 1,
        'score.playerOne': 0,
        'game.opponent': user,
        'game.won': false,
        'game.ready': true
      }
    })
  },
  // Store a gameMove
  storeGameMove: function(gameID, gameData) {
    return Games.update({_id: gameID}, {
      $push: {
        'gameMoves': gameData
      }
    })
  }
})
