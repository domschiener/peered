Template.create.rendered = function() {
  $(".bootswitch").bootstrapSwitch({
    onText: "Yes",
    offText: "No"
  });
  $(".betswitch").bootstrapSwitch({
    onText: "Yes",
    offText: "No",
    onSwitchChange: function(event, state) {
      if (state) {
        $('.betting').removeClass('hide');
      }
      else {
        $('.betting').addClass('hide');
      }
    }
  });
}
