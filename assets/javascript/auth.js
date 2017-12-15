function initLogIn() {
  // show log in modal
  var $logInModal = $('#logInModal').modal();

  // set event listeners for UI events
  $('#logInModal form').on('submit', function (event) {
    event.preventDefault();
    var formData = {
      userName: $('#email').val().trim(),
      password: $('#password').val().trim()
    };
    console.log('log in submitted', formData);
    $logInModal.modal('hide');
  });
}
$(document).ready(initLogIn);
