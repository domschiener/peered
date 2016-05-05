Meteor.publish('gameListings', function() {
  //TODO Only return public games
  return Games.find({});
});

Meteor.publish('thisGame', function(gameId) {
  //TODO Only return public games
  return Games.find({_id: gameId});
});

Meteor.publish("userData", function (otherUserID) {
  if (this.userId) {
    return Meteor.users.find({}, {fields: {'services': 0}});
    //return Meteor.users.find({_id: this.userId}, {fields: {'services': 1}});
  } else {
    this.ready();
  }
});
