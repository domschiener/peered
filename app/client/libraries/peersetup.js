var key = Meteor.settings.public.peerjs_key;
peer = false;

peerSetup = function(cb) {
  'use strict';

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

    console.log(error.type);
    $('header').append('<div class="alert alert-danger peerError"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>ERROR! </strong>' + error.message + '. Try reloading the page. </div>');
  });
}

// Accounts.onLogin(function() {
//   peerSetup();
// })
