import { HTTP } from 'meteor/http'
//
//  Adds additional fields to the user profile upon registration
//
Accounts.onCreateUser(function(options, user) {

  if (!options.profile.name)
    options.profile.name = user.services.github.username;

  // Sync API Call to get user github avatar
  var getOptions = {
    headers: {
      "user-agent": "Peered"
    }
  }
  var githubData = HTTP.call("GET", 'https://api.github.com/users/' + user.services.github.username, getOptions);
  options.profile.avatar = githubData.data.avatar_url;

  user.profile = options.profile;
  return user;
})
