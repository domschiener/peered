var key = Meteor.settings.public.peerjs_key;

peerSetup = function() {
  var user = Meteor.userId();
  peer = new Peer(user, {key: "czdh4a0vqplj714i"});

  if (peer.id) {
    console.log("here")
    return peer.id;
  }

  peer.on('open', function(id) {
    console.log("Success! Your Peer ID is: " + id);
    return id;
  });

  peer.on('connection', function(conn) {

  })

  peer.on('error', function(error) {
    $('header').append('<div class="alert alert-danger peerError"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>ERROR! </strong>' + error.message + ' </div>')
    return false;
  })
}

Accounts.onLogin(function() {
  peerSetup();
})
