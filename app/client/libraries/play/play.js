Template.play.rendered = function() {

}

Template.play.events({
  'click .cell': function(event) {
    //var turns = Games.findOne({_id: this._id}).turns;
    var cell = event.currentTarget.id;
    console.log(cell);
  }
})
