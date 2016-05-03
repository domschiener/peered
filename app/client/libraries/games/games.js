Template.games.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('gameListings');
  });
});

Template.games.helpers({
  allGames: function() {
    return Games.find({}).fetch();
  },
  gameData: function(gameID) {
    return Games.findOne({_id: gameID});
  },
  notPersonalGame: function(gameID) {
    // If user not logged in, display all available games
    if (!Meteor.userId())
      return true;

    return Meteor.user().games.indexOf(gameID) === -1;
  },
  personalGame: function(gameID) {
    return Meteor.user().games.indexOf(gameID) > -1;
  },
  randomColor: function() {
    var options = [
      'purple',
      'blue',
      'violet',
      'orange',
      'red',
      'light_blue',
      'dark_blue',
      'dark_purple',
      'runningOutOfNames',
      'monday',
      'someblue',
      'crazy',
      'crazy2',
    ]

    return options[Math.round(Math.random() * (options.length - 1))];
  }
})
