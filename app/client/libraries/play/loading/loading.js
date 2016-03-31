Template.loading.onRendered(function() {
  var gameID = this.data._id;
  var opponent = this.data.game.peer;

  peerSetup(function(peerID) {
    if (peerID) {
      var conn = peer.connect(opponent, {label: gameID, metadata: 'connect'});

      conn.on('open', function() {
        // We store the Game metadata in a local client-side collection
        GamesData.insert({_id: gameID, 'opponent': opponent}, function(error, success) {
          if (!error) {
            // We add the game to the user's games collection
            Meteor.call('addGameToUser', gameID, Meteor.userId(), function(err, succ) {
              if (!err) {
                //this.render('play')
                Router.go('play', {_id: gameID});
              }
            })
          }
        });

        // Send messages
        conn.send('Hello!');
      });
    }
  })
})
