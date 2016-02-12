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
    var tictactoe = $("#tictactoe:checked").val();
    newGame['type'];
    // Get user chosen game
    if (tictactoe) {
      newGame['type'] = 'tictactoe';
    }
    else {
      newGame['type'] = 'rockpaperscissor';
    }

    newGame['privateGame'] = $('.private_game').bootstrapSwitch('state');

    newGame['betting'] = $('.betswitch').bootstrapSwitch('state');
    // If the user wants to bet, get value
    if (newGame['betting']) {
      newGame['value'] = $('.ether_amount').val();
    }
    Meteor.call('newGame', newGame, function(error, success) {
      if (!error) {
        Router.go()
      }
    })
  }
})
