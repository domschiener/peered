var key = Meteor.settings.public.peerjs_key;

peerSetup = function() {
  var user = Meteor.userId();
  peer = new Peer(user, {key: "ce8zkrdhyj51xlxr"});

  peer.on('open', function(id) {
    console.log("Success! Your Peer ID is:" + id);
  });
}

Accounts.onLogin(function() {
  peerSetup();
})
