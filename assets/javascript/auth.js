// Function to create a new user account. Returns promise containing firebase.User object.
function createNewUser(email, password) {
  console.log('creating new user. email: ' + email + ', password: ' + password);
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('failed to create account', error);
      // ...
    }).then(function (user) {
      console.log('successfully created accounts', user);
    });
}

function signInUser(email, password) {
  console.log('signing in user. email: ' + email + ', password: ' + password);
  return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('failed to sign in', error);    
    // ...
  }).then(function (user) {
    console.log('successfully signed in', user);
  });
}

// Function to validate the log in form data. Returns an object containing
// the result and failure messages.
function validateLogInForm() {  
  var $emailInput = $('#email');
  var $passInput = $('#password');
  var email = $emailInput.val().trim();
  var pass = $passInput.val().trim();
  var result = {
    isValid: true,
    password: pass,
    email: email,
    error: false
  };

  // password must be 8 or more characters
  if (pass.length < 8) {
    result.isValid = false;
    result.error.password = 'Password must have at least 8 characters.';
  }

  // email must not be an empty string
  if (email.length < 1) {
    result.isValid = false;
    result.error.email = 'Please provide a valid email address.';
  }
  return result;
}

function initLogIn() {
  var $logInModal = $('#logInModal');
  var $emailInput = $('#email');

  // show log in modal and give the email field the focus
  $logInModal.on('shown.bs.modal', function () {
    $emailInput.focus();
  });  
  $logInModal.modal();

  // user log in
  $logInModal.find('form').on('submit', function (event) {
    event.preventDefault();
    var formData = validateLogInForm();
    if (formData.isValid) {
      console.log('form data is valid.', formData);
      signInUser(formData.email, formData.password);
    } else {
      console.log('invalid form data.', formData);
    }
    
    // $logInModal.modal('hide');
  });

  // user sign
  $('#signUp').on('click', function () {
    var formData = validateLogInForm();
    if (formData.isValid) {
      createNewUser(formData.email, formData.password);
    }
  });
}
$(document).ready(initLogIn);

// test code
$(document).ready(function () {
  $('#email').val('johndrunner@yahoo.com');
  $('#password').val('testtest');
  $('#logInModal').on('shown.bs.modal', function () {
    $(this).find('form').submit();
  });

});
