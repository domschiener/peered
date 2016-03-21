var key = Meteor.settings.public.peerjs_key;
var isPeerReady = false;

peerSetup = function() {
  if (isPeerReady) {
    return peer.id;
  }

  var user = Meteor.userId();
  peer = new Peer(user, {key: "czdh4a0vqplj714i"});

  peer.on('open', function(id) {
    console.log("Success! Your Peer ID is: " + id);
    isPeerReady = true;
    return id;
  });

  peer.on('connection', function(conn) {
    var game = conn.label;
    var opponent = conn.peer;
    GamesData.insert({_id: game, 'opponent': opponent}, function(error, success) {
      if (!error) {
        Meteor.call('makeGameLive', game)
      }
    });
  });

  peer.on('error', function(error) {
    $('header').append('<div class="alert alert-danger peerError"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>ERROR! </strong>' + error.message + '. Try reloading the page. </div>');
    isPeerReady = false;
    return false;
  });
}

Accounts.onLogin(function() {
  peerSetup();
})
