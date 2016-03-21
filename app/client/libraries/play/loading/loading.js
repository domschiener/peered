Template.loading.onRendered(function() {
  var currentUser = peerSetup();

  if (currentUser) {
    console.log(currentUser);
    // GamesData.insert({'hello': 'littletesxt'});
    // var connection = peer.connect(peerGamer, gameID);
  }
})
