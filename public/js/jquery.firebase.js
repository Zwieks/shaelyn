firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;
    if(user != null){
    	var email_id = user.email;

    	alert("Welcome" + email_id);
    }
  } else {
    // No user is signed in.
    alert('NO');
  }
});

//This will sign-in the user
function login() {
	var email = document.getElementById("email_field").value,
		password = document.getElementById("password_field").value;

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  	// Handle Errors here.
	  	var errorCode = error.code;
	  	var errorMessage = error.message;

	  	alert("Error : " + errorMessage);
	  	// ...
	});
}

$(document).on("click","#js-login",function() {
	login();
});

$(document).on("click","#js-logout",function() {
	signOut();
});

//This will sign-out the user
function logout() {
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
}