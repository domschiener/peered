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
  }
})
