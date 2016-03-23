Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/join', {
  name: 'join',
  template: 'join',
  onBeforeAction: function() {
    if (Meteor.user()) {
      Router.go('games');
    }
    this.next();
  }
});

Router.route('/create', {
  name: 'create',
  template: 'create',
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      Router.go('join');
    }
    this.next();
  }
});

Router.route('/games', {
  name: 'games',
  template: 'games',
  data: function() {
    var activeGames = Games.find({'game.open': true}, {sort: {createdAt: -1}}).fetch();
    return {'games': activeGames};
  }
});

Router.route('/play/:_id', {
  name: 'play',
  template: 'play',
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      this.render('join');
    }
    else {
      this.next();
    }
  }
});

Router.route('/loading/:_id', {
  name: 'loading',
  template: 'loading',
  data: function() {
    var thisGame = Games.findOne({_id: this.params._id});
    return {'game': thisGame};
  },
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      Router.go('join');
    }

    this.next();
  }
});
