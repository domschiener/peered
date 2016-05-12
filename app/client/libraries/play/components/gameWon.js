var opponentPlay;
var playAgain;
var conn;

Template.gameWon.onCreated(function() {

  var thisGame = FlowRouter.getParam('_id');
  var localGameData = GamesData.findOne({_id: gameID});
  var opponent = localGameData.opponent;
  conn = peer.connections[opponent][peer.connections[opponent].length - 1];

  conn.once('data', function(data) {
    if (data === 'PLAY') {
      if (playAgain) {
        Meteor.call('playAgain', thisGame);
      } else {
        opponentPlay = true;
      }
    }
  })
})

Template.gameWon.events({
  'click #newround': function() {
    // Send request to play to other peer
    conn.send('PLAY')
    playAgain = true;
  },
  'click #quit': function() {
    // Only one of the players needs to click on quit game in order to end it
    var thisGame = FlowRouter.getParam('_id');
    Meteor.call('quitGame', thisGame);
  }
})
