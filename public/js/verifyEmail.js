function handleVerifyEmail(auth, actionCode) {
  // Try to apply the email verification code.
  auth.applyActionCode(actionCode).then(function(resp) {
    // Email address has been verified.
    alert("Message: "+ resp);

    // TODO: Display a confirmation message to the user.
    // You could also provide the user with a link back to the app.
  }).catch(function(error) {
    alert('Error: '+ error);
  });
}

function handleRecoverEmail(auth, actionCode) {
  var restoredEmail = null;
  // Confirm the action code is valid.
  auth.checkActionCode(actionCode).then(function(info) {
    // Get the restored email address.
    restoredEmail = info['data']['email'];

    // Revert to the old email.
    return auth.applyActionCode(actionCode);
  }).then(function() {
    // Account email reverted to restoredEmail

    // TODO: Display a confirmation message to the user.

    // You might also want to give the user the option to reset their password
    // in case the account was compromised:
    auth.sendPasswordResetEmail(restoredEmail).then(function() {
      // Password reset confirmation sent. Ask user to check their email.
    }).catch(function(error) {
      // Error encountered while sending password reset code.
    });
  }).catch(function(error) {
    // Invalid code.
  });
}


function handleResetPassword(auth, actionCode) {
  var accountEmail;
  // Verify the password reset code is valid.
  auth.verifyPasswordResetCode(actionCode).then(function(email) {
    var accountEmail = email;

    // TODO: Show the reset screen with the user's email and ask the user for
    // the new password.

    // Save the new password.
    auth.confirmPasswordReset(actionCode, newPassword).then(function(resp) {
      // Password reset has been confirmed and new password updated.

      // TODO: Display a link back to the app, or sign-in the user directly
      // if the page belongs to the same domain as the app:
      // auth.signInWithEmailAndPassword(accountEmail, newPassword);
    }).catch(function(error) {
      // Error occurred during confirmation. The code might have expired or the
      // password is too weak.
    });
  }).catch(function(error) {
    // Invalid or expired action code. Ask user to try to reset the password
    // again.
  });
}







document.addEventListener('DOMContentLoaded', function() {
  // TODO: Implement getParameterByName()

  // Get the action to complete.
  var mode = getParameterByName('mode');
  // Get the one-time code from the query parameter.
  var actionCode = getParameterByName('oobCode'};
  // (Optional) Get the API key from the query parameter.
  var apiKey = getParameterByName('apiKey'};

  // Configure the Firebase SDK.
  // This is the minimum configuration required for the API to be used.
  var config = {
    // Initialize Firebase
        var config = {
            apiKey: "AIzaSyAWjJlYl96ut9FeBRGpl-HDV8_3g-HqZNs",
            authDomain: "watchtower-d7e58.firebaseapp.com",
            databaseURL: "https://watchtower-d7e58.firebaseio.com",
            storageBucket: "watchtower-d7e58.appspot.com",
            messagingSenderId: "705458577363"
        };
        firebase.initializeApp(config);
  };
  var app = firebase.initializeApp(config);
  var auth = app.auth();

  // Handle the user management action.
  switch (mode) {
    case 'resetPassword':
      // Display reset password handler and UI.
      handleResetPassword(auth, actionCode);
      break;
    case 'recoverEmail':
      // Display email recovery handler and UI.
      handleRecoverEmail(auth, actionCode);
      break;
    case 'verifyEmail':
      // Display email verification handler and UI.
      handleVerifyEmail(auth, actionCode);
      break;
    default:
      // Error: invalid mode.
  }
}, false);
