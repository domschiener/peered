Template.join.events({
  'click .back__home': function() {
    Router.go('home');
  },
  'click .github_login' : function() {
    Meteor.loginWithGithub({loginStyle: "redirect"});
  }
})

// If the user is logged in, redirect to games
Accounts.onLogin(function() {
  var path = FlowRouter.current().path;
  // we only do it if the user is in the login page
  if(path === "/join"){
    FlowRouter.go("/games");
  }
});
