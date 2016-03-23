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

  peer.on('connection', function(conn) {
    var game = conn.label;
    var opponent = conn.peer;

    conn.on('close', function() {
      console.log(conn, "closed");
    })

    // GamesData.insert({_id: game, 'opponent': opponent}, function(error, success) {
    //   if (!error) {
    //     Meteor.call('makeGameLive', game)
    //   }
    // });
  });


  //
  //  Central dispatcher for peer based error messages
  //
  peer.on('error', function(error) {
    
    console.log(error.type);
    $('header').append('<div class="alert alert-danger peerError"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>ERROR! </strong>' + error.message + '. Try reloading the page. </div>');
    cb(false);
  });
}

// Accounts.onLogin(function() {
//   peerSetup();
// })
