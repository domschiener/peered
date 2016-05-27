// Main route

FlowRouter.route('/', {
  action: function () {
    BlazeLayout.render('home',  { landing: "landing", what: "what" });
  }
})

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

FlowRouter.route('/games', {
  action: function () {
    BlazeLayout.render('games');
  }
})

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

FlowRouter.route('/play/:_id', {
  subscriptions: function(params) {
    this.register('thisGame', Meteor.subscribe('thisGame', params._id));
  },
  action: function () {
    BlazeLayout.render('play');
  }
})
