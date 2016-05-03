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
  // Add a gameID to the users games field
  addGameToUser: function(game, user) {
    return Meteor.users.update({_id: user}, {
      $push: {
        'games': game
      }
    });
  },
  // Set a game to ready
  makeGameLive: function(gameID, opponentID) {
    return Games.update({_id: gameID}, {
      $set: {
        'game.opponent': opponentID,
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
