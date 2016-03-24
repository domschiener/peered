Meteor.methods({
  newGame: function(data) {
    return Games.insert({game: data, createdAt: Date.now()}, function(error, success) {
      if (!error) {
        console.log(data.peer);
        Meteor.users.update({_id: data.peer}, {$push: {'games': success}}, function(err, succ) {
          console.log(err, succ);
        });
        return success
      }
    });
  },
  addGameToUser: function(game, user) {
    return Meteor.users.update({_id: user}, {$push: {'games': game}});
  },
  makeGameLive: function(gameID) {
    return Games.update({_id: gameID}, {$set: {'game.ready': true}})
  }
})
