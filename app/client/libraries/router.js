/**
  *   Main Route
  **/

FlowRouter.route('/', {
  action: function () {
    BlazeLayout.render('home',  { landing: "landing", what: "what" });
  }
})

/**
  *   Route or signing up or logging
  **/

FlowRouter.route('/join', {
  triggersEnter: [function (context, redirect) {
    //If user is already logged in, redirect to games
    if (Meteor.user()) {
      redirect('/games');
    }
  }],
  action: function () {
    BlazeLayout.render('join');
  }
})

/**
  *   Route that lists all available Games
  **/

FlowRouter.route('/games', {
  action: function () {
    BlazeLayout.render('games');
  }
})

/**
  *   Route for Creating a new Game
  **/

FlowRouter.route('/create', {
  triggersEnter: [function (context, redirect) {
    //If user is not logged in, redirect to login
    if (!Meteor.user()) {
      redirect('/join');
    }
  }],
  action: function () {
    BlazeLayout.render('create');
  }
})

/**
  *    Shows the users Eth balance and makes it possible to deposit / withdraw
  **/

FlowRouter.route('/balance', {
  // triggersEnter: [function (context, redirect) {
  //   //If user is not logged in, redirect to login
  //   if (!Meteor.user()) {
  //     redirect('/join');
  //   }
  // }],
  action: function () {
    BlazeLayout.render('balance');
  }
})

/**
  *   For playing an individual game
  **/

FlowRouter.route('/play/:_id', {
  subscriptions: function(params) {
    this.register('thisGame', Meteor.subscribe('thisGame', params._id));
  },
  action: function () {
    BlazeLayout.render('play');
  }
})
