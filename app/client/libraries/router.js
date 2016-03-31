// // Main route
//
// FlowRouter.route('/', {
//   action: function () {
//     BlazeLayout.render('home');
//   }
// })
//
// FlowRouter.route('/join', {
//   triggersEnter: [function (context, redirect) {
//     if (Meteor.user()) {
//       redirect('/games');
//     }
//   }],
//   action: function () {
//     BlazeLayout.render('join');
//   }
// })
