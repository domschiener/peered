Meteor.publish('gameListings', function() {
  //TODO Only return public games
  return Games.find({});
});

Meteor.publish('thisGame', function(gameId) {
  //TODO Only return public games
  return Games.find({_id: gameId});
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {'services': 1});
  } else {
    this.ready();
  }
});
