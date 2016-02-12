Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/join', {
  name: 'join',
  template: 'join',
  onBeforeAction: function() {
    if (Meteor.user()) {
      Router.go('play');
    }
    this.next();
  }
});

Router.route('/play', {
  name: 'play',
  template: 'play'
});

Router.route('/game', {
  template: 'game'
});

Router.route('/create', {
  name: 'create',
  template: 'create'
});
