Template.loading.onRendered(function() {
  var gameID = this.data.game._id;
  var opponent = this.data.game.game.peer;

  peerSetup(function(peerID) {
    if (peerID) {
      var conn = peer.connect(opponent, gameID);

      conn.on('open', function() {
        GamesData.insert({_id: gameID, 'opponent': opponent});
        // Receive messages
        console.log(conn);
        conn.on('data', function(data) {
          console.log('Received', data);
        });

        // Send messages
        conn.send('Hello!');
      });
    }
  })
})
