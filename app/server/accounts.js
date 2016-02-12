configureFacebook = function(config) {
    // first, remove configuration entry in case service is already configured
    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });

   ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: config.clientId,
        secret: config.secret
    });
};

ServiceConfiguration.configurations.remove({
    service: "github"
});

ServiceConfiguration.configurations.insert({
  service: "github",
  clientId: "0751450f79a6a22675c5",
  secret: "60333e037aa6211d37b3da8984f80f6e6fdb1c9c"
});
