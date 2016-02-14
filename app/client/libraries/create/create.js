Template.create.rendered = function() {
  $(".bootswitch").bootstrapSwitch({
    onText: "Yes",
    offText: "No"
  });
  $(".betswitch").bootstrapSwitch({
    onText: "Yes",
    offText: "No",
    onSwitchChange: function(event, state) {
      if (state) {
        $('.betting').removeClass('hide');
      }
      else {
        $('.betting').addClass('hide');
      }
    }
  });
}

Template.create.events({
  'click #submitGame': function() {
    var newGame = {};
    newGame['creator'] = Meteor.user().profile.name;
    newGame['peer'] = peer.id;

    if (!newGame['peer']) {
      // If user is currently not connected, we try to reconnect
      var peerID = peerSetup();
      if (peerID) {
        newGame['peer'] = peerID;
      }
      else {
        return false;
      }
    }

    newGame['open'] = true;

    var tictactoe = $("#tictac:checked").val();
    newGame['type'];
    // Get user chosen game
    if (tictactoe) {
      newGame['type'] = 'TicTacToe';
    }
    else {
      newGame['type'] = 'RockPaperScissor';
    }

    newGame['privateGame'] = $('.private_game').bootstrapSwitch('state');

    newGame['betting'] = $('.betswitch').bootstrapSwitch('state');
    newGame['value'] = 0;
    // If the user wants to bet, get value
    if (newGame['betting']) {
      newGame['value'] = $('.ether_amount').val();
    }
    Meteor.call('newGame', newGame, function(error, success) {
      if (!error) {
        var route = '/play/' + success;
        Router.go(route);
      }
    })
  }
})
