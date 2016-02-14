Template.games.rendered = function() {

}

Template.games.helpers({
  gameData: function(gameID) {
    return Games.findOne({_id: gameID});
  },
  notOwner: function(userID, gameID) {
    return (userID !== gameID);
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
