Meteor.methods({
  newGame: function(data) {
    return Games.insert({game: data});
  }
})
