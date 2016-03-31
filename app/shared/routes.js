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
  waitOn: function() {
    return Meteor.subscribe('gameListings');
  },
  data: function() {
    return Games.findOne({_id: this.params._id});
  },
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      this.render('join');
    }
    else {
      if (!Meteor.user()['games']) {
        Router.go('loading', {_id: this.params._id})
        return
      }

      // If the user is part of the game, continue, else render loading
      if (Meteor.user()['games'].indexOf(this.params._id) > -1) {
        this.next();
      }
      else {
        Router.go('loading', {_id: this.params._id})
      }
    }
  }
});

Router.route('/loading/:_id', {
  name: 'loading',
  template: 'loading',
  waitOn: function() {
    return Meteor.subscribe('gameListings');
  },
  data: function() {
    return Games.findOne({_id: this.params._id});
  },
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      Router.go('join');
    }

    this.next();
  }
});
