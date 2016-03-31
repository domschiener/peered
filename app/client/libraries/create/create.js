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
    var creator = Meteor.user()
    newGame['creator'] = creator.profile.name;
    if (!newGame['creator'])
      newGame['creator'] = creator.services.github.username;
    newGame['peer'] = creator._id;

    newGame['ready'] = false;

    var tictactoe = $("#tictac:checked").val();
    newGame['type'];
    // Get user chosen game
    if (tictactoe) {
      newGame['type'] = 'TicTacToe';
    }
    else {
      newGame['type'] = 'RockPaperScissor';
    }

    newGame['open'] = $('.private_game').bootstrapSwitch('state');

    newGame['betting'] = $('.betswitch').bootstrapSwitch('state');
    newGame['value'] = 0;
    // If the user wants to bet, get value
    if (newGame['betting']) {
      newGame['value'] = $('.ether_amount').val();
    }
    Meteor.call('newGame', newGame, function(error, success) {
      if (!error) {
        var route = '/play/' + success;
        FlowRouter.go(route);
      }
    })
  }
})
