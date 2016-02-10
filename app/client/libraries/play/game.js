Template.game.rendered = function() {
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });
}

Template.game.events({
  'click .cell': function(event) {
    //var turns = Games.findOne({_id: this._id}).turns;
    var cell = event.currentTarget.id;
    console.log(cell);
  }
})
