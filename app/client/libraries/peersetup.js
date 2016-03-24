var key = Meteor.settings.public.peerjs_key;
peer = false;

peerSetup = function(cb) {
  'use strict';

  if (peer) {
    cb(peer.id);
  }

  var user = Meteor.userId();
  peer = new Peer(user, {key: "czdh4a0vqplj714i"});

  peer.on('open', function(id) {
    console.log("Success! Your Peer ID is: " + id);
    cb(id);
  });

  // When we receive an incoming connection, insert the data into a local collection
  peer.on('connection', function(conn) {
    if (conn.metadata === "reconnect") {
      return
    }

    var game = conn.label;
    var opponent = conn.peer;

    GamesData.insert({_id: game, 'opponent': opponent}, function(error, success) {
      if (!error) {
        Meteor.call('makeGameLive', game, opponent)
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
