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

Router.route('/games', {
  name: 'games',
  template: 'games'
});

Router.route('/play', {
  name: 'play',
  template: 'play'
});

Router.route('/create', {
  name: 'create',
  template: 'create'
});
