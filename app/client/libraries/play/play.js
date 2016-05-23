Template.play.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var thisGame = FlowRouter.getParam('_id');
    self.subscribe('singleGame', thisGame);
    var userDataSub = self.subscribe('userData');

    if (userDataSub.ready()) {
      console.log("hey")

      //If user is not logged in, redirect to login
      if (!Meteor.user()) {
        redirect('/join');
      }
    }
  });
});

Template.play.helpers({
  isGameReady: function() {
    var thisGame = FlowRouter.getParam('_id');
    return Games.findOne({_id: thisGame}).game.ready;
  },
  isPlayer: function() {
    var currUser = Meteor.user();
    var activeGames = currUser.games;
    var personalGames = currUser.personalGames;
    var thisGame = FlowRouter.getParam('_id');

    if (activeGames.indexOf(thisGame) === -1) {
      // Redirect user if not active gamer
      FlowRouter.go('/games');
      return false;
    }

    var isPersonalGame;
    if (!personalGames) {
      isPersonalGame = false;
    }
    else {
      isPersonalGame = personalGames.indexOf(thisGame) > -1;
    }

    if (!isPersonalGame) {
      var gameID =  FlowRouter.getParam('_id');
      var currentGame = Games.findOne({_id: gameID})
      var opponent = currentGame.game.peer;

      if (typeof peer.connections !== 'undefined') {
        var connections = peer.connections[opponent]
        if (connections) {
          //If we already have an active connection, abort connection process
          if (connections[connections.length - 1].open) {
            return true;
          }
        }
      }

      peerSetup(function(peerID) {
        if (peerID) {
          var conn = peer.connect(opponent, {label: gameID, metadata: 'connect'});

          conn.on('open', function() {
            // We store the Game metadata in a local client-side collection
            GamesData.insert({
              '_id': gameID,
              'opponent': opponent,
              'hasWon': false
            }, function(error, success) {
              if (!error) {
                // We add the game to the user's games collection
                Meteor.call('addGameToUser', gameID, Meteor.userId(), function(err, succ) {
                  if (!err) {
                    console.log("Successfully connected to game: ", gameID);
                  }
                })
              }
            });
          });
        }
      })
    }

    return true;
  },
  isPersonalGame: function() {
    // Check if creator of game
    var personalGames = Meteor.user().personalGames;
    if (!personalGames)
      return false;

    var thisGame = FlowRouter.getParam('_id');
    return personalGames.indexOf(thisGame) > -1;
  }
})
