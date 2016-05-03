var key = Meteor.settings.public.peerjs_key;
peer = false;

peerSetup = function(cb) {
  if (peer) {
    cb(peer.id);
    return
  }

  var user = Meteor.userId();
  peer = new Peer(user, {key: "czdh4a0vqplj714i"});

  peer.on('open', function(id) {
    cb(id);
    return
  });

  // When we receive an incoming connection, insert the data into a local collection
  peer.on('connection', function(conn) {
    // If the connection is for reconnecting, abort
    if (conn.metadata === "reconnect") {
      return
    }

    var game = conn.label;
    var opponent = conn.peer;
    console.log("Received new connection", opponent);
    GamesData.insert({_id: game, 'opponent': opponent}, function(error, success) {
      if (!error) {
        //Do some shit
      }
    });

    conn.on('data', function(data) {
      // If the data sent is a callback, abort
      if (data === "CB")
        return

      var localGameData = GamesData.findOne({_id: conn.label});
      var opponent = localGameData.opponent;
      var cellChosen = data;
      var gameMove = parseInt(cellChosen[5])

      // Check if move is illegal
      if (illegalMove(gameMove, cellChosen, localGameData)) {
        conn.send('WRONGMOVE');
      }

      var playerHasWon = false;
      if (localGameData.myMoves) {
        // Check whether the player has won
        if (hasPlayerWon(gameMove, localGameData.myMoves)) {
          //do whatever
          playerHasWon = true;
          console.log("You have won")
        }
      }

      GamesData.update({_id: conn.label}, {
        $push: {
          'opponentMoves': gameMove,
          'allMoves': gameMove
        }
      }, function(error, success) {
        if (!error) {
          conn.send("CB");
        }
      });


      console.log("peersetup", data);
    })

    conn.on('close', function() {
      // do whatever
      console.log("Connection closed");
    })

    conn.on('error', function(error) {
      // do whatever
      console.log(error);
    })
  });


  //
  //  Central dispatcher for peer based error messages
  //
  peer.on('error', function(error) {
    if (error.type === 'unavailable-id') {
      // whatever
    }
    console.log(error.type);
    $('header').append('<div class="alert alert-danger peerError"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>ERROR! </strong>' + error.message + '. Try reloading the page. </div>');
  });
}

// Accounts.onLogin(function() {
//   peerSetup();
// })
