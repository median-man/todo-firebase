// Function to validate the log in form data. Returns an object containing
// the result and failure messages.
function validateLogInForm(email, pass) {
  var result = { isValid: true };

  // password must be 8 or more characters
  if (pass.length < 8) {
    result.isValid = false;
    result.password = 'Password must have at least 8 characters.';
  }

  // email must not be an empty string
  if (email.length < 1) {
    result.isValid = false;
    result.email = 'Please provide a valid email address.';
  }

  // must be a valid email (contains only valid characters and required characters)
  return result;
}

function initLogIn() {
  var $logInModal = $('#logInModal');
  var $emailInput = $('#email');
  var $passInput = $('#password');
  // show log in modal and give the email field the focus
  $logInModal.on('shown.bs.modal', function () {
    $emailInput.focus();
  });  
  $logInModal.modal();

  // set event listeners for UI events
  $('#logInModal form').on('submit', function (event) {
    event.preventDefault();
    var email = $emailInput.val().trim();
    var password = $passInput.val().trim();
    var formValidation = validateLogInForm(email, password);
    if (formValidation.isValid) {
      console.log('form data is valid. email:', email, ', password:', password);
    } else {
      console.log('invalid form data. email:', email, ', password:', password, formValidation);
    }
    
    $logInModal.modal('hide');
  });
}
$(document).ready(initLogIn);
