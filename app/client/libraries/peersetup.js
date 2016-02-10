var key = Meteor.settings.public.peerjs_key;

peer = new Peer({key: "ce8zkrdhyj51xlxr"});

peer.on('error', function(err) {
  console.log(err);
});
