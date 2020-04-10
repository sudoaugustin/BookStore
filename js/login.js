const auth=require('./auth');
const $=require('jquery');
$(document).ready(function () {
  $(".pwdVisibilityIcon").click(function(e) {
    auth.tglPasswordVisibility(e.currentTarget.attributes.for.value);
  });
  $(".textField input,.passwordField input").on('input',function(e) {
    auth.handleChange(e.currentTarget.attributes.name.value);
  });

});
